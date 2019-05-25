import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import HealerSpell from "../../../mob/healer/healerSpell"
import {Mob} from "../../../mob/model/mob"
import LocationService from "../../../mob/service/locationService"
import EventContext from "../../../request/context/eventContext"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import {format} from "../../../support/string"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class HealAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly locationService: LocationService,
    private readonly spells: HealerSpell[]) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const subject = request.getSubject()
    const healer = this.locationService.getMobsByRoom(request.getRoom()).find(mob => mob.isHealer())
    const checkBuilder = this.checkBuilderFactory.createCheckBuilder(request)
      .require(healer, ConditionMessages.Heal.Fail.HealerNotFound, CheckType.HasTarget)
      .capture()

    if (subject) {
      const healerSpell: HealerSpell =
        this.spells.find(spell => spell.spellDefinition.getSpellType().startsWith(subject)) as HealerSpell
      checkBuilder.require(healerSpell, ConditionMessages.Heal.Fail.NotASpell, CheckType.HasSpell)
      checkBuilder.require(
        () => request.mob.gold >= healerSpell.goldValue, ConditionMessages.Heal.Fail.CannotAffordSpell)
    }

    return checkBuilder.create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const healer = requestService.getResult()
    const subject = requestService.getSubject()
    if (!subject) {
      return requestService.respondWith().info(this.listSpells(healer))
    }
    const healerSpell: HealerSpell = requestService.getResult(CheckType.HasSpell)
    requestService.subtractGold(healerSpell.goldValue)
    return healerSpell.spellDefinition.handle(
      new Request(
        healer,
        requestService.getRequest().getRoom(),
        { requestType: RequestType.Cast } as EventContext,
        requestService.getMob()))
  }

  /* istanbul ignore next */
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
