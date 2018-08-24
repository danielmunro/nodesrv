import { newShield, newWeapon } from "../../item/factory"
import RequestBuilder from "../../request/requestBuilder"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import equipped from "./equipped"

describe("equipped", () => {
  it("should describe the items worn by a mob", async () => {
    // setup
    const player = getTestPlayer()
    const mob = player.sessionMob
    mob.equipped.inventory.addItem(newShield("a test shield", "a test"))
    mob.inventory.addItem(newWeapon("a test weapon", "a test"))
    const requestBuilder = new RequestBuilder(player)

    // when
    const response = await equipped(requestBuilder.create(RequestType.Equipped))

    // then
    expect(response.message).toContain("a test shield")
    expect(response.message).not.toContain("a test weapon")
  })
})
