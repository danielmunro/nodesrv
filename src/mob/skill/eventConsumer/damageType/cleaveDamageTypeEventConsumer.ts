import { injectable } from "inversify"
import {DamageType} from "../../../fight/enum/damageType"
import {SkillType} from "../../skillType"
import DamageTypeEventConsumer from "../damageTypeEventConsumer"

@injectable()
export default class CleaveDamageTypeEventConsumer extends DamageTypeEventConsumer {
  constructor() {
    super(SkillType.Cleave, DamageType.Slash)
  }
}
