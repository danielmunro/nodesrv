import Maybe from "../support/functional/maybe"
import CheckResult from "./checkResult"
import { CheckStatus } from "./checkStatus"
import {CheckType} from "./checkType"
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

  private static getResult(thing: any) {
    if (typeof thing === "function") {
      return thing()
    }

    return thing
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

  public getCheckTypeResult(checkType: CheckType) {
    return new Maybe(this.checkResults.find(r => r.checkType === checkType))
      .do(result => Check.getResult(result.thing))
      .get()
  }
}
