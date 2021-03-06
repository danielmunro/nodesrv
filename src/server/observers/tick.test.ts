import {createTestAppContainer} from "../../app/factory/testFactory"
import EventService from "../../event/service/eventService"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import FastHealingEventConsumer from "../../mob/skill/eventConsumer/fastHealingEventConsumer"
import {newSkill} from "../../mob/skill/factory"
import {SkillType} from "../../mob/skill/skillType"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {Tick} from "./tick"

let testRunner: TestRunner
let eventService: EventService
let tick: Tick

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  tick = app.get<Tick>(Types.TickObserver)
  eventService = app.get<EventService>(Types.EventService)
})

describe("ticks", () => {
  it("should invoke fast healing on tick", async () => {
    // given
    const client = testRunner.createClient()
    await client.session.login(client, (await testRunner.createPlayer()).get())
    client.getSessionMob().skills.push(newSkill(SkillType.FastHealing, MAX_PRACTICE_LEVEL))
    const clients = [client]
    const mockSkill = jest.fn(() => ({
      getSkillType: () => SkillType.FastHealing,
      handle: jest.fn(() => ({
        isSuccessful: jest.fn(() => true),
      })),
    }))()

    // @ts-ignore
    eventService.addConsumer(new FastHealingEventConsumer([mockSkill]))

    // when
    await tick.notify(clients)

    // then
    expect(mockSkill.handle.mock.calls.length).toBe(1)
  })
})
