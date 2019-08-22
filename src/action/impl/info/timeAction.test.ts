import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("time action", () => {
  it("describes the time", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Time)

    // then
    expect(response.getMessageToRequestCreator()).toBe("The current time is 12 o'clock AM.")
  })

  it("describes the time in the AM", async () => {
    // given
    testRunner.setTime(1)

    // when
    const response = await testRunner.invokeAction(RequestType.Time)

    // then
    expect(response.getMessageToRequestCreator()).toBe("The current time is 1 o'clock AM.")
  })

  it("describes the time in the PM", async () => {
    // given
    testRunner.setTime(15)

    // when
    const response = await testRunner.invokeAction(RequestType.Time)

    // then
    expect(response.getMessageToRequestCreator()).toBe("The current time is 3 o'clock PM.")
  })
})
