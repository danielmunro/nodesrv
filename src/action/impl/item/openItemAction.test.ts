import {Item} from "../../../item/model/item"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import {Direction} from "../../../room/constants"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

let testBuilder: TestBuilder
let definition: Action
let mob: Mob
let item: Item

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.withRoom()
  testBuilder.withRoom(Direction.East)
  const playerBuilder = await testBuilder.withPlayer()
  mob = playerBuilder.player.sessionMob
  item = playerBuilder.withContainer()
  item.container.isClosed = true
  mob.inventory.addItem(item)
  definition = await testBuilder.getAction(RequestType.Open)
})

describe("open action", () => {
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
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.message.getMessageToRequestCreator()).toBe("That is already open.")
  })
})
