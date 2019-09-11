import {injectable} from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobEntity} from "../../mob/entity/mobEntity"
import DeathEvent from "../../mob/event/deathEvent"

@injectable()
export default class CollectBountyOnKillEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const killer = event.death.killer as MobEntity
    const vanquished = event.death.mobKilled
    const fight = event.fight
    if (fight && fight.isP2P() && vanquished.getBounty()) {
      killer.gold += vanquished.getBounty()
      vanquished.playerMob.bounty = 0
    }
    return EventResponse.none(event)
  }
}
