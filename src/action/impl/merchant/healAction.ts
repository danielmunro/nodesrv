import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import HealerSpell from "../../../mob/healer/healerSpell"
import LocationService from "../../../mob/locationService"
import {Mob} from "../../../mob/model/mob"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import collectionSearch from "../../../support/matcher/collectionSearch"
import {format} from "../../../support/string"
import Action from "../../action"
import {ConditionMessages} from "../../constants"

export default class HealAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly locationService: LocationService,
    private readonly spells: HealerSpell[]) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const subject = request.getSubject()
    const healer = this.locationService.getMobsByRoom(request.room).find(mob => mob.isHealer())
    const checkBuilder = this.checkBuilderFactory.createCheckBuilder(request)
      .require(healer, ConditionMessages.Heal.Fail.HealerNotFound)

    if (subject) {
      const healerSpell: HealerSpell = collectionSearch(this.spells, subject)
      checkBuilder.require(healerSpell, ConditionMessages.Heal.Fail.NotASpell, CheckType.HasSpell)
      checkBuilder.require(request.mob.gold >= healerSpell.goldValue, ConditionMessages.Heal.Fail.CannotAffordSpell)
    }

    return checkBuilder.create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const request = checkedRequest.request
    const healer = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    const subject = request.getSubject()
    console.log("subject received", subject)
    if (!subject) {
      return checkedRequest.respondWith().info(this.listSpells(healer))
    }
    const healerSpell: HealerSpell = checkedRequest.getCheckTypeResult(CheckType.HasSpell)
    request.mob.gold -= healerSpell.goldValue
    return healerSpell.spellDefinition.doAction(request)
  }

  protected getRequestType(): RequestType {
    return RequestType.Heal
  }

  private listSpells(healer: Mob) {
    console.log("sanity")
    return format(
      "{0} offers the following spells:\n{1}Type heal [spell] to be healed",
      healer.name,
      this.spells.reduce((previous, current: HealerSpell) => {
        console.log(current instanceof HealerSpell)
        console.log(current.goldValue)
        console.log(current.spellDefinition.spellType)
        return previous + current.spellDefinition.spellType + " - " + current.goldValue + " gold\n"
      }, ""))
  }
}
