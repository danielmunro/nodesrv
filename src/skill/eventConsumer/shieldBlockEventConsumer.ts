import Action from "../../action/action"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {Equipment} from "../../item/enum/equipment"
import FightEvent from "../../mob/fight/event/fightEvent"
import {Mob} from "../../mob/model/mob"
import EventContext from "../../request/context/eventContext"
import Request from "../../request/request"
import {RequestType} from "../../request/requestType"
import {Room} from "../../room/model/room"
import {SkillType} from "../skillType"

export default class ShieldBlockEventConsumer implements EventConsumer {
  private static createRequest(mob: Mob, room: Room): Request {
    return new Request(mob, room, new EventContext(RequestType.Noop))
  }

  constructor(private readonly shieldBlock: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRoundStart ]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const target = event.fight.getOpponentFor(event.mob) as Mob
    if (!target.getSkill(SkillType.ShieldBlock) || !target.getFirstEquippedItemAtPosition(Equipment.Shield)) {
      return EventResponse.none(event)
    }
    const result = await this.shieldBlock.handle(
      ShieldBlockEventConsumer.createRequest(target, event.fight.room))
    if (result.isSuccessful()) {
      return EventResponse.satisfied(event, SkillType.ShieldBlock)
    }
    return EventResponse.none(event)
  }
}
