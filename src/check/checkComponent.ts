import { CheckType } from "./checkType"

export default class CheckComponent {
  public readonly isRequired

  constructor(public readonly checkType: CheckType, public readonly thing, public readonly failMessage: string = null) {
    this.isRequired = this.failMessage !== null
  }

  public getThing() {
    if (typeof this.thing === "function") {
      return this.thing()
    }

    return this.thing
  }
}
