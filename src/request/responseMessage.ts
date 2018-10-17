import {Mob} from "../mob/model/mob"
import { format } from "../support/string"

export default class ResponseMessage {
  constructor(
    public readonly requestCreator: Mob,
    public readonly templateString: string,
    public readonly toRequestCreator = null,
    public readonly toTarget = toRequestCreator,
    public readonly toObservers = toTarget,
  ) {}

  public toString() {
    return this.getMessageToRequestCreator()
  }

  public getMessageToRequestCreator(): string {
    return this.toRequestCreator ?
    format(this.templateString, { requestCreator: "you", ...this.toRequestCreator })
      : this.templateString
  }

  public getMessageToTarget(): string {
    return format(
      this.templateString,
      { target: "you", requestCreator: this.requestCreator.name, ...this.toTarget})
  }

  public getMessageToObservers(): string {
    return format(
      this.templateString,
      { requestCreator: this.requestCreator.name, ...this.toObservers})
  }
}
