import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { Direction } from "../../room/constants"
import TestBuilder from "../../test/testBuilder"
import getActionCollection from "../actionCollection"
import Door from "../../room/model/door"
import {Messages} from "../precondition/constants"

describe("move", () => {
  it("should allow movement where rooms connect", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    const destination = testBuilder.withRoom(Direction.East).room
    const mob = (await testBuilder.withPlayer()).player.sessionMob
    const service = await testBuilder.getService()
    const actionCollection = getActionCollection(service)
    const definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.East)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.East))

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(service.getMobLocation(mob).room).toEqual(destination)
  })

  it("should not allow movement when an exit has a closed door", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const source = testBuilder.withRoom().room
    testBuilder.withRoom(Direction.East)
    const mob = (await testBuilder.withPlayer()).player.sessionMob
    const service = await testBuilder.getService()
    const actionCollection = getActionCollection(service)
    const definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.East)

    // given
    const door = new Door()
    door.isClosed = true
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.East))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Move.Fail.DoorIsClosed)
    expect(service.getMobLocation(mob).room).toEqual(source)
  })
})
