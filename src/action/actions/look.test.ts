import { Item } from "../../item/model/item"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import { NOT_FOUND } from "./constants"
import look from "./look"

function useLookRequest(input: string) {
  return look(new Request(player, RequestType.Look, input))
}

let room
let player

beforeEach(() => {
  room = getTestRoom()
  player = getTestPlayer()
  room.addMob(player.sessionMob)
})

describe("look", () => {
  it("should describe a room when no arguments are provided", async () => {
    // when
    const response = await useLookRequest("look")

    // then
    expect(response.message).toContain(room.name)
    expect(response.message).toContain(room.description)
  })

  it("should let the player know if the thing they want to look at does not exist", async () => {
    // when
    const response = await useLookRequest("look foo")

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.message).toBe(NOT_FOUND)
  })

  it("should describe a mob when a mob is present", async () => {
    // given
    const mob = getTestMob("alice")
    room.addMob(mob)

    // when
    const response = await useLookRequest("look alice")

    // then
    expect(response.message).toBe(mob.description)
  })

  it("should be able to describe an item in the room", async () => {
    // given
    const item = new Item()
    item.name = "a pirate hat"
    item.description = "this is a test item"
    room.inventory.addItem(item)

    // when
    const response = await useLookRequest("look pirate")

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

    // when
    const response = await useLookRequest("look pirate")

    // then
    expect(response.message).toBe(item.description)
  })
})
