import Action from "../../action/impl/action"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {Equipment} from "../../item/enum/equipment"
import FightEvent from "../../mob/fight/event/fightEvent"
import {Mob} from "../../mob/model/mob"
import EventContext from "../../request/context/eventContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import {Room} from "../../room/model/room"
import {SkillType} from "../skillType"

export default class ShieldBlockEventConsumer implements EventConsumer {
  private static createRequest(mob: Mob, room: Room): Request {
    return new Request(mob, room, { requestType: RequestType.Noop } as EventContext)
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
