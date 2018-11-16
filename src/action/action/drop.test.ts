import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import drop from "./drop"

describe("drop", () => {
  it("should be able to drop an item", async () => {
    // given
    const testBuilder = new TestBuilder()
    const room = testBuilder.withRoom().room
    const playerBuilder = await testBuilder.withPlayer()
    const mob = playerBuilder.player.sessionMob

    // and
    const equipment = playerBuilder.withHelmetEq()

    // when
    const response = await drop(
      testBuilder.createOkCheckedRequest(
        RequestType.Drop,
        "drop cap",
        equipment))

    // then
    const message = response.message.getMessageToRequestCreator()
    expect(message).toContain("you drop")
    expect(message).toContain(equipment.name)
    expect(room.inventory.items).toHaveLength(1)
    expect(mob.inventory.items).toHaveLength(0)
  })
})
