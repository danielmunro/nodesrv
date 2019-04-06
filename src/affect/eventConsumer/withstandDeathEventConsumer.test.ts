import {DamageType} from "../../damage/damageType"
import DamageEvent from "../../mob/event/damageEvent"
import TestBuilder from "../../test/testBuilder"
import {AffectType} from "../affectType"
import {newAffect} from "../factory"
import WithstandDeathEventConsumer from "./withstandDeathEventConsumer"

const AMOUNT = 10

describe("withstand death event consumer", () => {
  it("will allow the mob to survive, and remove withstand death affect", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mob = testBuilder.withMob()
    const withstandDeathEventConsumer = new WithstandDeathEventConsumer()

    // given
    mob.setHp(1).addAffect(newAffect(AffectType.WithstandDeath))

    // when
    const response = await withstandDeathEventConsumer.consume(
      new DamageEvent(mob.mob, AMOUNT, DamageType.Bash))

    // then
    expect(response.event.amount).toBe(0)
    expect(mob.hasAffect(AffectType.WithstandDeath)).toBeFalsy()
  })

  it("does not modify the event if the mob has not affected by withstand death", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mob = testBuilder.withMob()
    const withstandDeathEventConsumer = new WithstandDeathEventConsumer()

    // given
    mob.setHp(1)

    // when
    const response = await withstandDeathEventConsumer.consume(
      new DamageEvent(mob.mob, AMOUNT, DamageType.Bash))

    // then
    expect(response.event.amount).toBe(AMOUNT)
  })
})
