import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner
const testAreaName = "test area"
const differentTestArea = "different test area"
const names = ["bob", "alice", "al", "jane"]

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.getStartRoom().setArea(testAreaName)
  await testRunner.createMob()

  const room1 = testRunner.createRoom().setArea(testAreaName).setName("room 1")
  const mob1 = await testRunner.createMob(room1.room)
  mob1.setName(names[0])

  const room2 = testRunner.createRoom().setArea(testAreaName).setName("room 2")
  const mob2 = await testRunner.createMob(room2.room)
  mob2.setName(names[1])

  const room3 = testRunner.createRoom().setArea(testAreaName).setName("room 3")
  const mob3 = await testRunner.createMob(room3.room)
  mob3.setName(names[2])

  const room4 = testRunner.createRoom().setArea(differentTestArea).setName("room 4")
  const mob4 = await testRunner.createMob(room4.room)
  mob4.setName(names[3])
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

  it("requires a subject", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Scan)

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Scan.NoSubject)
  })
})
