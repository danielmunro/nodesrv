import {Item} from "../../item/model/item"
import {Mob} from "../../mob/model/mob"
import {RequestType} from "../../request/requestType"
import {ResponseStatus} from "../../request/responseStatus"
import {Direction} from "../../room/constants"
import {newDoor} from "../../room/factory"
import {Room} from "../../room/model/room"
import TestBuilder from "../../test/testBuilder"
import {Action} from "../definition/action"
import {Messages} from "../precondition/constants"

describe("open action", () => {

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
    definition = await testBuilder.getActionDefinition(RequestType.Open)
  })

  describe("opening doors", () => {
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

  describe("opening item containers", () => {
    it("should be able to open item containers", async () => {
      // when
      const response = await definition.handle(testBuilder.createRequest(RequestType.Open, "open satchel"))

      // then
      expect(response.status).toBe(ResponseStatus.Success)
      expect(response.message.getMessageToRequestCreator()).toBe("you open a small leather satchel.")
      expect(response.message.getMessageToObservers()).toBe(mob.name + " opens a small leather satchel.")
      expect(item.container.isClosed).toBeFalsy()
    })

    it("should not be able to open a container that's already open", async () => {
      // given
      item.container.isClosed = false

      // when
      const response = await definition.handle(testBuilder.createRequest(RequestType.Open, "open satchel"))

      // then
      expect(response.status).toBe(ResponseStatus.ActionFailed)
      expect(response.message.getMessageToRequestCreator()).toBe("That is already open.")
    })
  })
})
