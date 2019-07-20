import {createTestAppContainer} from "../../../app/factory/testFactory"
import {Client} from "../../../client/client"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let client: Client

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  client = testRunner.createClient()
  client.player = testRunner.createPlayer().get()
})

describe("cc list action", () => {
  it("lists credit cards", async () => {
    // given
    await testRunner.invokeAction(RequestType.CCAdd, "cc-add 'test debit card' 4141414141414141 1 2020")
    await testRunner.invokeAction(RequestType.CCAdd, "cc-add cc 4141414141414141 1 2020")

    // when
    const response = await testRunner.invokeAction(RequestType.CCList)

    // then
    expect(response.getMessageToRequestCreator()).toContain("test debit card - ")
    expect(response.getMessageToRequestCreator()).toContain("cc - ")
  })
})
