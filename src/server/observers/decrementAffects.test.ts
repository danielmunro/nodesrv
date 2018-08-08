import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { findOneMob, persistMob } from "../../mob/repository/mob"
import { getTestClient } from "../../test/client"
import { DecrementAffects } from "./decrementAffects"

const TEST_TIMEOUT_1 = 50
const TEST_TIMEOUT_2 = 122

describe("decrementAffects", () => {
  it("should decrement all affects for a mob", async () => {
    const client = await getTestClient()
    const mob = client.player.sessionMob
    mob.addAffect(newAffect(AffectType.Dazed, TEST_TIMEOUT_1))
    mob.addAffect(newAffect(AffectType.Shield, TEST_TIMEOUT_2))
    expect.assertions(2)
    await persistMob(mob)
    new DecrementAffects().notify([])
    const foundMob = await findOneMob(mob.id)
    expect(foundMob.getAffect(AffectType.Dazed).timeout).toBe(TEST_TIMEOUT_1 - 1)
    expect(foundMob.getAffect(AffectType.Shield).timeout).toBe(TEST_TIMEOUT_2 - 1)
  })

  it("should an affect once it decrements to zero", async () => {
    const client = await getTestClient()
    const mob = client.player.sessionMob
    mob.addAffect(newAffect(AffectType.Dazed, 0))
    expect.assertions(1)
    await persistMob(mob)
      .then(async () => await new DecrementAffects().notify([])
        .then(() => findOneMob(mob.id)
          .then((m) => expect(m.affects.length).toBe(0))))
  })
})
