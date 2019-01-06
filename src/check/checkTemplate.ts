import {ActionType} from "../action/actionType"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import {Request} from "../request/request"
import SpellDefinition from "../spell/spellDefinition"
import CheckBuilder from "./checkBuilder"

export default class CheckTemplate {
  constructor(private readonly mobService: MobService, private readonly request: Request) {}

  public cast(spellDefinition: SpellDefinition): CheckBuilder {
    const mob = this.request.mob
    const checkBuilder = this.request.checkWithStandingDisposition(this.mobService)
      .requireSpell(spellDefinition.spellType)
      .requireLevel(spellDefinition.getLevelFor(mob.specialization).minimumLevel)
      .addManaCost(spellDefinition.getCastCost(mob))

    if (spellDefinition.actionType === ActionType.Offensive) {
      checkBuilder.requireMob(this.request.getTarget() as Mob)
    } else if (spellDefinition.actionType === ActionType.Defensive) {
      checkBuilder.optionalMob(this.request.getTarget() as Mob)
    }

    return checkBuilder
  }
}
