import {Mob} from "../mob/model/mob"
import { format } from "../support/string"

export default class ResponseMessage {
  private toAll: boolean = true

  constructor(
    public readonly requestCreator: Mob,
    public readonly templateString: string,
    public readonly toRequestCreator?: object,
    public readonly toTarget = toRequestCreator,
    public readonly toObservers = toTarget) {}

  public onlySendToRequestCreator(): ResponseMessage {
    this.toAll = false
    return this
  }

  public getMessageToRequestCreator(): string {
    return this.toRequestCreator ?
    format(this.templateString, { requestCreator: "you", ...this.toRequestCreator })
      : this.templateString
  }

  public getMessageToTarget(): string {
    if (!this.toAll) {
      return ""
    }

    return this.toTarget ?
      format(this.templateString,
        { target: "you", requestCreator: this.requestCreator.name, ...this.toTarget})
      : this.templateString
  }

  public getMessageToObservers(): string {
    if (!this.toAll) {
      return ""
    }

    return this.toObservers ?
    format(this.templateString,
      { requestCreator: this.requestCreator.name, ...this.toObservers})
      : this.templateString
  }
}
