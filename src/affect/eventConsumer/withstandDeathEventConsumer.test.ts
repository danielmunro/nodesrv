import {createTestAppContainer} from "../../app/factory/testFactory"
import DamageEventBuilder from "../../mob/event/damageEventBuilder"
import {DamageType} from "../../mob/fight/enum/damageType"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {AffectType} from "../enum/affectType"
import {newAffect} from "../factory/affectFactory"
import WithstandDeathEventConsumer from "./withstandDeathEventConsumer"

const AMOUNT = 10

describe("withstand death event consumer", () => {
  it("will allow the mob to survive, and remove withstand death affect", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const mob = await testRunner.createMob()
    const withstandDeathEventConsumer = new WithstandDeathEventConsumer()

    // given
    mob.setHp(1).addAffect(newAffect(AffectType.WithstandDeath))

    // when
    const response = await withstandDeathEventConsumer.consume(
      new DamageEventBuilder(mob.get(), AMOUNT, DamageType.Bash).build())

    // then
    expect(response.getDamageEvent().modifier).toBe(0)
    expect(mob.hasAffect(AffectType.WithstandDeath)).toBeFalsy()
  })

  it("does not modify the event if the mob is not affected by withstand death", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const mob = await testRunner.createMob()
    const withstandDeathEventConsumer = new WithstandDeathEventConsumer()

    // given
    mob.setHp(1)

    // when
    const response = await withstandDeathEventConsumer.consume(
      new DamageEventBuilder(mob.mob, AMOUNT, DamageType.Bash).build())

    // then
    expect(response.getDamageEvent().amount).toBe(AMOUNT)
  })
})
