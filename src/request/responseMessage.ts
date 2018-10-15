import { format } from "../support/string"

export default class ResponseMessage {
  constructor(
    public readonly templateString: string,
    public readonly toRequestCreator = [],
    public readonly toTarget = [],
    public readonly toObservers = toTarget,
  ) {}

  public toString() {
    return format(this.templateString, this.toRequestCreator)
  }
}
