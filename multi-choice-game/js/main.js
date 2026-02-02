import { QUESTION_TYPES } from "./questions.js";
import { QuizManager } from "./manager.js";

const SETTINGS_KEY = "kiddo-quiz-settings";

function loadEnabledTypes() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return new Set(QUESTION_TYPES.map((type) => type.id));
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return new Set(QUESTION_TYPES.map((type) => type.id));
    }
    const valid = new Set(QUESTION_TYPES.map((type) => type.id));
    const filtered = parsed.filter((id) => valid.has(id));
    return new Set(filtered.length ? filtered : valid);
  } catch (error) {
    return new Set(QUESTION_TYPES.map((type) => type.id));
  }
}

function saveEnabledTypes(enabledIds) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify([...enabledIds]));
}

let enabledTypeIds = loadEnabledTypes();
const manager = new QuizManager({ questionFactories: getEnabledFactories() });

const questionTypeEl = document.getElementById("question-type");
const questionBodyEl = document.getElementById("question-body");
const questionHintEl = document.getElementById("question-hint");
const optionsEl = document.getElementById("options");
const submitBtn = document.getElementById("submit");
const feedbackEl = document.getElementById("feedback");
const settingsToggleBtn = document.getElementById("settings-toggle");
const settingsPanel = document.getElementById("settings-panel");
const settingsList = document.getElementById("settings-list");
const settingsSelectAll = document.getElementById("settings-select-all");
const settingsSelectNone = document.getElementById("settings-select-none");

const levelEl = document.getElementById("level");
const correctEl = document.getElementById("correct-count");
const incorrectEl = document.getElementById("incorrect-count");

let selected = new Set();
let feedbackTimeout = null;

function createClock(hour, minute) {
  const clock = document.createElement("div");
  clock.className = "clock";

  const face = document.createElement("div");
  face.className = "clock__face";

  for (let i = 1; i <= 12; i += 1) {
    const number = document.createElement("div");
    number.className = "clock__number";
    number.textContent = String(i);
    number.style.setProperty("--position", i);
    face.appendChild(number);
  }

  const minuteLabels = [
    { label: "00", position: 12 },
    { label: "15", position: 3 },
    { label: "30", position: 6 },
    { label: "45", position: 9 },
  ];
  minuteLabels.forEach((minute) => {
    const marker = document.createElement("div");
    marker.className = "clock__minute";
    marker.textContent = minute.label;
    marker.style.setProperty("--position", minute.position);
    face.appendChild(marker);
  });

  const hourHand = document.createElement("div");
  hourHand.className = "clock__hand clock__hand--hour";

  const minuteHand = document.createElement("div");
  minuteHand.className = "clock__hand clock__hand--minute";

  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  hourHand.style.setProperty("--angle", `${hourAngle}deg`);
  minuteHand.style.setProperty("--angle", `${minuteAngle}deg`);

  face.appendChild(hourHand);
  face.appendChild(minuteHand);
  clock.appendChild(face);

  return clock;
}

function updateStats() {
  const { correct, incorrect, level } = manager.getStats();
  levelEl.textContent = level;
  correctEl.textContent = correct;
  incorrectEl.textContent = incorrect;
}

function clearFeedback() {
  if (feedbackTimeout) {
    clearTimeout(feedbackTimeout);
    feedbackTimeout = null;
  }
  feedbackEl.textContent = "";
  feedbackEl.classList.remove("correct", "incorrect", "visible");
}

function getEnabledFactories() {
  return QUESTION_TYPES.filter((type) => enabledTypeIds.has(type.id)).map((type) => type.factory);
}

function renderBody(bodyItems) {
  questionBodyEl.innerHTML = "";
  bodyItems.forEach((item) => {
    if (item.kind === "text") {
      const p = document.createElement("p");
      p.textContent = item.value;
      if (item.emphasis) {
        const strong = document.createElement("strong");
        strong.textContent = item.value;
        p.textContent = "";
        p.appendChild(strong);
      }
      questionBodyEl.appendChild(p);
    } else if (item.kind === "icon") {
      const icon = document.createElement("i");
      icon.className = `q-icon ${item.value}`;
      if (item.color) {
        icon.style.color = item.color;
      }
      questionBodyEl.appendChild(icon);
    } else if (item.kind === "stack") {
      const mathStack = document.createElement("div");
      mathStack.className = "math-stack";

      const lines = item.value?.lines || [];
      const width = lines
        .filter((line) => line !== "---")
        .reduce((max, line) => Math.max(max, line.length), 0);
      mathStack.style.setProperty("--math-width", `${Math.max(width, 2)}ch`);

      lines.forEach((line) => {
        if (line === "---") {
          const rule = document.createElement("div");
          rule.className = "math-stack__rule";
          mathStack.appendChild(rule);
          return;
        }
        const row = document.createElement("div");
        row.className = "math-stack__line";
        row.textContent = line;
        mathStack.appendChild(row);
      });

      questionBodyEl.appendChild(mathStack);
    } else if (item.kind === "clock") {
      questionBodyEl.appendChild(createClock(item.value.hour, item.value.minute));
    } else if (item.kind === "scatter") {
      const field = document.createElement("div");
      field.className = "scatter-field";
      const items = item.value?.items || [];

      items.forEach((scatterItem) => {
        const icon = document.createElement("i");
        icon.className = `scatter-item ${scatterItem.iconClass}`;
        icon.style.left = `${scatterItem.x}%`;
        icon.style.top = `${scatterItem.y}%`;
        if (scatterItem.color) {
          icon.style.color = scatterItem.color;
        }
        if (scatterItem.label) {
          icon.setAttribute("aria-label", scatterItem.label);
        }
        field.appendChild(icon);
      });

      questionBodyEl.appendChild(field);
    } else if (item.kind === "direction-row") {
      const row = document.createElement("div");
      row.className = "direction-row";
      row.dataset.position = item.value?.position || "center";

      ["left", "center", "right"].forEach((position) => {
        const slot = document.createElement("div");
        slot.className = "direction-slot";
        slot.dataset.position = position;
        if (position === row.dataset.position) {
          const marker = document.createElement("div");
          marker.className = "direction-marker";
          marker.innerHTML = '<i class="fa-solid fa-star"></i>';
          slot.appendChild(marker);
        }
        row.appendChild(slot);
      });

      questionBodyEl.appendChild(row);
    }
  });
}

