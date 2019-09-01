import { injectable, multiInject } from "inversify"
import Skill from "../../../../action/impl/skill"
import {Types} from "../../../../support/types"
import {SkillType} from "../../skillType"
import ExtraAttackEventConsumer from "../extraAttackEventConsumer"

@injectable()
export default class SecondAttackEventConsumer extends ExtraAttackEventConsumer {
  constructor(@multiInject(Types.Skills) skills: Skill[]) {
    super(skills, SkillType.SecondAttack)
  }
}
