import {AffectType} from "../affect/affectType"
import Check from "../check/check"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import Cost from "../check/cost/cost"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import {SpecializationType} from "../mob/specialization/specializationType"
import {Request} from "../request/request"
import {SkillType} from "../skill/skillType"
import Action from "./action"
import {ActionType} from "./enum/actionType"

export default abstract class Skill extends Action {
  constructor(protected readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .create()
  }

  public getAffectType(): AffectType {
    return undefined
  }

  public abstract getSkillType(): SkillType
  public abstract getCosts(): Cost[]
  public abstract getActionType(): ActionType
  public abstract getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel
}
