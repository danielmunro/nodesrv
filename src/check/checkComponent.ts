import { CheckType } from "./checkType"

export default class CheckComponent {
  public readonly isRequired

  constructor(
    public readonly checkType: CheckType,
    public readonly confirm,
    public readonly thing,
    public readonly failMessage: string = null) {
    this.isRequired = this.failMessage !== null
  }

  public getThing(lastThing = null) {
    if (this.confirm) {
      return this.confirmThing(lastThing)
    }

    return !this.confirmThing(lastThing)
  }

  private confirmThing(lastThing = null) {
    if (typeof this.thing === "function") {
      return this.thing(lastThing)
    }

    return this.thing
  }
}
