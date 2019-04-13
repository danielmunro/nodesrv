import EventService from "../../event/eventService"
import TimeService from "../../gameService/timeService"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import FastHealingEventConsumer from "../../skill/eventConsumer/fastHealingEventConsumer"
import {newSkill} from "../../skill/factory"
import {SkillType} from "../../skill/skillType"
import {getConnection, initializeConnection} from "../../support/db/connection"
import TestBuilder from "../../support/test/testBuilder"
import {Tick} from "./tick"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("ticks", () => {
  it("should call tick on all clients", async () => {
    const testBuilder = new TestBuilder()

    // given
    const clients = [
      await testBuilder.withClient(),
      await testBuilder.withClient(),
      await testBuilder.withClient(),
      await testBuilder.withClient(),
      await testBuilder.withClient(),
    ]

    const tick = new Tick(
      new TimeService(),
      new EventService(),
      await testBuilder.getLocationService())

    // when
    await tick.notify(clients)

    // then
    clients.forEach((client) => expect(client.ws.send.mock.calls.length).toBeGreaterThan(1))
  })

  it("should invoke fast healing on tick", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const client = await testBuilder.withClient()
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
        new FastHealingEventConsumer(mockSkill),
      ]),
      await testBuilder.getLocationService()).notify(clients)

    // then
    expect(mockSkill.handle.mock.calls.length).toBe(1)
  })
})