function renderOptions(question) {
  optionsEl.innerHTML = "";
  selected = new Set();

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.dataset.optionId = option.id;
    if (option.ariaLabel) {
      button.setAttribute("aria-label", option.ariaLabel);
      button.classList.add("option--icon-only");
    }

    if (option.iconClass) {
      const icon = document.createElement("i");
      icon.className = `opt-icon ${option.iconClass} fa-fw`;
      if (option.color) {
        icon.style.color = option.color;
      }
      button.appendChild(icon);
    }

    if (option.label) {
      const label = document.createElement("span");
      label.textContent = option.label;
      button.appendChild(label);
    }

    button.addEventListener("click", () => {
      if (manager.submitted) {
        return;
      }

      const optionId = option.id;
      if (question.allowMultiple) {
        if (selected.has(optionId)) {
          selected.delete(optionId);
          button.classList.remove("selected");
        } else {
          selected.add(optionId);
          button.classList.add("selected");
        }
      } else {
        selected = new Set([optionId]);
        optionsEl.querySelectorAll(".option").forEach((opt) => {
          opt.classList.toggle("selected", opt.dataset.optionId === optionId);
        });
      }
    });

    optionsEl.appendChild(button);
  });
}

function renderEmptyState() {
  questionTypeEl.textContent = "No question types enabled";
  questionHintEl.textContent = "Open settings to enable questions.";
  questionBodyEl.innerHTML = "";
  optionsEl.innerHTML = "";
  submitBtn.disabled = true;
  clearFeedback();
}

function renderQuestion(question) {
  if (!question) {
    renderEmptyState();
    return;
  }
  questionTypeEl.textContent = question.type;
  questionHintEl.textContent = question.hint || "";
  renderBody(question.body);
  renderOptions(question);
  submitBtn.disabled = false;
  clearFeedback();
}

function showFeedback(message, isCorrect) {
  clearFeedback();
  feedbackEl.textContent = message;
  feedbackEl.classList.add(isCorrect ? "correct" : "incorrect");
  requestAnimationFrame(() => {
    feedbackEl.classList.add("visible");
  });
  feedbackTimeout = setTimeout(() => {
    feedbackEl.classList.remove("visible");
  }, 400);
}

function start() {
  updateStats();
  const question = manager.nextQuestion();
  renderQuestion(question);
}

function renderSettings() {
  settingsList.innerHTML = "";
  QUESTION_TYPES.forEach((type) => {
    const label = document.createElement("label");
    label.className = "settings-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = enabledTypeIds.has(type.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        enabledTypeIds.add(type.id);
      } else {
        enabledTypeIds.delete(type.id);
      }
      saveEnabledTypes(enabledTypeIds);
      manager.questionFactories = getEnabledFactories();
      if (!manager.questionFactories.length) {
        renderEmptyState();
        return;
      }
      if (!manager.current || !enabledTypeIds.has(manager.current.typeId)) {
        const next = manager.nextQuestion();
        renderQuestion(next);
      }
    });

    const text = document.createElement("span");
    text.textContent = type.label;

    label.appendChild(checkbox);
    label.appendChild(text);
    settingsList.appendChild(label);
  });
}

function setAllTypes(enabled) {
  if (enabled) {
    enabledTypeIds = new Set(QUESTION_TYPES.map((type) => type.id));
  } else {
    enabledTypeIds = new Set();
  }
  saveEnabledTypes(enabledTypeIds);
  manager.questionFactories = getEnabledFactories();
  renderSettings();
  if (!manager.questionFactories.length) {
    renderEmptyState();
  } else {
    const next = manager.nextQuestion();
    renderQuestion(next);
  }
}

submitBtn.addEventListener("click", () => {
  if (!selected.size) {
    showFeedback("Choose an option first.", false);
    return;
  }

  const result = manager.submitAnswer([...selected]);
  if (!result) {
    return;
  }

  if (result.isCorrect) {
    const praise = ["Awesome!", "Great job!", "Wonderful!", "Nice work!", "Excellent!"];
    showFeedback(praise[Math.floor(Math.random() * praise.length)], true);
    updateStats();
    submitBtn.disabled = true;
    setTimeout(() => {
      const question = manager.nextQuestion();
      renderQuestion(question);
    }, 800);
  } else {
    if (result.isPartial) {
      showFeedback("Half way there.", false);
    } else {
      showFeedback("Not quite. Try again.", false);
    }
    updateStats();
  }
});

settingsToggleBtn.addEventListener("click", () => {
  const isHidden = settingsPanel.hasAttribute("hidden");
  if (isHidden) {
    settingsPanel.removeAttribute("hidden");
  } else {
    settingsPanel.setAttribute("hidden", "");
  }
});

settingsSelectAll.addEventListener("click", () => {
  setAllTypes(true);
});

settingsSelectNone.addEventListener("click", () => {
  setAllTypes(false);
});

renderSettings();
start();
