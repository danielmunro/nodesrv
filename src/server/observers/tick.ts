import {v4} from "uuid"
import {applyAffectModifier} from "../../affect/applyAffect"
import AttributeService from "../../attributes/attributeService"
import {Client} from "../../client/client"
import EventService from "../../event/eventService"
import {EventType} from "../../event/eventType"
import TimeService from "../../gameService/timeService"
import {Trigger} from "../../mob/enum/trigger"
import MobEvent from "../../mob/event/mobEvent"
import LocationService from "../../mob/locationService"
import {Mob} from "../../mob/model/mob"
import roll from "../../random/dice"
import {BaseRegenModifier} from "./constants"
import {Observer} from "./observer"

const MESSAGE_HUNGRY = "You are hungry."
const TIMING = "tick notification duration"

export class Tick implements Observer {
  public static regen(mob: Mob) {
    const combined = AttributeService.combine(mob)
    const regenModifier = applyAffectModifier(
      mob.affects.map(a => a.affectType),
      Trigger.Tick,
      BaseRegenModifier)
    mob.vitals.hp += roll(8, (combined.vitals.hp * regenModifier) / 8)
    mob.vitals.mana += roll( 8, (combined.vitals.mana * regenModifier) / 8)
    mob.vitals.mv += roll(8, (combined.vitals.mv * regenModifier) / 8)
    if (mob.playerMob) {
      mob.playerMob.regen()
    }
    AttributeService.normalize(mob)
  }

  constructor(
    private readonly timeService: TimeService,
    private readonly eventService: EventService,
    private readonly locationService: LocationService) {}

  public async notify(clients: Client[]): Promise<void> {
    console.time(TIMING)
    const id = v4()
    const timestamp = new Date()
    this.timeService.incrementTime()
    await Promise.all(clients
      .filter(client => client.isLoggedIn())
      .map(client => this.notifyClient(client, id, timestamp)))
    console.log(`tick at ${timestamp}`)
    console.timeEnd(TIMING)
  }

  private async notifyClient(client: Client, id: string, timestamp: Date) {
    const mob = client.getSessionMob()
    Tick.regen(mob)

    if (mob.playerMob && mob.playerMob.isHungry()) {
      client.sendMessage(MESSAGE_HUNGRY)
    }

    const location = this.locationService.getLocationForMob(mob)
    await this.eventService.publish(new MobEvent(EventType.Tick, mob, location.room))
    client.tick(id, timestamp)
  }
}
