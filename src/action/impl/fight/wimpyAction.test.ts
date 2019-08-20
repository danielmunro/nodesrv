import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {format} from "../../../support/string"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("wimpy action", () => {
  it("cannot be above 20% of a mob's hp", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Wimpy, "wimpy 5")

    // then
    expect(response.getMessageToRequestCreator()).toBe(format(Messages.Wimpy.TooHigh, 4))
  })

  it("works with a valid number", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Wimpy, "wimpy 4")

    // then
    expect(response.getMessageToRequestCreator()).toBe(format(Messages.Wimpy.Success, 4))
  })
})
