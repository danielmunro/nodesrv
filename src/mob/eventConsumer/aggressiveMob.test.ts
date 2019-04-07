import {Direction} from "../../room/constants"
import TestBuilder from "../../support/test/testBuilder"
import MobMoveEvent from "../event/mobMoveEvent"
import {Fight} from "../fight/fight"

describe("aggressive mob event consumer", () => {
  it("arriving in a room with an aggressive mob should trigger a fight", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const gameService = await testBuilder.getService()
    const player = await testBuilder.withPlayer()

    // given
    testBuilder.withMob().mob.traits.aggressive = true

    // when
    await gameService.publishEvent(
      new MobMoveEvent(player.getMob(), testBuilder.room, testBuilder.room, Direction.Noop))

    // then
    const fight = gameService.mobService.findFight(f => f.isParticipant(player.getMob()))
    expect(fight).toBeDefined()
    expect(fight).toBeInstanceOf(Fight)
  })

  it("don't attack non-players", async () => {
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
    expect(fight).not.toBeDefined()
  })

  it("if an aggressive mob has a lower level than the target, don't initiate an attack", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const gameService = await testBuilder.getService()
    const player = await testBuilder.withPlayer()

    // given
    const mob2 = testBuilder.withMob().mob
    mob2.traits.aggressive = true
    player.setLevel(mob2.level + 1)

    // when
    await gameService.publishEvent(
      new MobMoveEvent(player.getMob(), testBuilder.room, testBuilder.room, Direction.Noop))

    // then
    const fight = gameService.mobService.findFight(f => f.isParticipant(player.getMob()))
    expect(fight).not.toBeDefined()
  })
})
