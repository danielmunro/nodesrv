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

  public getThing(lastThing = null): any {
    if (this.confirm) {
      return this.calculateThing(lastThing)
    }

    return !this.calculateThing(lastThing)
  }

  private calculateThing(lastThing = null) {
    if (typeof this.thing === "function") {
      return this.thing(lastThing)
    }

    return this.thing
  }
}
