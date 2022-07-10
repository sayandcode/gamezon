export default class SequentialExecutionQueue {
  #taskStack;

  constructor() {
    this.#taskStack = Promise.resolve();
  }

  push(fn) {
    const prevTask = this.#taskStack;
    const newTask = prevTask.then(fn, fn); // nest fn runs on prev success/failure

    this.#taskStack = newTask;
  }
}
