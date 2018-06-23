export enum CheckStatus {
  Ok,
  Failed,
}

export default class Check {
  public static ok(message: string): Promise<Check> {
    return this.create(CheckStatus.Ok, message)
  }

  public static fail(message: string): Promise<Check> {
    return this.create(CheckStatus.Failed, message)
  }

  private static create(status: CheckStatus, message: string): Promise<Check> {
    return new Promise((resolve) => resolve(new Check(status, message)))
  }

  constructor(
    readonly status: CheckStatus,
    readonly message: string,
  ) {}
}
