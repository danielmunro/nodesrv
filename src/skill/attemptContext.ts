import { Trigger } from "../mob/trigger"

export default class AttemptContext {
  constructor(public readonly trigger: Trigger, public readonly subject) {}
}
