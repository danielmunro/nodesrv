import MobEvent from "../../event/event/mobEvent"
import EventConsumer from "../../event/eventConsumer"
import {EventResponse} from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import LocationService from "../../mob/locationService"
import {Mob} from "../../mob/model/mob"
import {Room} from "../../room/model/room"
import {GameServer} from "../../server/server"

export default class MobLeaves implements EventConsumer {
  constructor(
    private readonly gameServer: GameServer,
    private readonly locationService: LocationService) {}

  public getConsumingEventType(): EventType {
    return EventType.MobLeft
  }

  public consume(event: MobEvent): EventResponse {
    this.announceLeaving(event.mob, event.context as Room)
    return EventResponse.None
  }

  private announceLeaving(mob: Mob, roomLeft: Room) {
    const mobs = this.locationService.getMobsByRoom(roomLeft)
    this.gameServer.clients.forEach(client => {
      if (client.isLoggedIn() && mobs.includes(client.getSessionMob()) && client.getSessionMob() !== mob) {
        client.sendMessage(mob.name + " left.")
      }
    })
  }
}
