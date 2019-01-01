import { ActionOutcome } from "../action/actionOutcome"

export default class ResponseAction {
  constructor(public readonly actionOutcome: ActionOutcome, public readonly thing) {}
}
