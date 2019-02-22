import {Direction} from "../../room/constants"
import TestBuilder from "../../test/testBuilder"
import MobMoveEvent from "../event/mobMoveEvent"
import {Fight} from "../fight/fight"

describe("aggressive mob event consumer", () => {
  it("arriving in a room with an aggressive mob should trigger a fight", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const gameService = await testBuilder.getService()
    const mob1 = testBuilder.withMob().mob

    // given
    testBuilder.withMob().mob.traits.aggressive = true

    // when
    await gameService.publishEvent(new MobMoveEvent(mob1, testBuilder.room, testBuilder.room, Direction.Noop))

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
    await gameService.publishEvent(new MobMoveEvent(mob1, testBuilder.room, testBuilder.room, Direction.Noop))

    // then
    const fight = gameService.mobService.findFight(f => f.isParticipant(mob1))
    expect(fight).not.toBeDefined()
  })
})
