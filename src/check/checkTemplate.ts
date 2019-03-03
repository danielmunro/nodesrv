import {ActionType} from "../action/enum/actionType"
import Skill from "../action/skill"
import Spell from "../action/spell"
import affectTable from "../affect/affectTable"
import {AffectType} from "../affect/affectType"
import {StackBehavior} from "../affect/stackBehavior"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import {getSpecializationLevel} from "../mob/specialization/specializationLevels"
import {Request} from "../request/request"
import getActionPartTable from "./actionPartCheckTable"
import CheckBuilder from "./checkBuilder"
import {CheckType} from "./checkType"
import {CheckMessages} from "./constants"

export default class CheckTemplate {
  constructor(private readonly mobService: MobService, private readonly request: Request) {}

  public cast(spell: Spell): CheckBuilder {
    const mob = this.request.mob
    const specializationLevel = getSpecializationLevel(
      this.request.mob.specialization,
      spell.getSpellType())
    const checkBuilder = new CheckBuilder(this.mobService, this.request, getActionPartTable(this.mobService))
      .forMob(mob)
      .requireSpell(spell.getSpellType())
      .atLevelOrGreater(specializationLevel.minimumLevel)

    spell.getCosts().forEach(cost => checkBuilder.addCost(cost))
    this.checkActionType(checkBuilder, spell.getActionType())
    if (spell.getAffectType()) {
      this.checkAffectStackingBehavior(checkBuilder, spell.getAffectType())
    }

    return checkBuilder
  }

  public perform(skill: Skill): CheckBuilder {
    const specializationLevel = getSpecializationLevel(
      this.request.mob.specialization,
      skill.getSkillType())
    const checkBuilder = new CheckBuilder(this.mobService, this.request, getActionPartTable(this.mobService))
      .forMob(this.request.mob)
      .requireSkill(skill.getSkillType())
      .atLevelOrGreater(specializationLevel.minimumLevel)

    skill.getCosts().forEach(cost => checkBuilder.addCost(cost))
    this.checkActionType(checkBuilder, skill.getActionType())
    this.checkAffectStackingBehavior(checkBuilder, skill.getAffectType())

    return checkBuilder
  }

  private checkAffectStackingBehavior(checkBuilder: CheckBuilder, affectType?: AffectType) {
    if (!affectType) {
      return
    }
    const affectDefinition = affectTable.find(a => a.affectType === affectType)
    if (affectDefinition && affectDefinition.stackBehavior === StackBehavior.NoReplace) {
      checkBuilder.not().requireAffect(affectType, affectDefinition.stackMessage)
    }
  }

  private checkActionType(checkBuilder: CheckBuilder, actionType: ActionType) {
    let target = this.request.getTargetMobInRoom()
    const fight = this.mobService.findFight(f => f.isParticipant(this.request.mob))
    if (fight && target) {
      checkBuilder.require(target === fight.getOpponentFor(this.request.mob), CheckMessages.TooManyTargets)
    } else if (!target && fight) {
      target = fight.getOpponentFor(this.request.mob) as Mob
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
