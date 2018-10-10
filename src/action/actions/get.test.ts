import CheckedRequest from "../../check/checkedRequest"
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

    // when
    const request = testBuilder.createRequest(RequestType.Get, "get cap")
    const check = await getPrecondition(request, await testBuilder.getService())
    const response = await get(new CheckedRequest(request, check))

    // then
    expect(player.sessionMob.inventory.items.length).toBe(itemCount + 1)
    expect(response.message.toRequestCreator).toContain("cap")
  })
})
