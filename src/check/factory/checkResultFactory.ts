import CheckResult from "../checkResult"
import {CheckType} from "../enum/checkType"

export default function(checkType: CheckType, thing: any): CheckResult {
  return { checkType, thing }
}
