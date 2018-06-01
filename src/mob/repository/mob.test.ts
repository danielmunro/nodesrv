import * as sillyname from "sillyname"
import { newTrail } from "../../area/factory"
import { Direction } from "../../room/constants"
import { moveMob, persistRoom } from "../../room/service"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import { Mob } from "../model/mob"
import { findOneMob, findPlayerMobByName, findWanderingMobs, persistMob, saveMobRoom } from "./mob"

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

  it("findPlayerMobByName should not return a non-player mob", async () => {
    // given
    const name = sillyname()

    // when
    const mob = getTestMob(name)
    await persistMob(mob)

    // then
    expect(await findPlayerMobByName(sillyname())).toBeUndefined()
  })

  it("findPlayerMobByName should return a player mob", async () => {
    // given
    const name = sillyname()

    // when
    const mob = getTestMob(name)
    mob.isPlayer = true
    await persistMob(mob)

    // then
    expect(await findPlayerMobByName(name)).toBeTruthy()
  })

  it("findWanderingMobs should not return player mobs", async () => {
    // given
    const npc = getTestMob()
    npc.wanders = true

    const player = getTestMob()
    player.isPlayer = true

    // setup
    await persistMob(npc)
    await persistMob(player)

    // when
    const mobs = await findWanderingMobs()

    // then
    const mobIds = mobs.map((m) => m.id)
    expect(mobIds).not.toContain(player.id)
    expect(mobIds).toContain(npc.id)
  })
})
