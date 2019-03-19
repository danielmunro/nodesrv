import AbilityService from "../../../../../check/abilityService"
import CheckedRequest from "../../../../../check/checkedRequest"
import Cost from "../../../../../check/cost/cost"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import {Disposition} from "../../../../../mob/enum/disposition"
import MobService from "../../../../../mob/mobService"
import {Mob} from "../../../../../mob/model/mob"
import {Race} from "../../../../../mob/race/race"
import {percentRoll} from "../../../../../random/helpers"
import ResponseMessage from "../../../../../request/responseMessage"
import RoomMessageEvent from "../../../../../room/event/roomMessageEvent"
import {Room} from "../../../../../room/model/room"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../../spell"

export default class TurnUndeadAction extends Spell {
  constructor(
    abilityService: AbilityService,
    private readonly mobService: MobService) {
    super(abilityService)
  }

  public applySpell(checkedRequest: CheckedRequest): void {
    this.mobService.locationService.getMobsInRoomWithMob(checkedRequest.mob)
      .filter(mob => mob.race === Race.Undead)
      .filter(mob => percentRoll() < 100 - mob.level)
      .forEach(mob => this.turn(checkedRequest.room, mob))
  }

  public getSpellType(): SpellType {
    return SpellType.TurnUndead
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getCosts(): Cost[] {
    return [
      new ManaCost(50),
      new DelayCost(1),
    ]
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

  private async turn(room: Room, target: Mob) {
    target.disposition = Disposition.Dead
    await this.abilityService.publishEvent(new RoomMessageEvent(
      room,
      new ResponseMessage(
        target,
        SpellMessages.TurnUndead.MobTurned,
        { target })))
  }
}
