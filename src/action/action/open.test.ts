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

describe("open action", () => {

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
    definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Open)
  })

  it("should require arguments", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Open, "open"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.Arguments.Open)
  })

  it("should be able to open doors", async () => {
    // given
    const door = newDoor("door", true, false)
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Open, "open door"))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("you open a door east.")
    expect(response.message.getMessageToObservers()).toBe(mob.name + " opens a door east.")
    expect(door.isClosed).toBeFalsy()
  })

  it("should not be able to open a locked door", async () => {
    // given
    const door = newDoor("door", true, true)
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Open, "open door"))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Open.Fail.Locked)
    expect(door.isClosed).toBeTruthy()
  })
})
