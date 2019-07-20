import {createTestAppContainer} from "../../app/factory/testFactory"
import {createAttackEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import MobService from "../service/mobService"
import FightStarterEventConsumer from "./fightStarterEventConsumer"

let testRunner: TestRunner
let fightStarter: FightStarterEventConsumer
let mobService: MobService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  fightStarter = app.get<EventConsumer[]>(Types.EventConsumerTable).find(eventConsumer =>
    eventConsumer instanceof FightStarterEventConsumer) as FightStarterEventConsumer
  mobService = app.get<MobService>(Types.MobService)
})

describe("fight starter", () => {
  it("starts a fight from an attack event", async () => {
    // given
    const mob1 = (await testRunner.createMob()).get()
    const mob2 = (await testRunner.createMob()).get()

    // when
    await fightStarter.consume(createAttackEvent(mob1, mob2))

    // then
    expect(mobService.findFightForMob(mob1).get()).toBeDefined()
  })

  it("won't create more than one fight between the same two mobs", async () => {
    // given
    const mob1 = (await testRunner.createMob()).get()
    const mob2 = (await testRunner.createMob()).get()

    // when
    await fightStarter.consume(createAttackEvent(mob1, mob2))
    await fightStarter.consume(createAttackEvent(mob1, mob2))

    // then
    expect(mobService.getFightCount()).toBe(1)
  })
})
