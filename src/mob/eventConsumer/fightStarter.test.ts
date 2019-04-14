import TestBuilder from "../../support/test/testBuilder"
import AttackEvent from "../event/attackEvent"
import FightBuilder from "../fight/fightBuilder"
import MobService from "../mobService"
import FightStarter from "./fightStarter"

let testBuilder: TestBuilder
let fightStarter: FightStarter
let mobService: MobService

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobService = await testBuilder.getMobService()
  fightStarter = new FightStarter(
    mobService,
    new FightBuilder(testBuilder.eventService, await testBuilder.getLocationService()))
})

describe("fight starter", () => {
  it("starts a fight from an attack event", async () => {
    // given
    const mob1 = testBuilder.withMob()
    const mob2 = testBuilder.withMob()

    // when
    await fightStarter.consume(new AttackEvent(mob1.mob, mob2.mob))

    // then
    expect(mobService.findFightForMob(mob1.mob)).toBeDefined()
  })

  it("won't create more than one fight between the same two mobs", async () => {
    // given
    const mob1 = testBuilder.withMob()
    const mob2 = testBuilder.withMob()

    // when
    await fightStarter.consume(new AttackEvent(mob1.mob, mob2.mob))
    await fightStarter.consume(new AttackEvent(mob1.mob, mob2.mob))

    // then
    expect(mobService.getFightCount()).toBe(1)
  })
})
