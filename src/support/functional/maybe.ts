enum MaybeStatus {
  Thing,
  NotThing,
}

export default class Maybe {
  public static if(thing: any, doIt: (thing: any) => {}): any | void {
    if (thing) {
      return doIt(thing)
    }
  }

  private result: any
  private status?: MaybeStatus

  constructor(private readonly thing: any) {}

  public do(fn: (thing: any) => {}) {
    if (this.thing) {
      this.result = fn(this.thing)
      this.status = MaybeStatus.Thing
      return this
    }

    this.status = MaybeStatus.NotThing
    return this
  }

  public or(fn: () => {}) {
    if (this.status === MaybeStatus.NotThing) {
      this.result = fn()
      return this
    }

    return this
  }

  public get() {
    if (this.result === undefined) {
      this.do(() => this.thing)
    }

    return this.result
  }
}
