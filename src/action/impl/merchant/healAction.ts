import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import EventContext from "../../../messageExchange/context/eventContext"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import HealerSpell from "../../../mob/healer/healerSpell"
import LocationService from "../../../mob/service/locationService"
import {format} from "../../../support/string"
import {Types} from "../../../support/types"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class HealAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @inject(Types.HealerSpells) private readonly spells: HealerSpell[]) {
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
    const healer = requestService.getResult<MobEntity>()
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

  private listSpells(healer: MobEntity) {
    return format(
      "{0} offers the following spells:\n{1}Type heal [spell] to be healed",
      healer.name,
      this.spells.reduce((previous, current: HealerSpell) =>
        previous + current.spellDefinition.getSpellType() + " - " + current.goldValue + " gold\n", ""))
  }
}
