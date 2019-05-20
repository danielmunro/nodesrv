import { CheckType } from "./enum/checkType"

export default interface CheckResult {
  readonly checkType: CheckType,
  readonly thing: any,
}
