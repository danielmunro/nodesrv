import { newTrail } from "../../area/factory"
import { Direction } from "../../room/constants"
import { moveMob, persistRoom } from "../../room/service"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import { findOneMob, findWanderingMobs, persistMob, saveMobRoom } from "./mob"

describe("mob repository", () => {
  it("should be able to save a mob's room", async () => {
    const root = getTestRoom()
    await persistRoom(root)
    await newTrail(root, Direction.West, 2)
    const mob = getTestMob()
    root.addMob(mob)
    const exit = root.exits.find((e) => e.direction === Direction.West)
    expect.assertions(1)
    await persistMob(mob)
      .then(() => moveMob(mob, Direction.West))
      .then(() => saveMobRoom(mob))
      .then(() => findOneMob(mob.id)
        .then((loadedMob) => expect(loadedMob.room.id).toBe(exit.destination.id)))
  })

  it("findWanderingMobs should be able to find wandering mobs", async () => {
    findWanderingMobs()
      .then(async (wanderers) => {
        await Promise.all([
          getTestMob(),
          getTestMob(),
          getTestMob(),
        ].map((mob) => {
          mob.wanders = true
          return persistMob(mob)
        }))
        expect(wanderers.length).toBeGreaterThan(0)
        wanderers.forEach((wanderer) => expect(wanderer.wanders).toBeTruthy())
      })
  })
})
