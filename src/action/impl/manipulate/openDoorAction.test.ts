import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import {newDoor} from "../../../room/factory"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createRoom()
})

describe("open action", () => {
  it("should require arguments", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Open, "open")

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Open)
  })

  it("should be able to open doors", async () => {
    // given
    const door = newDoor("door", true, false)
    testRunner.getStartRoom().addDoor(door)

    // when
    const response = await testRunner.invokeAction(RequestType.Open, "open door")

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.getMessageToRequestCreator()).toContain("you open a door")
    expect(response.message.getMessageToObservers()).toContain("opens a door")
    expect(door.isClosed).toBeFalsy()
  })

  it("should not be able to open a locked door", async () => {
    // given
    const door = newDoor("door", true, true)
    testRunner.getStartRoom().addDoor(door)

    // when
    const response = await testRunner.invokeAction(RequestType.Open, "open door")

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Open.Fail.Locked)
    expect(door.isClosed).toBeTruthy()
  })
})
