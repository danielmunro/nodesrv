import { Client } from "../../client/client"
import { onCoinFlipSuccess } from "../../dice/dice"
import { findWanderingMobs } from "../../mob/repository/mob"
import { pickOne } from "../../random/helpers"
import { moveMob } from "../../room/service"
import { Observer } from "./observer"

export class Wander implements Observer {
  public notify(clients: Client[]): void {
    findWanderingMobs().then((mobs) =>
      mobs.forEach((mob) =>
        onCoinFlipSuccess(() =>
          moveMob(mob, pickOne(mob.room.exits).direction))))
  }
}
