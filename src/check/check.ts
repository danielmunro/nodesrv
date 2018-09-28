import CheckResult from "./checkResult"
import { CheckStatus } from "./checkStatus"

export default class Check {
  public static ok(result: any = null, checkResults: CheckResult[] = []): Promise<Check> {
    return this.create(CheckStatus.Ok, result, checkResults)
  }

  public static fail(message: string, checkResults: CheckResult[] = []): Promise<Check> {
    return this.create(CheckStatus.Failed, message, checkResults)
  }

  private static create(status: CheckStatus, message: string, checkResults: CheckResult[]): Promise<Check> {
    return Promise.resolve(new Check(status, message, checkResults))
  }

  constructor(
    readonly status: CheckStatus,
    readonly result: any,
    readonly checkResults: CheckResult[] = [],
  ) {}
}
