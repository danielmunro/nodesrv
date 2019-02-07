import CheckedRequest from "../check/checkedRequest"
import {DamageType} from "../damage/damageType"

export default interface OffensiveSpell {
  getDamageType(): DamageType
  calculateBaseDamage(checkedRequest: CheckedRequest): number
}
