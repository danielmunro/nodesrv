import { CheckType } from "./checkType"

export default class CheckComponent {
  public readonly isRequired

  constructor(
    public readonly checkType: CheckType,
    public readonly confirm,
    private readonly thing,
    public readonly failMessage: string = null) {
    this.isRequired = this.failMessage !== null
  }

  public getThing(captured = null, lastThing = null): any {
    if (this.confirm) {
      return this.calculateThing(captured, lastThing)
    }

    return !this.calculateThing(captured, lastThing)
  }

  private calculateThing(captured = null, lastThing = null) {
    if (typeof this.thing === "function") {
      return this.thing(captured, lastThing)
    }

    return this.thing
  }
}
