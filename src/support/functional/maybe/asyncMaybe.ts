import {AsyncDoType, Thing} from "./types"

export default class AsyncMaybe<MaybeObject extends any> {
  private result: MaybeObject

  constructor(private readonly thing: Thing) {}

  public async doAsync(fn: AsyncDoType) {
    if (this.thing) {
      this.result = await fn(this.thing)
    }
  }

  public get(): MaybeObject {
    return this.result
  }
}
