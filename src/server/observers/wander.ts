import { Client } from "../../client/client"
import { coinFlip } from "../../dice/dice"
import { Mob } from "../../mob/model/mob"
import { findWanderingMobs, saveMob } from "../../mob/repository/mob"
import { pickOne } from "../../random/helpers"
import { Exit } from "../../room/model/exit"
import { findOneExit } from "../../room/repository/exit"
import { findOneRoom } from "../../room/repository/room"
import { Observer } from "./observer"

export class Wander implements Observer {
  public notify(clients: Client[]): void {
    findWanderingMobs().then((mobs) =>
      mobs.forEach((mob) => {
        if (coinFlip()) {
          findOneRoom(mob.room.id).then((room) =>
            findOneExit(pickOne(room.exits).id).then((exit) =>
              this.wander(exit, mob)))
        }
    }))
  }

  private wander(exit: Exit, mob: Mob) {
    exit.destination.addMob(mob)
    saveMob(mob)
  }
}
