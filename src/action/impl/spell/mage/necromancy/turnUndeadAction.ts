import CheckBuilderFactory from "../../../../../check/checkBuilderFactory"
import CheckedRequest from "../../../../../check/checkedRequest"
import Cost from "../../../../../check/cost/cost"
import EventService from "../../../../../event/eventService"
import {Disposition} from "../../../../../mob/enum/disposition"
import MobService from "../../../../../mob/mobService"
import {Race} from "../../../../../mob/race/race"
import {percentRoll} from "../../../../../random/dice"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"
import ManaCost from "../../../../../check/cost/manaCost"

export default class TurnUndeadAction extends Spell {
  constructor(
    checkBuilderFactory: CheckBuilderFactory,
    eventService: EventService,
    private readonly mobService: MobService) {
    super(checkBuilderFactory, eventService)
  }

  public applySpell(checkedRequest: CheckedRequest): void {
    this.mobService.locationService.getMobsInRoomWithMob(checkedRequest.mob)
      .filter(mob => mob.race === Race.Undead)
      .filter(mob => percentRoll() < 100 - mob.level)
      .forEach(mob => mob.disposition = Disposition.Dead)
  }

  public getSpellType(): SpellType {
    return SpellType.TurnUndead
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getCosts(): Cost[] {
    return [ new ManaCost(50) ]
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.TurnUndead.Success)
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
