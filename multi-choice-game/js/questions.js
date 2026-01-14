let questionCounter = 1;

function createQuestion({ typeId, type, body, options, correct, allowMultiple = false, hint = "" }) {
  return {
    id: `q-${questionCounter++}`,
    typeId,
    type,
    body,
    options,
    correct,
    allowMultiple,
    hint,
  };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueNumbers(count, min, max, exclude = new Set()) {
  const set = new Set();
  while (set.size < count) {
    const value = randInt(min, max);
    if (!exclude.has(value)) {
      set.add(value);
    }
  }
  return [...set];
}

export function teenNumberAdditionQuestion() {
  const base = randInt(10, 89);
  const result = base + 10;
  const distractors = uniqueNumbers(2, result - 10, result + 10, new Set([result]));
  const options = shuffle([result, ...distractors]).map((value, index) => ({
    id: `opt-${index}`,
    label: String(value),
  }));

  return createQuestion({
    typeId: "teen-add-10",
    type: "Teen number addition",
    body: [
      { kind: "text", value: "What is the result?" },
      {
        kind: "stack",
        value: {
          lines: [String(base), "+10", "---", "[  ]"],
        },
      },
    ],
    options,
    correct: [options.find((opt) => opt.label === String(result)).id],
    hint: "Add ten to the number.",
  });
}

const COLORS = [
  { name: "red", value: "#e53935" },
  { name: "blue", value: "#1e88e5" },
  { name: "green", value: "#43a047" },
  { name: "orange", value: "#fb8c00" },
];

const SHAPES = [
  { name: "circle", icon: "fa-solid fa-circle" },
  { name: "square", icon: "fa-solid fa-square" },
  { name: "triangle", icon: "fa-solid fa-caret-up" },
  { name: "diamond", icon: "fa-solid fa-diamond" },
];

const COUNT_ICONS = [
  { name: "frog", plural: "frogs", icon: "fa-solid fa-frog" },
  { name: "bird", plural: "birds", icon: "fa-solid fa-dove" },
  { name: "butterfly", plural: "butterflies", icon: "fa-solid fa-butterfly" },
  { name: "cat", plural: "cats", icon: "fa-solid fa-cat" },
  { name: "dog", plural: "dogs", icon: "fa-solid fa-dog" },
  { name: "fish", plural: "fish", icon: "fa-solid fa-fish" },
  { name: "apple", plural: "apples", icon: "fa-solid fa-apple-whole" },
  { name: "carrot", plural: "carrots", icon: "fa-solid fa-carrot" },
  { name: "ice cream", plural: "ice creams", icon: "fa-solid fa-ice-cream" },
  { name: "star", plural: "stars", icon: "fa-solid fa-star" },
];

const COUNT_COLORS = ["#ff7043", "#29b6f6", "#66bb6a", "#ffee58", "#ab47bc", "#8d6e63"];

export function coloredShapeQuestion() {
  const color = COLORS[randInt(0, COLORS.length - 1)];
  const shape = SHAPES[randInt(0, SHAPES.length - 1)];

  const targetKey = `${color.name}-${shape.name}`;
  const used = new Set([targetKey]);
  const options = [{
    id: "opt-0",
    iconClass: shape.icon,
    color: color.value,
    label: "",
    ariaLabel: `${color.name} ${shape.name}`,
  }];

  let optionIndex = 1;
  while (options.length < 3) {
    const nextColor = COLORS[randInt(0, COLORS.length - 1)];
    const nextShape = SHAPES[randInt(0, SHAPES.length - 1)];
    const key = `${nextColor.name}-${nextShape.name}`;
    if (!used.has(key)) {
      used.add(key);
      options.push({
        id: `opt-${optionIndex++}`,
        iconClass: nextShape.icon,
        color: nextColor.value,
        label: "",
        ariaLabel: `${nextColor.name} ${nextShape.name}`,
      });
    }
  }

  const shuffled = shuffle(options);

  return createQuestion({
    typeId: "colored-shape",
    type: "Choose the colored shape",
    body: [
      { kind: "text", value: "Select the shape below:" },
      { kind: "text", value: `${color.name} ${shape.name}`, emphasis: true },
    ],
    options: shuffled,
    correct: [shuffled.find((opt) => opt.ariaLabel === `${color.name} ${shape.name}`).id],
    hint: "Match both the color and the shape.",
  });
}

export function skipCountingQuestion() {
  const step = [2, 5, 10][randInt(0, 2)];
  const start = randInt(0, 20);
  const sequence = Array.from({ length: 4 }, (_, i) => start + i * step);
  const nextValue = start + 4 * step;
  const distractors = uniqueNumbers(2, nextValue - step * 2, nextValue + step * 2, new Set([nextValue]));
  const options = shuffle([nextValue, ...distractors]).map((value, index) => ({
    id: `opt-${index}`,
    label: String(value),
  }));

  return createQuestion({
    typeId: "skip-counting",
    type: "Skip counting",
    body: [
      { kind: "text", value: "What comes next?" },
      { kind: "text", value: `${sequence.join(", ")}, ?` },
    ],
    options,
    correct: [options.find((opt) => opt.label === String(nextValue)).id],
    hint: `Count by ${step}.`,
  });
}

export function whatPlusQuestion() {
  const total = randInt(8, 18);
  const first = randInt(2, total - 2);
  const missing = total - first;
  const distractors = uniqueNumbers(2, 1, 12, new Set([missing]));
  const options = shuffle([missing, ...distractors]).map((value, index) => ({
    id: `opt-${index}`,
    label: String(value),
  }));

  return createQuestion({
    typeId: "what-plus",
    type: "What plus",
    body: [
      { kind: "text", value: "Fill in the blank:" },
      { kind: "text", value: `${first} + [  ] = ${total}` },
    ],
    options,
    correct: [options.find((opt) => opt.label === String(missing)).id],
    hint: "Find the missing addend.",
  });
}

const OPERATORS = [
  { symbol: "+", fn: (a, b) => a + b },
  { symbol: "-", fn: (a, b) => a - b },
  { symbol: "*", fn: (a, b) => a * b },
  { symbol: "÷", fn: (a, b) => (b !== 0 ? a / b : null) },
];

function formatExpression(a, op, b) {
  return `${a} ${op} ${b}`;
}

export function makeNineQuestion() {
  const target = randInt(9, 99);
  const correctPool = [];

  for (let a = 1; a <= 20; a += 1) {
    for (let b = 1; b <= 20; b += 1) {
      OPERATORS.forEach((op) => {
        const value = op.fn(a, b);
        if (Number.isInteger(value) && value === target) {
          if ((op.symbol === "+" || op.symbol === "-") && a > 9 && b > 9) {
            return;
          }
          const label = formatExpression(a, op.symbol, b);
          if (!correctPool.includes(label)) {
            correctPool.push(label);
          }
        }
      });
    }
  }

  if (!correctPool.length) {
    correctPool.push(`${target} + 0`);
  }

  const correctLabel = shuffle(correctPool)[0];
  const used = new Set([correctLabel]);
  const incorrectLabels = [];

  while (incorrectLabels.length < 2) {
    const a = randInt(1, 20);
    const b = randInt(1, 20);
    const op = OPERATORS[randInt(0, OPERATORS.length - 1)];
    const value = op.fn(a, b);
    if (!Number.isInteger(value) || value === target) {
      continue;
    }
    if ((op.symbol === "+" || op.symbol === "-") && a > 9 && b > 9) {
      continue;
    }
    const label = formatExpression(a, op.symbol, b);
    if (!used.has(label)) {
      used.add(label);
      incorrectLabels.push(label);
    }
  }

  const options = shuffle([correctLabel, ...incorrectLabels]).map((label, index) => ({
    id: `opt-${index}`,
    label,
  }));

  const correctId = options.find((opt) => opt.label === correctLabel).id;

  return createQuestion({
    typeId: "make-number",
    type: "Make the number",
    body: [
      { kind: "text", value: `How do you make ${target}?` },
    ],
    options,
    correct: [correctId],
    allowMultiple: false,
    hint: "Pick the expression that equals the number.",
  });
}

export function oneMoreLessQuestion() {
  const base = randInt(1, 98);
  const isMore = Math.random() > 0.5;
  const answer = isMore ? base + 1 : base - 1;
  const distractors = uniqueNumbers(2, answer - 5, answer + 5, new Set([answer]));
  const options = shuffle([answer, ...distractors]).map((value, index) => ({
    id: `opt-${index}`,
    label: String(value),
  }));

  return createQuestion({
    typeId: "one-more-less",
    type: "One more / one less",
    body: [
      { kind: "text", value: `What is one ${isMore ? "more" : "less"} than ${base}?` },
    ],
    options,
    correct: [options.find((opt) => opt.label === String(answer)).id],
    hint: "Add or subtract one.",
  });
}

export function largestSmallestQuestion() {
  const count = randInt(2, 3);
  const values = uniqueNumbers(count, 1, 99);
  const chooseLargest = Math.random() > 0.5;
  const target = chooseLargest ? Math.max(...values) : Math.min(...values);
  const options = shuffle(values).map((value, index) => ({
    id: `opt-${index}`,
    label: String(value),
  }));

  return createQuestion({
    typeId: "largest-smallest",
    type: "Largest / smallest",
    body: [
      { kind: "text", value: `Choose the ${chooseLargest ? "largest" : "smallest"} number.` },
    ],
    options,
    correct: [options.find((opt) => opt.label === String(target)).id],
    hint: "Compare the values.",
  });
}

function formatTimeLabel(hour, minute) {
  const hourLabel = ((hour + 11) % 12) + 1;
  const minuteLabel = minute.toString().padStart(2, "0");
  return `${hourLabel}:${minuteLabel}`;
}

export function timeQuestion() {
  const hour = randInt(1, 12);
  const minuteOptions = [0, 15, 30, 45];
  const minute = minuteOptions[randInt(0, minuteOptions.length - 1)];
  const count = randInt(2, 3);

  const correctLabel = formatTimeLabel(hour, minute);
  const optionsSet = new Set([correctLabel]);

  while (optionsSet.size < count) {
    const nextHour = randInt(1, 12);
    const nextMinute = minuteOptions[randInt(0, minuteOptions.length - 1)];
    optionsSet.add(formatTimeLabel(nextHour, nextMinute));
  }

  const options = shuffle([...optionsSet]).map((label, index) => ({
    id: `opt-${index}`,
    label,
  }));

  return createQuestion({
    typeId: "read-clock",
    type: "Read the clock",
    body: [
      { kind: "text", value: "What time is it?" },
      { kind: "clock", value: { hour, minute } },
    ],
    options,
    correct: [options.find((opt) => opt.label === correctLabel).id],
    hint: "Look at the hour and minute hands.",
  });
}

const NUMBER_FACTS = [
  { prompt: "How many fingers are on one hand?", answer: 5 },
  { prompt: "How many fingers are on two hands?", answer: 10 },
  { prompt: "How many toes are on one foot?", answer: 5 },
  { prompt: "How many wheels are on a bike?", answer: 2 },
  { prompt: "How many wheels are on a car?", answer: 4 },
  { prompt: "How many legs does a dog/cat have?", answer: 4 },
  { prompt: "How many legs does a spider have?", answer: 8 },
  { prompt: "How many legs does a bird have?", answer: 2 },
  { prompt: "How many sides does a triangle have?", answer: 3 },
  { prompt: "How many sides does a square have?", answer: 4 },
  { prompt: "How many days are in a week?", answer: 7 },
  { prompt: "How many months are in a year?", answer: 12 },
  { prompt: "How many eyes do you have?", answer: 2 },
  { prompt: "How many ears do you have?", answer: 2 },
  { prompt: "How many noses do you have?", answer: 1 },
  { prompt: "How many legs does a person have?", answer: 2 },
  { prompt: "How many arms does a person have?", answer: 2 },
  { prompt: "How many wings does a bird have?", answer: 2 },
  { prompt: "How many wheels does a tricycle have?", answer: 3 },
  { prompt: "How many corners does a rectangle have?", answer: 4 },
  { prompt: "How many corners does a triangle have?", answer: 3 },
  { prompt: "How many sides does a pentagon have?", answer: 5 },
];

export function numberFactsQuestion() {
  const fact = NUMBER_FACTS[randInt(0, NUMBER_FACTS.length - 1)];
  const optionCount = randInt(2, 3);
  const distractors = uniqueNumbers(optionCount - 1, 0, 12, new Set([fact.answer]));
  const options = shuffle([fact.answer, ...distractors]).map((value, index) => ({
    id: `opt-${index}`,
    label: String(value),
  }));

  return createQuestion({
    typeId: "number-facts",
    type: "Number facts",
    body: [{ kind: "text", value: fact.prompt }],
    options,
    correct: [options.find((opt) => opt.label === String(fact.answer)).id],
    hint: "Pick the best answer.",
  });
}

function buildScatterPositions(total) {
  const cols = 5;
  const rows = 4;
  const cells = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = ((col + 0.5) / cols) * 100;
      const y = ((row + 0.5) / rows) * 100;
      cells.push({ x, y });
    }
  }

  return shuffle(cells).slice(0, total).map((cell) => ({
    x: Math.min(95, Math.max(5, cell.x + randInt(-6, 6))),
    y: Math.min(90, Math.max(10, cell.y + randInt(-6, 6))),
  }));
}

