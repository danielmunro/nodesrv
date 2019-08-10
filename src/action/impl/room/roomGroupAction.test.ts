import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("room group action", () => {
  it("can change a room group name", async () => {
    // setup
    const room = testRunner.getStartRoom().get()

    // given
    const name = "Midgaard Common Road"

    // when
    const response = await testRunner.invokeAction(RequestType.RoomGroup, `room group '${name}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${room.name} group is updated to '${name}'`)
    expect(room.groupName).toBe(name)
  })
})
