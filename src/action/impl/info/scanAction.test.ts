import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../support/test/testBuilder"
import Action from "../../action"

let testBuilder: TestBuilder
let action: Action
const testAreaName = "test area"
const differentTestArea = "different test area"
const names = ["bob", "alice", "al", "jane"]

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.withMobBuilder(names[0])
    .addToRoom(testBuilder.withRoom().setArea(testAreaName))
    .build()
  testBuilder.withMobBuilder(names[1])
    .addToRoom(testBuilder.addRoomToPreviousRoom().setArea(testAreaName))
    .build()
  testBuilder.withMobBuilder(names[2])
    .addToRoom(testBuilder.addRoomToPreviousRoom().setArea(testAreaName))
    .build()
  testBuilder.withMobBuilder(names[3])
    .addToRoom(testBuilder.addRoomToPreviousRoom().setArea(differentTestArea))
    .build()
  await testBuilder.withPlayer()
  action = await testBuilder.getAction(RequestType.Scan)
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
    const response = await action.handle(testBuilder.createRequest(RequestType.Scan, command))
    const message = response.message.getMessageToRequestCreator()
    // then
    expect(message.includes(`${names[0]} at a test room`)).toBe(mob1Present)
    expect(message.includes(`${names[1]} at a test room`)).toBe(mob2Present)
    expect(message.includes(`${names[2]} at a test room`)).toBe(mob3Present)
    expect(message.includes(`${names[3]} at a test room`)).toBeFalsy()
  })
})
