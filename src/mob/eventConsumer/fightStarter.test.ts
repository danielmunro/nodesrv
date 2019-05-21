import {createTestAppContainer} from "../../app/factory/testFactory"
import EventConsumer from "../../event/eventConsumer"
import {createAttackEvent} from "../../event/factory"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import MobService from "../service/mobService"
import FightStarter from "./fightStarter"

let testRunner: TestRunner
let fightStarter: FightStarter
let mobService: MobService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  fightStarter = app.get<EventConsumer[]>(Types.EventConsumerTable).find(eventConsumer =>
    eventConsumer instanceof FightStarter) as FightStarter
  mobService = app.get<MobService>(Types.MobService)
})

describe("fight starter", () => {
  it("starts a fight from an attack event", async () => {
    // given
    const mob1 = testRunner.createMob().get()
    const mob2 = testRunner.createMob().get()

    // when
    await fightStarter.consume(createAttackEvent(mob1, mob2))

    // then
    expect(mobService.findFightForMob(mob1)).toBeDefined()
  })

  it("won't create more than one fight between the same two mobs", async () => {
    // given
    const mob1 = testRunner.createMob().get()
    const mob2 = testRunner.createMob().get()

    // when
    await fightStarter.consume(createAttackEvent(mob1, mob2))
    await fightStarter.consume(createAttackEvent(mob1, mob2))

    // then
    expect(mobService.getFightCount()).toBe(1)
  })
})
