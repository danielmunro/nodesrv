import { Client } from "../../client/client"
import { onCoinFlipSuccess } from "../../dice/dice"
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

  public notify(clients: Client[]): Promise<any> {
    return this.findMobs()
      .then((mobs) =>
        mobs.map((mob) =>
          findOneRoom(mob.room.id)
            .then((room) => moveMob(mob, pickOne(room.exits).direction))))
  }
}
