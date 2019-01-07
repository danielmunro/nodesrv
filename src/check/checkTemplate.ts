import {ActionType} from "../action/actionType"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import {Request} from "../request/request"
import SpellDefinition from "../spell/spellDefinition"
import CheckBuilder from "./checkBuilder"
import SkillDefinition from "../skill/skillDefinition"
import {Fight} from "../mob/fight/fight"
import {Messages} from "./constants"

export default class CheckTemplate {
  constructor(private readonly mobService: MobService, private readonly request: Request) {}

  public cast(spellDefinition: SpellDefinition): CheckBuilder {
    const mob = this.request.mob
    const checkBuilder = this.request.checkWithStandingDisposition(this.mobService)
      .requireSpell(spellDefinition.spellType)
      .requireLevel(spellDefinition.getLevelFor(mob.specialization).minimumLevel)
      .addManaCost(spellDefinition.getCastCost(mob))

    this.checkActionType(checkBuilder, spellDefinition.actionType)

    return checkBuilder
  }

  public perform(skillDefinition: SkillDefinition): CheckBuilder {
    const checkBuilder = this.request.checkWithStandingDisposition(this.mobService)
      .requireSkill(skillDefinition.skillType)
      .requireLevel(skillDefinition.getLevelFor(this.request.mob.specialization).minimumLevel)

    skillDefinition.costs.forEach(cost => checkBuilder.addCost(cost))
    this.checkActionType(checkBuilder, skillDefinition.actionType)

    return checkBuilder
  }

  private checkActionType(checkBuilder: CheckBuilder, actionType: ActionType) {
    let target = this.request.getTarget() as Mob
    const fight = this.mobService.findFight(f => f.isParticipant(this.request.mob))
    if (fight && target) {
      checkBuilder.require(target === fight.getOpponentFor(this.request.mob), Messages.TooManyTargets)
    } else if (!target && fight) {
      target = fight.getOpponentFor(this.request.mob)
    }
    if (actionType === ActionType.Offensive) {
      checkBuilder.requireMob(target, Messages.NoTarget)
    } else if (actionType === ActionType.Defensive) {
      checkBuilder.optionalMob(target)
    }
  }
}
