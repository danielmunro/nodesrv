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

describe("close action", () => {

  let testBuilder: TestBuilder
  let definition: Action
  let source: Room
  let mob: Mob
  let item: Item
  const closeCommand = "close satchel"

  beforeEach(async () => {
    testBuilder = new TestBuilder()
    source = testBuilder.withRoom().room
    testBuilder.withRoom(Direction.East)
    const playerBuilder = await testBuilder.withPlayer()
    mob = playerBuilder.player.sessionMob
    item = playerBuilder.withContainer()
    item.container.isClosed = false
    item.container.isCloseable = true
    mob.inventory.addItem(item)
    definition = await testBuilder.getActionDefinition(RequestType.Close)
  })

  describe("closing doors", () => {
    it("should require arguments", async () => {
      // when
      const response = await definition.handle(testBuilder.createRequest(RequestType.Close, "close"))

      // then
      expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Close)
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
      expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Close.Fail.CannotClose)
      expect(door.isClosed).toBeFalsy()
    })
  })

  describe("closing containers", () => {
    it("should be able to close item containers", async () => {
      // when
      const response = await definition.handle(testBuilder.createRequest(RequestType.Close, closeCommand))

      // then
      expect(response.status).toBe(ResponseStatus.Success)
      expect(response.message.getMessageToRequestCreator()).toBe("you close a small leather satchel.")
      expect(response.message.getMessageToObservers()).toBe(mob.name + " closes a small leather satchel.")
      expect(item.container.isClosed).toBeTruthy()
    })

    it("should not be able to close uncloseable item containers", async () => {
      // given
      item.container.isCloseable = false

      // when
      const response = await definition.handle(testBuilder.createRequest(RequestType.Close, closeCommand))

      // then
      expect(response.status).toBe(ResponseStatus.ActionFailed)
      expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Close.Fail.CannotClose)
      expect(item.container.isClosed).toBeFalsy()
    })

    it("should not be able to close a container that's already closed", async () => {
      // given
      item.container.isClosed = true

      // when
      const response = await definition.handle(testBuilder.createRequest(RequestType.Close, closeCommand))

      // then
      expect(response.status).toBe(ResponseStatus.ActionFailed)
      expect(response.message.getMessageToRequestCreator()).toBe("That is already closed.")
    })
  })
})
