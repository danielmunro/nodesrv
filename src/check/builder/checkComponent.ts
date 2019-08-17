import { CheckType } from "../enum/checkType"

export default class CheckComponent<T> {
  public readonly isRequired: boolean

  constructor(
    public readonly checkType: CheckType,
    public readonly confirm: boolean,
    private readonly thing: T,
    public readonly failMessage?: string) {
    this.isRequired = this.failMessage !== undefined
  }

  public getThing(captured?: any, lastThing?: any): any {
    if (this.confirm) {
      return this.calculateThing(captured, lastThing)
    }

    return !this.calculateThing(captured, lastThing)
  }

  private calculateThing(captured?: any, lastThing?: any) {
    if (typeof this.thing === "function") {
      return this.thing(captured ? captured : lastThing, lastThing)
    }

    return this.thing
  }
}
