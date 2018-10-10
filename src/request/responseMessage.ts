export default class ResponseMessage {
  constructor(
    public readonly toRequestCreator: string,
    public readonly toTarget: string = null,
    public readonly toObservers: string = null,
  ) {}

  public toString() {
    return this.toRequestCreator
  }
}
