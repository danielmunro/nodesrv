import { AffectType } from "../../affect/constants"
import { newAffect } from "../../affect/factory"
import { getTestClient } from "../../test/client"
import { DecrementAffects } from "./decrementAffects"

const TEST_TIMEOUT_1 = 50
const TEST_TIMEOUT_2 = 122

describe("decrementAffects", () => {
  it("should decrement all affects for a mob", () => {
    const client = getTestClient()
    const mob = client.getPlayer().sessionMob

    mob.addAffect(newAffect(AffectType.Dazed, mob, TEST_TIMEOUT_1))
    mob.addAffect(newAffect(AffectType.Shield, mob, TEST_TIMEOUT_2))

    new DecrementAffects().notify([client])

    expect(mob.getAffect(AffectType.Dazed).timeout).toBe(TEST_TIMEOUT_1 - 1)
    expect(mob.getAffect(AffectType.Shield).timeout).toBe(TEST_TIMEOUT_2 - 1)
  })
})
