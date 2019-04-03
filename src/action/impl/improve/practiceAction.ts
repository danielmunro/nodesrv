import AttributeService from "../../../attributes/attributeService"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import MobService from "../../../mob/mobService"
import {Mob} from "../../../mob/model/mob"
import {getSpecializationLevel} from "../../../mob/specialization/specializationLevels"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Skill} from "../../../skill/model/skill"
import {Spell} from "../../../spell/model/spell"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class PracticeAction extends Action {
  private static getImproveAmount(mob: Mob): number {
    return AttributeService.getInt(mob) / 2
  }

  private static minimumLevel(specialization: SpecializationType, practice: Skill | Spell): number {
    return getSpecializationLevel(
      specialization,
      practice instanceof Skill ? practice.skillType : practice.spellType).minimumLevel
  }

  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(
        this.mobService.findMobInRoomWithMob(request.mob, (mob: Mob) => mob.traits.practice),
        Messages.Practice.MobNotHere,
        CheckType.MobPresent)
      .require(request.mob.playerMob.practices > 0, Messages.Practice.NotEnoughPractices)
      .require(
        () => request.mob.findPractice(request.getSubject()),
        Messages.Practice.CannotPractice,
        CheckType.ValidSubject)
      .capture()
      .require(
        (practice: Skill | Spell) => practice.level < MAX_PRACTICE_LEVEL,
        Messages.Practice.CannotImproveAnymore)
      .require((practice: Skill | Spell) => {
          const minimum = PracticeAction.minimumLevel(request.mob.specializationType, practice)
          return request.mob.level >= minimum
        },
        Messages.Practice.CannotPractice)
      .create()
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Thing]
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.Practice
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const toPractice = checkedRequest.getCheckTypeResult(CheckType.ValidSubject)
    toPractice.level += PracticeAction.getImproveAmount(checkedRequest.mob)
    if (toPractice.level > MAX_PRACTICE_LEVEL) {
      toPractice.level = MAX_PRACTICE_LEVEL
    }
    checkedRequest.mob.playerMob.practices -= 1

    return checkedRequest.respondWith().success(Messages.Practice.Success, { toPractice: toPractice.toString() })
  }
}
