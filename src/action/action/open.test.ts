import {RequestType} from "../../request/requestType"
import {ResponseStatus} from "../../request/responseStatus"
import {Direction} from "../../room/constants"
import Door from "../../room/model/door"
import TestBuilder from "../../test/testBuilder"
import getActionCollection from "../actionCollection"
import {Messages} from "../precondition/constants"

describe("open action", () => {
  it("should require arguments", async () => {
    const testBuilder = new TestBuilder()
    const service = await testBuilder.getService()
    const actionCollection = getActionCollection(service)
    const definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Open)
    const response = await definition.handle(testBuilder.createRequest(RequestType.Open, "open"))

    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.Arguments.Open)
  })

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
