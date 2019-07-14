import {MaybeStatus} from "./maybeStatus"
import {DoType, MaybeResult, OrType, Thing} from "./types"

export default class Maybe<MaybeObject extends any> {
  public static if(thing: Thing, doIt: DoType = it => it): MaybeResult {
    return new Maybe(thing).do(doIt)
  }

  private result: MaybeObject
  private status?: MaybeStatus
  private doRegistered: boolean = false

  constructor(private readonly thing: Thing) {}

  public do(fn: DoType) {
    this.doRegistered = true
    if (this.thing !== undefined && this.thing !== null) {
      this.result = fn(this.thing)
      this.status = MaybeStatus.Thing
      return this
    }

    this.status = MaybeStatus.NotThing
    return this
  }

  public or(fn: OrType) {
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

  public maybe<T>(fn: (got: MaybeObject) => Thing): MaybeResult {
    const got = this.get()
    if (got !== undefined && got !== null) {
      return new Maybe<T>(fn(got))
    }

    return this
  }
}
