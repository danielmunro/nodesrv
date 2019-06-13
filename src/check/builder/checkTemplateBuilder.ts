import {ActionType} from "../../action/enum/actionType"
import Skill from "../../action/impl/skill"
import Spell from "../../action/impl/spell"
import {AffectType} from "../../affect/enum/affectType"
import {StackBehavior} from "../../affect/enum/stackBehavior"
import {findAffectDefinition} from "../../affect/table/affectTable"
import {MobEntity} from "../../mob/entity/mobEntity"
import MobService from "../../mob/service/mobService"
import {getSpecializationLevel} from "../../mob/specialization/specializationLevels"
import Request from "../../request/request"
import {CheckMessages} from "../constants"
import {CheckType} from "../enum/checkType"
import getActionPartTable from "../table/actionPartCheckTable"
import CheckBuilder from "./checkBuilder"

export default class CheckTemplateBuilder {
  private static checkAffectStackingBehavior(checkBuilder: CheckBuilder, affectType?: AffectType) {
    if (!affectType) {
      return
    }
    const affectDefinition = findAffectDefinition(affectType)
    if (affectDefinition && affectDefinition.stackBehavior === StackBehavior.NoReplace) {
      checkBuilder.not().requireAffect(affectType, affectDefinition.stackMessage as string)
    }
  }

  constructor(private readonly mobService: MobService, private readonly request: Request) {}

  public cast(spell: Spell): CheckBuilder {
    const mob = this.request.mob
    const specializationLevel = getSpecializationLevel(
      this.request.mob.specializationType,
      spell.getSpellType())
    const checkBuilder = new CheckBuilder(this.mobService, this.request, getActionPartTable(this.mobService))
      .forMob(mob)
      .requireSpell(spell.getSpellType())
      .atLevelOrGreater(specializationLevel.minimumLevel)

    spell.getCosts().forEach(cost => checkBuilder.addCost(cost))
    this.checkActionType(checkBuilder, spell.getActionType())
    if (spell.getAffectType()) {
      CheckTemplateBuilder.checkAffectStackingBehavior(checkBuilder, spell.getAffectType())
    }

    return checkBuilder
  }

  public perform(skill: Skill): CheckBuilder {
    const specializationLevel = getSpecializationLevel(
      this.request.mob.specializationType,
      skill.getSkillType())
    const checkBuilder = new CheckBuilder(this.mobService, this.request, getActionPartTable(this.mobService))
      .forMob(this.request.mob)
      .requireSkill(skill.getSkillType())
      .atLevelOrGreater(specializationLevel.minimumLevel)

    skill.getCosts().forEach(cost => checkBuilder.addCost(cost))
    this.checkActionType(checkBuilder, skill.getActionType())
    CheckTemplateBuilder.checkAffectStackingBehavior(checkBuilder, skill.getAffectType())

    return checkBuilder
  }

  private checkActionType(checkBuilder: CheckBuilder, actionType: ActionType) {
    let target = this.request.getTargetMobInRoom()
    const fight = this.mobService.findFight(f => f.isParticipant(this.request.mob))
    if (fight && target) {
      checkBuilder.require(target === fight.getOpponentFor(this.request.mob), CheckMessages.TooManyTargets)
    } else if (!target && fight) {
      target = fight.getOpponentFor(this.request.mob) as MobEntity
    }
    if (actionType === ActionType.Offensive) {
      checkBuilder.require(target, CheckMessages.NoTarget, CheckType.HasTarget)
    } else if (actionType === ActionType.Defensive) {
      checkBuilder.optionalMob(target)
    } else if (actionType === ActionType.SneakAttack) {
      checkBuilder.require(target, CheckMessages.NoTarget, CheckType.HasTarget)
        .not().requireFight(CheckMessages.AlreadyFighting)
    }
  }
}
