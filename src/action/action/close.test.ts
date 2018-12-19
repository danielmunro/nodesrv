import {Mob} from "../../mob/model/mob"
import {RequestType} from "../../request/requestType"
import {ResponseStatus} from "../../request/responseStatus"
import {Direction} from "../../room/constants"
import {newDoor} from "../../room/factory"
import {Room} from "../../room/model/room"
import TestBuilder from "../../test/testBuilder"
import getActionCollection from "../actionCollection"
import {Definition} from "../definition/definition"
import {Messages} from "../precondition/constants"

describe("close action", () => {

  let testBuilder: TestBuilder
  let definition: Definition
  let source: Room
  let mob: Mob

  beforeEach(async () => {
    testBuilder = new TestBuilder()
    source = testBuilder.withRoom().room
    testBuilder.withRoom(Direction.East)
    mob = (await testBuilder.withPlayer()).player.sessionMob
    const service = await testBuilder.getService()
    const actionCollection = getActionCollection(service)
    definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Close)
  })

  it("should require arguments", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Close, "close"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.Arguments.Close)
  })

  it("should be able to close doors", async () => {
    // given
    const door = newDoor("door", false, false)
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Close, "close door"))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("you close a door east.")
    expect(response.message.getMessageToObservers()).toBe(mob.name + " closes a door east.")
    expect(door.isClosed).toBeTruthy()
  })

  it("should not be able to close an uncloseable door", async () => {
    // given
    const door = newDoor("door", false, false)
    door.noClose = true
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Close, "close door"))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Close.Fail.CannotClose)
    expect(door.isClosed).toBeFalsy()
  })
})
