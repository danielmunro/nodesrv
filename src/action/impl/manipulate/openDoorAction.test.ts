import {Item} from "../../../item/model/item"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import {Direction} from "../../../room/constants"
import {newDoor} from "../../../room/factory"
import {Room} from "../../../room/model/room"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {ConditionMessages} from "../../constants"

let testBuilder: TestBuilder
let definition: Action
let source: Room
let mob: Mob
let item: Item

beforeEach(async () => {
  testBuilder = new TestBuilder()
  source = testBuilder.withRoom().room
  testBuilder.withRoom(Direction.East)
  const playerBuilder = await testBuilder.withPlayer()
  mob = playerBuilder.player.sessionMob
  item = playerBuilder.withContainer()
  item.container.isClosed = true
  mob.inventory.addItem(item)
  definition = await testBuilder.getAction(RequestType.Open)
})

describe("open action", () => {
  it("should require arguments", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Open, "open"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Open)
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
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Open.Fail.Locked)
    expect(door.isClosed).toBeTruthy()
  })
})
