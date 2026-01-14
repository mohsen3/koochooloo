import { QUESTION_FACTORIES } from "./questions.js";
import { QuizManager } from "./manager.js";

const manager = new QuizManager({ questionFactories: QUESTION_FACTORIES });

const questionTypeEl = document.getElementById("question-type");
const questionBodyEl = document.getElementById("question-body");
const questionHintEl = document.getElementById("question-hint");
const optionsEl = document.getElementById("options");
const submitBtn = document.getElementById("submit");
const feedbackEl = document.getElementById("feedback");

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
    } else if (item.kind === "clock") {
      questionBodyEl.appendChild(createClock(item.value.hour, item.value.minute));
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

function renderQuestion(question) {
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

start();
