import { ActionType } from "../action/enum/actionType"
import {AffectType} from "../affect/affectType"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import { DamageType } from "../damage/damageType"
import GameService from "../gameService/gameService"
import {Mob} from "../mob/model/mob"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import {SpecializationType} from "../mob/specialization/specializationType"
import { Request } from "../request/request"
import Response from "../request/response"
import { SpellType } from "./spellType"

export const MAX_CAST_COST = 1000

export default class Spell {
  constructor(
    private readonly service: GameService,
    public readonly spellType: SpellType,
    public readonly actionType: ActionType,
    public readonly preconditions:
      (request: Request, spellDefinition: Spell, service: GameService) => Promise<Check>,
    public readonly action: (checkedRequest: CheckedRequest) => Promise<Response>,
    public readonly minimumManaCost: number,
    public readonly spellLevels: SpecializationLevel[],
    public readonly affectType: AffectType = null,
    public readonly damageType: DamageType = null,
  ) {}

  public async doAction(request: Request) {
    const check = await this.preconditions(request, this, this.service)

    if (check.isOk()) {
      return this.action(new CheckedRequest(request, check))
    }

    return request.respondWith().error(check.result)
  }

  public getLevelFor(specializationType: SpecializationType): SpecializationLevel {
    return this.spellLevels.find(sp => sp.specialization === specializationType)
  }

  public getCastCost(mob: Mob): number {
    const spellLevel = this.getLevelFor(mob.specialization)
    if (spellLevel.minimumLevel === 0) {
      return MAX_CAST_COST
    }
    const calculatedCost = 100 / ( 2 + mob.level - spellLevel.minimumLevel)
    return Math.min(this.minimumManaCost, calculatedCost)
  }
}
