import CheckedRequest from "../../check/checkedRequest"
import {newFood} from "../../item/factory"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import getPrecondition from "../precondition/get"
import get from "./get"

describe("get action", () => {
  it("should be able to get an item from a room inventory", async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withRoom().withHelmetEq()
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    const itemCount = player.sessionMob.inventory.items.length
    player.sessionMob.name = "alice"

    // when
    const request = testBuilder.createRequest(RequestType.Get, "get cap")
    const check = await getPrecondition(request, await testBuilder.getService())
    const response = await get(new CheckedRequest(request, check))

    // then
    expect(player.sessionMob.inventory.items.length).toBe(itemCount + 1)
    expect(response.message.getMessageToRequestCreator()).toContain("you pick up a baseball cap")
    expect(response.message.getMessageToObservers()).toContain("alice picks up a baseball cap")
  })

  it("should be able to get an item from a container", async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    const playerBuilder = await testBuilder.withPlayer()
    const satchel = playerBuilder.withSatchelEq()
    const item = newFood("a pretzel", "a pretzel")
    const service = await testBuilder.getService()
    service.itemTable.add(item)
    satchel.containerInventory.addItem(item)

    const player = playerBuilder.player
    const itemCount = player.sessionMob.inventory.items.length
    player.sessionMob.name = "alice"

    // when
    const request = testBuilder.createRequest(RequestType.Get, "get pretzel satchel")
    const check = await getPrecondition(request, await testBuilder.getService())
    const response = await get(new CheckedRequest(request, check))

    // then
    expect(player.sessionMob.inventory.items.length).toBe(itemCount + 1)
    expect(response.message.getMessageToRequestCreator())
      .toContain("you get a pretzel from a small leather satchel")
    expect(response.message.getMessageToObservers())
      .toContain("alice gets a pretzel from a small leather satchel")
  })
})
