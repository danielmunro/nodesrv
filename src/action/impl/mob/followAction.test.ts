import {createTestAppContainer} from "../../../app/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("follow action", () => {
  it("sanity check", async () => {
    // given
    const follower = testRunner.createMob()
    const target = testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(RequestType.Follow, `follow '${target.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you begin following ${target.getMobName()}.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${follower.getMobName()} begins following you.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${follower.getMobName()} begins following ${target.getMobName()}.`)
  })
})
