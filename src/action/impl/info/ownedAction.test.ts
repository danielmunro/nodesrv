import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("owned action", () => {
  it("describes when a room is not ownable", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Owned)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${testRunner.getStartRoom().get().name} cannot be owned.`)
  })

  it("describes when a room is ownable but not owned", async () => {
    // given
    testRunner.getStartRoom().makeOwnable()

    // when
    const response = await testRunner.invokeAction(RequestType.Owned)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`${testRunner.getStartRoom().get().name} does not have an owner.`)
  })

  it("describes when a room is owned", async () => {
    // setup
    const room = testRunner.getStartRoom()
    const mob = await testRunner.createMob()
    room.makeOwnable().setOwner(mob.get())

    // when
    const response = await testRunner.invokeAction(RequestType.Owned)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`${testRunner.getStartRoom().get().name} is owned by ${mob.getMobName()}.`)
  })
})
