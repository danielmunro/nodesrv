import {createTestAppContainer} from "../../../inversify.config"
import {RequestType} from "../../../request/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
const testAreaName = "test area"
const differentTestArea = "different test area"
const names = ["bob", "alice", "al", "jane"]

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.getStartRoom().setArea(testAreaName)
  testRunner.createMob()

  const room1 = testRunner.createRoom().setArea(testAreaName).setName("room 1")
  testRunner.createMob(room1.room).setName(names[0])

  const room2 = testRunner.createRoom().setArea(testAreaName).setName("room 2")
  testRunner.createMob(room2.room).setName(names[1])

  const room3 = testRunner.createRoom().setArea(testAreaName).setName("room 3")
  testRunner.createMob(room3.room).setName(names[2])

  const room4 = testRunner.createRoom().setArea(differentTestArea).setName("room 4")
  testRunner.createMob(room4.room).setName(names[3])
})

describe("scan action", () => {
  it.each([
    ["scan al", false, true, true],
    ["scan bob", true, false, false],
    ["scan alice", false, true, false],
    ["scan floodle", false, false, false],
    ["scan jane", false, false, false],
  ])("will find mobs using '%s'",
    async (command: string, mob1Present: boolean, mob2Present: boolean, mob3Present: boolean) => {
    // when
    const response = await testRunner.invokeAction(RequestType.Scan, command)

    // then
    const message = response.getMessageToRequestCreator()
    expect(message.includes(`${names[0]} at room 1`)).toBe(mob1Present)
    expect(message.includes(`${names[1]} at room 2`)).toBe(mob2Present)
    expect(message.includes(`${names[2]} at room 3`)).toBe(mob3Present)
    expect(message.includes(`${names[3]} at room 4`)).toBeFalsy()
  })
})
