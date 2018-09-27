import { ActionOutcome } from "../action/actionOutcome"

export default class ResponseAction {
  constructor(public readonly actionOutcome: ActionOutcome, public readonly thing) {}

  public wasItemCreated(): boolean {
    return this.actionOutcome === ActionOutcome.ItemCreated
  }

  public wasItemDestroyed(): boolean {
    return this.actionOutcome === ActionOutcome.ItemDestroyed
  }
}
