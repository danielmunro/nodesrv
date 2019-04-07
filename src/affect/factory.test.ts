import { getTestMob } from "../support/test/mob"
import { AffectType } from "./affectType"
import { newAffect } from "./factory"

describe("affect factory", () => {
  it("should create an affect with the parameters passed in", () => {
    const type = AffectType.Stunned
    const mob = getTestMob()
    const timeout = 10
    const affect = newAffect(type, timeout)
    mob.affect().add(affect)

    expect(affect.affectType).toBe(type)
    expect(affect.mob).toBe(mob)
    expect(affect.timeout).toBe(timeout)
  })
})
