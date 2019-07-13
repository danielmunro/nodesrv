import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {MobEntity} from "../../../mob/entity/mobEntity"
import MobService from "../../../mob/service/mobService"
import {SkillEntity} from "../../../mob/skill/entity/skillEntity"
import {SpecializationType} from "../../../mob/specialization/enum/specializationType"
import {getSpecializationLevel} from "../../../mob/specialization/specializationLevels/specializationLevels"
import {SpellEntity} from "../../../mob/spell/entity/spellEntity"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import Maybe from "../../../support/functional/maybe"
import match from "../../../support/matcher/match"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class PracticeAction extends Action {
  private static getImproveAmount(mob: MobEntity): number {
    return mob.attribute().getInt() / 2
  }

  private static minimumLevel(specialization: SpecializationType, practice: SkillEntity | SpellEntity): number {
    return getSpecializationLevel(
      specialization,
      practice instanceof SkillEntity ? practice.skillType : practice.spellType).minimumLevel
  }

  private static findPractice(mob: MobEntity, input: string): SkillEntity | SpellEntity | undefined {
    return Maybe.if(mob.skills.find((skill: SkillEntity) => match(skill.skillType, input)))
      .or(() => mob.spells.find((spell: SpellEntity) => match(spell.spellType, input)))
      .get()
  }

  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(
        this.mobService.findMobInRoomWithMob(request.mob, (mob: MobEntity) => mob.traits.practice),
        Messages.Practice.MobNotHere,
        CheckType.MobPresent)
      .require(request.mob.playerMob.practices > 0, Messages.Practice.NotEnoughPractices)
      .require(
        () => PracticeAction.findPractice(request.mob, request.getSubject()),
        Messages.Practice.CannotPractice,
        CheckType.ValidSubject)
      .capture()
      .require(
        (practice: SkillEntity | SpellEntity) => practice.level < MAX_PRACTICE_LEVEL,
        Messages.Practice.CannotImproveAnymore)
      .require((practice: SkillEntity | SpellEntity) => {
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

  public invoke(requestService: RequestService): Promise<Response> {
    const toPractice = requestService.getResult(CheckType.ValidSubject)
    const mob = requestService.getMob()
    toPractice.level += PracticeAction.getImproveAmount(mob)
    if (toPractice.level > MAX_PRACTICE_LEVEL) {
      toPractice.level = MAX_PRACTICE_LEVEL
    }
    mob.playerMob.practices -= 1

    return requestService
      .respondWith()
      .success(Messages.Practice.Success, { toPractice: toPractice.toString() })
  }
}
