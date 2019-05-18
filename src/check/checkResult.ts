import { CheckType } from "./enum/checkType"

export default class CheckResult {
  constructor(public readonly checkType: CheckType, public readonly thing: any) {}
}
