import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("who action", () => {
  it("shows logged in mobs", async () => {
    // given
    const client1 = await testRunner.createLoggedInClient()
    const client2 = await testRunner.createLoggedInClient()
    const client3 = await testRunner.createLoggedInClient()

    // when
    const response = await testRunner.invokeAction(RequestType.Who)

    // then
    const message = response.getMessageToRequestCreator()
    expect(message).toContain(client1.getSessionMob().name)
    expect(message).toContain(client2.getSessionMob().name)
    expect(message).toContain(client3.getSessionMob().name)
  })
})
