import {Item} from "../../../item/model/item"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import {Direction} from "../../../room/constants"
import TestBuilder from "../../../support/test/testBuilder"
import Action from "../../action"
import {ConditionMessages} from "../../constants"

let testBuilder: TestBuilder
let definition: Action
let mob: Mob
let item: Item
const closeCommand = "close satchel"

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.withRoom()
  testBuilder.withRoom(Direction.East)
  const playerBuilder = await testBuilder.withPlayer()
  mob = playerBuilder.player.sessionMob
  item = playerBuilder.withContainer()
  item.container.isClosed = false
  item.container.isCloseable = true
  mob.inventory.addItem(item)
  definition = await testBuilder.getAction(RequestType.Close)
})

describe("close action", () => {
  it("should be able to close item containers", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Close, closeCommand))

    // then
    expect(response.getMessageToRequestCreator()).toBe("you close a small leather satchel.")
    expect(response.message.getMessageToObservers()).toBe(mob.name + " closes a small leather satchel.")
    expect(item.container.isClosed).toBeTruthy()
    expect(response.status).toBe(ResponseStatus.Success)
  })

  it("should not be able to close uncloseable item containers", async () => {
    // given
    item.container.isCloseable = false

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Close, closeCommand))

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Close.Fail.CannotClose)
    expect(item.container.isClosed).toBeFalsy()
  })

  it("should not be able to close a container that's already closed", async () => {
    // given
    item.container.isClosed = true

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Close, closeCommand))

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe("That has already closed.")
  })
})
