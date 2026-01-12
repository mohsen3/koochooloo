export class QuizManager {
  constructor({ questionFactories, perLevel = 5 }) {
    this.questionFactories = questionFactories;
    this.perLevel = perLevel;
    this.correct = 0;
    this.incorrect = 0;
    this.level = 1;
    this.current = null;
    this.submitted = false;
  }

  nextQuestion() {
    const factory = this.questionFactories[Math.floor(Math.random() * this.questionFactories.length)];
    this.current = factory();
    this.submitted = false;
    return this.current;
  }

  submitAnswer(selectedIds) {
    if (!this.current || this.submitted) {
      return null;
    }

    const correctSet = new Set(this.current.correct);
    const selectedSet = new Set(selectedIds);

    const isCorrect =
      correctSet.size === selectedSet.size &&
      [...correctSet].every((id) => selectedSet.has(id));

    if (isCorrect) {
      this.correct += 1;
      this.level = Math.floor(this.correct / this.perLevel) + 1;
      this.submitted = true;
    } else {
      this.incorrect += 1;
    }

    const hasAnyCorrect = [...selectedSet].some((id) => correctSet.has(id));
    const isPartial = hasAnyCorrect && !isCorrect;

    return { isCorrect, isPartial, correctIds: [...correctSet] };
  }

  getStats() {
    return {
      correct: this.correct,
      incorrect: this.incorrect,
      level: this.level,
    };
  }
}
