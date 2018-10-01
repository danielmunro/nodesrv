import CheckResult from "./checkResult"
import { CheckStatus } from "./checkStatus"
import Cost from "./cost/cost"

export default class Check {
  public static ok(result: any = null, checkResults: CheckResult[] = [], costs: Cost[] = []): Promise<Check> {
    return this.create(CheckStatus.Ok, result, checkResults, costs)
  }

  public static fail(message: string, checkResults: CheckResult[] = [], costs: Cost[] = []): Promise<Check> {
    return this.create(CheckStatus.Failed, message, checkResults, costs)
  }

  private static create(
    status: CheckStatus,
    message: string,
    checkResults: CheckResult[],
    costs: Cost[]): Promise<Check> {
    return Promise.resolve(new Check(status, message, checkResults, costs))
  }

  constructor(
    public readonly status: CheckStatus,
    public readonly result: any,
    public readonly checkResults: CheckResult[] = [],
    public readonly costs: Cost[] = [],
  ) {}

  public isOk(): boolean {
    return this.status === CheckStatus.Ok
  }
}
