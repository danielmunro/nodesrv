import {inject, injectable} from "inversify"
import {v4} from "uuid"
import AffectService from "../../affect/service/affectService"
import {Client} from "../../client/client"
import {createTickEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import TimeService from "../../gameService/timeService"
import {MobEntity} from "../../mob/entity/mobEntity"
import {Trigger} from "../../mob/enum/trigger"
import TickEvent from "../../mob/event/tickEvent"
import LocationService from "../../mob/service/locationService"
import roll from "../../support/random/dice"
import {Types} from "../../support/types"
import {BaseRegenModifier} from "./constants"
import {Observer} from "./observer"

const MESSAGE_HUNGRY = "You are hungry."
const TIMING = "tick notification duration"

@injectable()
export class Tick implements Observer {
  public static getRegenModifier(mob: MobEntity): number {
    return AffectService.applyAffectModifier(
      mob.affects.map(a => a.affectType),
      Trigger.Tick,
      BaseRegenModifier)
  }

  public static regen(mob: MobEntity, regenModifier: number) {
    const combined = mob.attribute().combine()
    mob.hp += roll(8, (combined.hp * regenModifier) / 8)
    mob.mana += roll( 8, (combined.mana * regenModifier) / 8)
    mob.mv += roll(8, (combined.mv * regenModifier) / 8)
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
    const regenModifier = Tick.getRegenModifier(mob)

    const location = this.locationService.getLocationForMob(mob)
    const eventResponse = await this.eventService.publish(
      createTickEvent(mob, location.room, regenModifier))
    Tick.regen(mob, (eventResponse.event as TickEvent).regenModifier)

    if (mob.playerMob && mob.playerMob.isHungry()) {
      client.sendMessage(MESSAGE_HUNGRY)
    }

    client.tick(id, timestamp)
  }
}
