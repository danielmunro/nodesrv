import { inject, injectable, multiInject } from "inversify"
import Skill from "../../../../action/impl/skill"
import {Types} from "../../../../support/types"
import LocationService from "../../../service/locationService"
import {SkillType} from "../../skillType"
import ExtraAttackEventConsumer from "../extraAttackEventConsumer"

@injectable()
export default class SecondAttackEventConsumer extends ExtraAttackEventConsumer {
  constructor(
    @inject(Types.LocationService) locationService: LocationService,
    @multiInject(Types.Skills) skills: Skill[]) {
    super(locationService, skills, SkillType.SecondAttack)
  }
}
