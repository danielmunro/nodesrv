import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import HealerSpell from "../../../mob/healer/healerSpell"
import LocationService from "../../../mob/locationService"
import {Mob} from "../../../mob/model/mob"
import EventContext from "../../../request/context/eventContext"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {format} from "../../../support/string"
import Action from "../../action"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

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
      .require(healer, ConditionMessages.Heal.Fail.HealerNotFound, CheckType.HasTarget)

    if (subject) {
      const healerSpell: HealerSpell =
        this.spells.find(spell => spell.spellDefinition.getSpellType().startsWith(subject)) as HealerSpell
      checkBuilder.require(healerSpell, ConditionMessages.Heal.Fail.NotASpell, CheckType.HasSpell)
      checkBuilder.require(
        () => request.mob.gold >= healerSpell.goldValue, ConditionMessages.Heal.Fail.CannotAffordSpell)
    }

    return checkBuilder.create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const request = checkedRequest.request
    const healer = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    const subject = request.getSubject()
    if (!subject) {
      return checkedRequest.respondWith().info(this.listSpells(healer))
    }
    const healerSpell: HealerSpell = checkedRequest.getCheckTypeResult(CheckType.HasSpell)
    request.mob.gold -= healerSpell.goldValue
    return healerSpell.spellDefinition.handle(
      new Request(healer, request.room, new EventContext(RequestType.Cast), request.mob))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Thing ]
  }

  public getRequestType(): RequestType {
    return RequestType.Heal
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  private listSpells(healer: Mob) {
    return format(
      "{0} offers the following spells:\n{1}Type heal [spell] to be healed",
      healer.name,
      this.spells.reduce((previous, current: HealerSpell) =>
        previous + current.spellDefinition.getSpellType() + " - " + current.goldValue + " gold\n", ""))
  }
}
