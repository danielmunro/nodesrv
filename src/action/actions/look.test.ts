import { Item } from "../../item/model/item"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { getTestMob } from "../../test/mob"
import TestBuilder from "../../test/testBuilder"
import { NOT_FOUND } from "./constants"
import look from "./look"

let testBuilder
let room
let player

beforeEach(async () => {
  testBuilder = new TestBuilder()
  const playerBuilder = await testBuilder.withPlayer()
  player = playerBuilder.player
  room = testBuilder.withRoom().room
})

describe("look", () => {
  it("should describe a room when no arguments are provided", async () => {
    // when
    const response = await look(testBuilder.createRequest(RequestType.Look), testBuilder.getService())

    // then
    expect(response.message).toContain(room.name)
    expect(response.message).toContain(room.description)
  })

  it("should let the player know if the thing they want to look at does not exist", async () => {
    // when
    const response = await look(testBuilder.createRequest(RequestType.Look, "look foo"), await testBuilder.getService())

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.message).toBe(NOT_FOUND)
  })

  it("should describe a mob when a mob is present", async () => {
    // given
    const mob = getTestMob("alice")
    room.addMob(mob)

    // when
    const response = await look(testBuilder.createRequest(RequestType.Look, "look alice"), testBuilder.getService())

    // then
    expect(response.message).toBe(mob.description)
  })

  it("should be able to describe an item in the room", async () => {
    // given
    const item = new Item()
    item.name = "a pirate hat"
    item.description = "this is a test item"
    room.inventory.addItem(item)
    const service = await testBuilder.getService()
    service.itemTable.add(item)

    // when
    const response = await look(testBuilder.createRequest(RequestType.Look, "look pirate"), service)

    // then
    expect(response.message).toBe(item.description)
  })

  it("should be able to describe an item in the session mob's inventory", async () => {
    // given
    const item = new Item()
    item.name = "a pirate hat"
    item.description = "this is a test item"
    player.sessionMob.inventory.addItem(item)
    room.addMob(player.sessionMob)
    const service = await testBuilder.getService()
    service.itemTable.add(item)

    // when
    const response = await look(testBuilder.createRequest(RequestType.Look, "look pirate"), service)

    // then
    expect(response.message).toBe(item.description)
  })
})
