import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import Table from "../../mob/table"
import { getTestClient } from "../../test/client"
import { decrementAffects } from "./decrementAffects"

const TEST_TIMEOUT_1 = 50
const TEST_TIMEOUT_2 = 122

describe("decrementAffects", () => {
  it("should decrement all affects for a mob", async () => {
    // setup
    const client = await getTestClient()

    // given
    const mob = client.player.sessionMob
    mob.addAffect(newAffect(AffectType.Dazed, TEST_TIMEOUT_1))
    mob.addAffect(newAffect(AffectType.Shield, TEST_TIMEOUT_2))
    const table = Table.new([mob])

    // when
    table.apply(decrementAffects)

    // then
    expect(mob.getAffect(AffectType.Dazed).timeout).toBe(TEST_TIMEOUT_1 - 1)
    expect(mob.getAffect(AffectType.Shield).timeout).toBe(TEST_TIMEOUT_2 - 1)
  })

  it("should remove an affect once it decrements to zero", async () => {
    // setup
    const client = await getTestClient()

    // given
    const mob = client.player.sessionMob
    mob.addAffect(newAffect(AffectType.Dazed, 0))
    const table = Table.new([mob])

    // when
    table.apply(decrementAffects)

    // then
    expect(mob.affects.length).toBe(0)
  })
})
