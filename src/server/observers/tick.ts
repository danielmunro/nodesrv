import {inject, injectable} from "inversify"
import {v4} from "uuid"
import {applyAffectModifier} from "../../affect/applyAffect"
import {Client} from "../../client/client"
import {EventType} from "../../event/enum/eventType"
import EventService from "../../event/eventService"
import {createMobEvent} from "../../event/factory"
import TimeService from "../../gameService/timeService"
import {Trigger} from "../../mob/enum/trigger"
import {Mob} from "../../mob/model/mob"
import LocationService from "../../mob/service/locationService"
import roll from "../../support/random/dice"
import {Types} from "../../support/types"
import {BaseRegenModifier} from "./constants"
import {Observer} from "./observer"

const MESSAGE_HUNGRY = "You are hungry."
const TIMING = "tick notification duration"

@injectable()
export class Tick implements Observer {
  public static regen(mob: Mob) {
    const combined = mob.attribute().combine()
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
    mob.attribute().normalize()
  }

  constructor(
    @inject(Types.TimeService) private readonly timeService: TimeService,
    @inject(Types.EventService) private readonly eventService: EventService,
    @inject(Types.LocationService) private readonly locationService: LocationService) {}

  public async notify(clients: Client[]): Promise<void> {
    console.time(TIMING)
    const id = v4()
    const timestamp = new Date()
    this.timeService.incrementTime()
    await Promise.all(clients
      .filter(client => client.isLoggedIn())
      .map(client => this.notifyClient(client, id, timestamp)))
    console.log(`tick at ${timestamp}, ${this.locationService.getMobLocationCount()} mobs in the realm`)
    console.timeEnd(TIMING)
  }

  private async notifyClient(client: Client, id: string, timestamp: Date) {
    const mob = client.getSessionMob()
    Tick.regen(mob)

    if (mob.playerMob && mob.playerMob.isHungry()) {
      client.sendMessage(MESSAGE_HUNGRY)
    }

    const location = this.locationService.getLocationForMob(mob)
    await this.eventService.publish(createMobEvent(EventType.Tick, mob, location.room))
    client.tick(id, timestamp)
  }
}
