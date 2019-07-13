import ObjectLiteral from "../objectLiteral"

enum MaybeStatus {
  Thing,
  NotThing,
}

export default class Maybe<MaybeObject extends ObjectLiteral> {
  public static if(thing: any, doIt: (thing: any) => any = it => it): Maybe<any> {
    return new Maybe(thing).do(doIt)
  }

  private result: MaybeObject
  private status?: MaybeStatus
  private doRegistered: boolean = false

  constructor(private readonly thing: any) {}

  public do(fn: (thing: any) => any) {
    this.doRegistered = true
    if (this.thing) {
      this.result = fn(this.thing)
      this.status = MaybeStatus.Thing
      return this
    }

    this.status = MaybeStatus.NotThing
    return this
  }

  public or(fn: () => any) {
    if (this.status === MaybeStatus.NotThing) {
      this.result = fn()
      if (this.result) {
        this.status = MaybeStatus.Thing
      }
      return this
    }

    return this
  }

  public get(): MaybeObject {
    if (!this.doRegistered) {
      this.do(it => it)
    }
    return this.result
  }

  public maybe(fn: (got: MaybeObject) => any): Maybe<any> {
    const got = this.get()
    if (got) {
      return new Maybe(fn(got))
    }

    return this
  }
}
