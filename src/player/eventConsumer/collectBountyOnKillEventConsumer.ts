import {injectable} from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import DeathEvent from "../../mob/event/deathEvent"

@injectable()
export default class CollectBountyOnKillEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const killer = event.death.killer
    const vanquished = event.death.mobKilled
    if (killer && killer.playerMob && vanquished.playerMob && vanquished.playerMob.bounty) {
      killer.gold += vanquished.playerMob.bounty
      vanquished.playerMob.bounty = 0
    }
    return EventResponse.none(event)
  }
}
