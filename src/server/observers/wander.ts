import { Client } from "../../client/client"
import { Mob } from "../../mob/model/mob"
import { pickOne } from "../../random/helpers"
import { findOneRoom } from "../../room/repository/room"
import { moveMob } from "../../room/service"
import { Observer } from "./observer"

export class Wander implements Observer {
  private readonly findMobs: () => Promise<Mob[]>

  constructor(findMobs: () => Promise<Mob[]>) {
    this.findMobs = findMobs
  }

  public async notify(clients: Client[]): Promise<any> {
    const mobs = await this.findMobs()
    return Promise.all(mobs.map((mob) =>
      findOneRoom(mob.room.id).then(async (room) =>
        await moveMob(mob, pickOne(room.exits).direction))))
  }
}
