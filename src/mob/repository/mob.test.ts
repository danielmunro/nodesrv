import { newTrail } from "../../area/factory"
import { Direction } from "../../room/constants"
import { moveMob, persistRoom } from "../../room/service"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import { Mob } from "../model/mob"
import { findOneMob, findWanderingMobs, persistMob, saveMobRoom } from "./mob"

function getTestWanderingMob(): Mob {
  const mob = getTestMob()
  mob.wanders = true

  return mob
}

describe("mob repository", () => {
  it("should be able to save a mob's room as the mob moves", async () => {
    // setup
    const root = getTestRoom()
    await persistRoom(root)
    await newTrail(root, Direction.West, 2)
    const mob = getTestMob()
    root.addMob(mob)
    const exit = root.exits.find((e) => e.direction === Direction.West)
    await persistMob(mob)

    // when
    await moveMob(mob, Direction.West)
    await saveMobRoom(mob)

    // then
    const loadedMob = await findOneMob(mob.id)
    expect(loadedMob.room.id).toBe(exit.destination.id)
  })

  it("findWanderingMobs should be able to find wandering mobs", async () => {
    // setup
    await Promise.all([
      getTestWanderingMob(),
      getTestWanderingMob(),
      getTestWanderingMob(),
    ].map((mob) => persistMob(mob)))

    // when
    const wanderers = await findWanderingMobs()

    // then
    expect(wanderers.length).toBeGreaterThan(0)

    // verify
    wanderers.forEach((wanderer) => expect(wanderer.wanders).toBeTruthy())
  })
})
