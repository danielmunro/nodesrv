import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  await testRunner.createMob()
})

describe("quit action", () => {
  it("does not allow quiting while fighting", async () => {
    // given
    await testRunner.fight()

    // when
    const response = await testRunner.invokeAction(RequestType.Quit)

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Quit.CannotQuitWhileFighting)
  })

  it("allows a player to quit", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Quit)

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })
})
