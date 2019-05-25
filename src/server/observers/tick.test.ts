import {createTestAppContainer} from "../../app/factory/testFactory"
import EventService from "../../event/service/eventService"
import TimeService from "../../gameService/timeService"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import LocationService from "../../mob/service/locationService"
import FastHealingEventConsumer from "../../skill/eventConsumer/fastHealingEventConsumer"
import {newSkill} from "../../skill/factory"
import {SkillType} from "../../skill/skillType"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {Tick} from "./tick"

let testRunner: TestRunner
let locationService: LocationService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  locationService = app.get<LocationService>(Types.LocationService)
})

describe("ticks", () => {
  it("should call tick on all clients", async () => {
    // given
    const clients = [
      testRunner.createClient(),
      testRunner.createClient(),
      testRunner.createClient(),
      testRunner.createClient(),
      testRunner.createClient(),
    ]
    for (const client of clients) {
      await client.session.login(client, testRunner.createPlayer().get())
    }

    const tick = new Tick(
      new TimeService(),
      new EventService(),
      locationService)

    // when
    await tick.notify(clients)

    // then
    clients.forEach((client) => expect(client.ws.send.mock.calls.length).toBeGreaterThan(1))
  })

  it("should invoke fast healing on tick", async () => {
    // given
    const client = testRunner.createClient()
    await client.session.login(client, testRunner.createPlayer().get())
    client.getSessionMob().skills.push(newSkill(SkillType.FastHealing, MAX_PRACTICE_LEVEL))
    const clients = [client]
    const mockSkill = jest.fn(() => ({
      handle: jest.fn(() => ({
        isSuccessful: jest.fn(),
      })),
    }))()

    // when
    await new Tick(
      new TimeService(),
      new EventService([
        new FastHealingEventConsumer(mockSkill as any),
      ]),
      locationService).notify(clients)

    // then
    expect(mockSkill.handle.mock.calls.length).toBe(1)
  })
})
