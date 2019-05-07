import {createTestAppContainer} from "../../../inversify.config"
import {RequestType} from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import {newDoor} from "../../../room/factory"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createRoom()
})

describe("close door action", () => {
  it("should require arguments", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Close, "close")

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Close)
  })

  it("should be able to close doors", async () => {
    // given
    const door = newDoor("door", false, false)
    testRunner.getStartRoom().addDoor(door)

    // when
    const response = await testRunner.invokeAction(RequestType.Close, "close door")

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toContain("you close a door")
    expect(response.message.getMessageToObservers()).toContain("closes a door")
    expect(door.isClosed).toBeTruthy()
  })

  it("should not be able to close an uncloseable door", async () => {
    // given
    const door = newDoor("door", false, false)
    door.noClose = true
    testRunner.getStartRoom().addDoor(door)

    // when
    const response = await testRunner.invokeAction(RequestType.Close, "close door")

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Close.Fail.CannotClose)
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(door.isClosed).toBeFalsy()
  })
})
