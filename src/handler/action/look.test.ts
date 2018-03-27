import { Item } from "../../item/model/item"
import { Request } from "../../server/request/request"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import { RequestType } from "../constants"
import look, { NOT_FOUND } from "./look"

describe("look", () => {
  it("should describe a room when no arguments are provided", () => {
    const room = getTestRoom()
    const player = getTestPlayer()
    room.addMob(player.sessionMob)
    expect.assertions(1)

    return look(new Request(player, RequestType.Look, {request: "look"}))
      .then((response) => expect(response.room).toBe(room))
  })

  it("should let the player know if the thing they want to look at does not exist", () => {
    expect.assertions(1)
    return look(new Request(getTestPlayer(), RequestType.Look, {request: "look foo"}))
      .then((response) => expect(response.message).toBe(NOT_FOUND))
  })

  it("should describe a mob when a mob is present", () => {
    const room = getTestRoom()
    const player = getTestPlayer()
    room.addMob(player.sessionMob)
    const mob = getTestMob("alice")
    room.addMob(mob)
    expect.assertions(1)

    return look(new Request(player, RequestType.Look, {request: "look alice"}))
      .then((response) => expect(response).toEqual({ mob }))
  })

  it("should be able to describe an item in the room", () => {
    const room = getTestRoom()
    const item = new Item()
    item.name = "a pirate hat"
    room.inventory.addItem(item)
    const player = getTestPlayer()
    room.addMob(player.sessionMob)
    expect.assertions(1)

    return look(new Request(player, RequestType.Look, {request: "look pirate"}))
      .then((response) => expect(response).toEqual({ item }))
  })

  it("should be able to describe an item in the session mob's inventory", () => {
    const room = getTestRoom()
    const player = getTestPlayer()
    const item = new Item()
    item.name = "a pirate hat"
    player.sessionMob.inventory.addItem(item)
    room.addMob(player.sessionMob)
    expect.assertions(1)

    return look(new Request(player, RequestType.Look, {request: "look pirate"}))
      .then((response) => expect(response).toEqual({ item }))
  })
})
