import { CheckType } from "./checkType"

export default class CheckComponent {
  public readonly isRequired

  constructor(public readonly checkType: CheckType, public readonly thing, public readonly failMessage: string = null) {
    this.isRequired = this.failMessage !== null
  }
}