export function countObjectsQuestion() {
  const total = randInt(5, 15);
  const iconChoices = shuffle(COUNT_ICONS).slice(0, 3);
  const target = iconChoices[0];

  const maxTarget = Math.min(9, total - (iconChoices.length - 1));
  const targetCount = randInt(1, Math.max(1, maxTarget));
  const remaining = total - targetCount;

  const otherCounts = Array(iconChoices.length - 1).fill(1);
  let extra = remaining - otherCounts.length;
  while (extra > 0) {
    otherCounts[randInt(0, otherCounts.length - 1)] += 1;
    extra -= 1;
  }

  const items = [];
  const addItems = (icon, count) => {
    for (let i = 0; i < count; i += 1) {
      items.push({
        iconClass: icon.icon,
        label: icon.name,
        color: COUNT_COLORS[randInt(0, COUNT_COLORS.length - 1)],
      });
    }
  };

  addItems(target, targetCount);
  iconChoices.slice(1).forEach((icon, index) => {
    addItems(icon, otherCounts[index]);
  });

  const positions = buildScatterPositions(items.length);
  const scatterItems = shuffle(items).map((item, index) => ({
    ...item,
    x: positions[index].x,
    y: positions[index].y,
  }));

  const distractors = uniqueNumbers(2, 1, 9, new Set([targetCount]));
  const options = shuffle([targetCount, ...distractors]).map((value, index) => ({
    id: `opt-${index}`,
    label: String(value),
  }));

  return createQuestion({
    typeId: "count-objects",
    type: "Count the objects",
    body: [
      { kind: "text", value: `How many ${target.plural} are there?` },
      { kind: "scatter", value: { items: scatterItems } },
    ],
    options,
    correct: [options.find((opt) => opt.label === String(targetCount)).id],
    hint: `Count the ${target.plural}.`,
  });
}

export const QUESTION_TYPES = [
  { id: "teen-add-10", label: "Teen number addition (+10)", factory: teenNumberAdditionQuestion },
  { id: "colored-shape", label: "Choose the colored shape", factory: coloredShapeQuestion },
  { id: "skip-counting", label: "Skip counting", factory: skipCountingQuestion },
  { id: "what-plus", label: "What plus", factory: whatPlusQuestion },
  { id: "make-number", label: "Make the number", factory: makeNineQuestion },
  { id: "one-more-less", label: "One more / one less", factory: oneMoreLessQuestion },
  { id: "largest-smallest", label: "Largest / smallest", factory: largestSmallestQuestion },
  { id: "read-clock", label: "Read the clock", factory: timeQuestion },
  { id: "number-facts", label: "Number facts", factory: numberFactsQuestion },
  { id: "count-objects", label: "Count the objects", factory: countObjectsQuestion },
];
