import {injectable} from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobEntity} from "../../mob/entity/mobEntity"
import DeathEvent from "../../mob/event/deathEvent"
import withValue from "../../support/functional/withValue"

@injectable()
export default class AddExperienceFromKillEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async isEventConsumable(event: DeathEvent): Promise<boolean> {
    const winner = event.death.killer
    return !!winner && winner.isPlayerMob() && winner.playerMob.experienceToLevel > 0
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const winner = event.death.killer as MobEntity
    withValue(event.death.calculateKillerExperience(), experienceGain => {
      winner.playerMob.addExperience(experienceGain)

      // @todo publish level qualification event if appropriate
    })
    return EventResponse.none(event)
  }
}
