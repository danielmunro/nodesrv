import { Client } from "../../client/client"
import { Mob } from "../../mob/model/mob"
import { pickOne } from "../../random/helpers"
import { moveMob } from "../../room/service"
import { getRoom } from "../../room/table"
import { Observer } from "./observer"

export class Wander implements Observer {
  private readonly findMobs: () => Promise<Mob[]>

  constructor(findMobs: () => Promise<Mob[]>) {
    this.findMobs = findMobs
  }

  public async notify(clients: Client[]): Promise<any> {
    const mobs = await this.findMobs()
    mobs.forEach((mob) => moveMob(mob, pickOne(getRoom(mob.room.uuid).exits).direction))
  }
}
