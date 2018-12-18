import TestBuilder from "../../test/testBuilder"
import {Direction} from "../../room/constants"
import getActionCollection from "../actionCollection"
import {RequestType} from "../../request/requestType"
import Door from "../../room/model/door"
import {ResponseStatus} from "../../request/responseStatus"
import {Messages} from "../precondition/constants"
import {format} from "../../support/string"

describe("open action", () => {
  it("should be able to open doors", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const source = testBuilder.withRoom().room
    testBuilder.withRoom(Direction.East)
    const mob = (await testBuilder.withPlayer()).player.sessionMob
    const service = await testBuilder.getService()
    const actionCollection = getActionCollection(service)
    const definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Open)

    // given
    const door = new Door()
    door.isClosed = true
    door.name = "door"
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Open, "open door"))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("you open a door east.")
    expect(response.message.getMessageToObservers()).toBe(mob.name + " opens a door east.")
    expect(door.isClosed).toBeFalsy()
  })
})
