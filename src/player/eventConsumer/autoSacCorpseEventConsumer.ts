import {inject, injectable} from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createDestroyItemEvent, createRoomMessageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventService from "../../event/service/eventService"
import ResponseMessageBuilder from "../../messageExchange/builder/responseMessageBuilder"
import {MobEntity} from "../../mob/entity/mobEntity"
import DeathEvent from "../../mob/event/deathEvent"
import LocationService from "../../mob/service/locationService"
import {Types} from "../../support/types"

@injectable()
export default class AutoSacCorpseEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.EventService) private readonly eventService: EventService,
    @inject(Types.LocationService) private readonly locationService: LocationService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async isEventConsumable(event: DeathEvent): Promise<boolean> {
    const death = event.death
    const winner = death.killer
    return !!winner && winner.isPlayerMob() && winner.playerMob.autoSac
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const death = event.death
    const winner = death.killer as MobEntity
    const corpse = death.corpse
    const room = this.locationService.getRoomForMob(event.death.mobKilled)
    await this.eventService.publish(createDestroyItemEvent(corpse))
    await this.eventService.publish(createRoomMessageEvent(
      room,
      new ResponseMessageBuilder(winner, "{requestCreator} {verb} {corpse} to {requestCreator2} diety.")
        .addReplacementForRequestCreator("verb", "sacrifice")
        .addReplacementForRequestCreator("requestCreator2", "your")
        .addReplacementForTarget("verb", "sacrifices")
        .addReplacementForTarget("requestCreator2", "their")
        .addReplacement("corpse", corpse.toString())
        .create()))
    return EventResponse.none(event)
  }
}
