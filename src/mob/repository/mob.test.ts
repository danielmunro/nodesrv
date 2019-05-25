import * as sillyname from "sillyname"
import { getTestMob } from "../../support/test/mob"
import { Mob } from "../model/mob"
import MobTable from "../table/mobTable"

function getTestWanderingMob(): Mob {
  const mob = getTestMob()
  mob.traits.wanders = true

  return mob
}

function findByName(table: MobTable, name: string) {
  return table.find((mob) => mob.name === name)
}

describe("mob repository", () => {
  it("findWanderingMobs should be able to find wandering mobs", async () => {
    // setup
    const table = new MobTable([
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
    wanderers.forEach(wanderer => expect(wanderer.traits.wanders).toBeTruthy())
  })

  it("findPlayerMobByName should not return a non-player mob", async () => {
    // given
    const name = sillyname()
    const mob = getTestMob(name)
    const table = new MobTable([mob])

    // when
    const lookup = findByName(table, sillyname())

    // then
    expect(lookup).toBeUndefined()
  })
})
