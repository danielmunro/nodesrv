import { Client } from "../../client/client"
import { Mob } from "../../mob/model/mob"
import { pickOne } from "../../random/helpers"
import Service from "../../room/service"
import { Observer } from "./observer"

export class Wander implements Observer {
  constructor(
    private readonly service: Service,
    private readonly findMobs: () => Promise<Mob[]>) {}

  public async notify(clients: Client[]): Promise<any> {
    const mobs = await this.findMobs()
    await Promise.all(mobs.map(async (mob) =>
      await this.service.moveMob(mob, pickOne(this.service.table.roomsById[mob.room.uuid].exits).direction)))
  }
}
