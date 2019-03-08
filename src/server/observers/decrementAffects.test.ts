import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import MobTable from "../../mob/mobTable"
import TestBuilder from "../../test/testBuilder"
import {DecrementAffects} from "./decrementAffects"

const TEST_TIMEOUT_1 = 50
const TEST_TIMEOUT_2 = 122

describe("decrementAffects", () => {
  it("should decrement all affects for a mob", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const client = await testBuilder.withClient()

    // given
    const mob = client.player.sessionMob
    mob.addAffect(newAffect(AffectType.Stunned, TEST_TIMEOUT_1))
    mob.addAffect(newAffect(AffectType.Shield, TEST_TIMEOUT_2))
    const table = new MobTable([mob])
    const decrementAffects = new DecrementAffects(table)

    // when
    await decrementAffects.notify()

    // then
    expect(mob.getAffect(AffectType.Stunned).timeout).toBe(TEST_TIMEOUT_1 - 1)
    expect(mob.getAffect(AffectType.Shield).timeout).toBe(TEST_TIMEOUT_2 - 1)
  })

  it("should remove an affect once it decrements to zero", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const client = await testBuilder.withClient()

    // given
    const mob = client.player.sessionMob
    mob.addAffect(newAffect(AffectType.Stunned, 0))
    const table = new MobTable([mob])
    const decrementAffects = new DecrementAffects(table)

    // when
    await decrementAffects.notify()

    // then
    expect(mob.affects.length).toBe(0)
  })
})
