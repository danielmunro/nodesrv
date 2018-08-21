export default class Maybe<T> {
  constructor(private readonly thing) {}

  public do(fn) {
    if (this.thing) {
      fn(this.thing)
    }
  }
}
