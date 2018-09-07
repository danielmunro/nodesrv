export enum CheckStatus {
  Ok,
  Failed,
}

export default class Check {
  public static ok(result: any = null): Promise<Check> {
    return this.create(CheckStatus.Ok, result)
  }

  public static fail(message: string): Promise<Check> {
    return this.create(CheckStatus.Failed, message)
  }

  private static create(status: CheckStatus, message: string): Promise<Check> {
    return Promise.resolve(new Check(status, message))
  }

  constructor(
    readonly status: CheckStatus,
    readonly result: any,
  ) {}

  public isOk(): boolean {
    return this.status === CheckStatus.Ok
  }
}
