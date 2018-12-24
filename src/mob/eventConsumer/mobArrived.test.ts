import MobEvent from "../../event/event/mobEvent"
import {EventType} from "../../event/eventType"
import TestBuilder from "../../test/testBuilder"
import {Fight} from "../fight/fight"

describe("mob arrived event consumer", () => {
  it("arriving in a room with an aggressive mob should trigger a fight", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const gameService = await testBuilder.getService()
    const mob1 = testBuilder.withMob().mob

    // given
    testBuilder.withMob().mob.traits.aggressive = true

    // when
    gameService.publishEvent(new MobEvent(EventType.MobArrived, mob1))

    // then
    const fight = gameService.mobService.findFight(f => f.isParticipant(mob1))
    expect(fight).toBeDefined()
    expect(fight).toBeInstanceOf(Fight)
  })

  it("if an aggressive mob is a lower level than the target, don't initiate an attack", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const gameService = await testBuilder.getService()
    const mob1 = testBuilder.withMob().mob

    // given
    const mob2 = testBuilder.withMob().mob
    mob2.traits.aggressive = true
    mob1.level = mob2.level + 1

    // when
    gameService.publishEvent(new MobEvent(EventType.MobArrived, mob1))

    // then
    const fight = gameService.mobService.findFight(f => f.isParticipant(mob1))
    expect(fight).not.toBeDefined()
  })
})
