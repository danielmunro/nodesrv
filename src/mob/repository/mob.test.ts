import * as sillyname from "sillyname"
import { getTestMob } from "../../test/mob"
import { Mob } from "../model/mob"
import Table from "../table"

function getTestWanderingMob(): Mob {
  const mob = getTestMob()
  mob.wanders = true

  return mob
}

function findByName(table: Table, name: string) {
  return table.find((mob) => mob.name === name)
}

describe("mob repository", () => {
  it("findWanderingMobs should be able to find wandering mobs", async () => {
    // setup
    const table = new Table([
      getTestWanderingMob(),
      getTestWanderingMob(),
      getTestWanderingMob(),
      getTestMob(),
      getTestMob(),
    ])

    // when
    const wanderers = table.getWanderingMobs()

    // then
    expect(wanderers.length).toBe(3)

    // verify
    wanderers.forEach((wanderer) => expect(wanderer.wanders).toBeTruthy())
  })

  it("findPlayerMobByName should not return a non-player mob", async () => {
    // given
    const name = sillyname()
    const mob = getTestMob(name)
    const table = new Table([mob])

    // when
    const lookup = findByName(table, sillyname())

    // then
    expect(lookup).toBeUndefined()
  })
})
