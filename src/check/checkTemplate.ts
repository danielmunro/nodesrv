import {ActionType} from "../action/enum/actionType"
import Skill from "../action/skill"
import affectTable from "../affect/affectTable"
import {AffectType} from "../affect/affectType"
import {StackBehavior} from "../affect/stackBehavior"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import {Request} from "../request/request"
import Spell from "../spell/spell"
import CheckBuilder from "./checkBuilder"
import {CheckType} from "./checkType"
import {Messages} from "./constants"

export default class CheckTemplate {
  private target

  constructor(private readonly mobService: MobService, private readonly request: Request) {}

  public getTarget() {
    return this.target
  }

  public cast(spellDefinition: Spell): CheckBuilder {
    const mob = this.request.mob
    const checkBuilder = new CheckBuilder(this.mobService, this.request)
      .forMob(mob)
      .requireSpell(spellDefinition.spellType)
      .atLevelOrGreater(spellDefinition.getLevelFor(mob.specialization).minimumLevel)
      .addManaCost(spellDefinition.getCastCost(mob))

    this.checkActionType(checkBuilder, spellDefinition.actionType)
    if (spellDefinition.affectType) {
      this.checkAffectStackingBehavior(checkBuilder, spellDefinition.affectType)
    }

    return checkBuilder
  }

  public perform(skill: Skill): CheckBuilder {
    const checkBuilder = new CheckBuilder(this.mobService, this.request)
      .forMob(this.request.mob)
      .requireSkill(skill.getSkillType())
      .atLevelOrGreater(skill.getSpecializationLevel(this.request.mob.specialization).minimumLevel)
      .capture(this.request.mob)

    skill.getCosts().forEach(cost => checkBuilder.addCost(cost))
    this.checkAffectStackingBehavior(checkBuilder, skill.getAffectType())
    this.checkActionType(checkBuilder, skill.getActionType())

    return checkBuilder
  }

  private checkAffectStackingBehavior(checkBuilder: CheckBuilder, affectType: AffectType) {
    if (!affectType) {
      return
    }
    const affectDefinition = affectTable.find(a => a.affectType === affectType)
    if (affectDefinition && affectDefinition.stackBehavior === StackBehavior.NoReplace) {
      checkBuilder.not().requireAffect(affectType, affectDefinition.stackMessage)
    }
  }

  private checkActionType(checkBuilder: CheckBuilder, actionType: ActionType) {
    let target = this.request.getTarget() as Mob
    const fight = this.mobService.findFight(f => f.isParticipant(this.request.mob))
    if (fight && target) {
      checkBuilder.require(target === fight.getOpponentFor(this.request.mob), Messages.TooManyTargets)
    } else if (!target && fight) {
      target = fight.getOpponentFor(this.request.mob)
    }
    this.target = target
    if (actionType === ActionType.Offensive) {
      checkBuilder.require(target, Messages.NoTarget, CheckType.HasTarget)
    } else if (actionType === ActionType.Defensive) {
      checkBuilder.optionalMob(target)
    }
  }
}
