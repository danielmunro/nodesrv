import { DamageType } from "../../damage/damageType"
import { newShield, newWeapon } from "../../item/factory"
import { WeaponType } from "../../item/weaponType"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import TestBuilder from "../../test/testBuilder"
import equipped from "./equipped"

describe("equipped", () => {
  it("should describe the items worn by a mob", async () => {
    // setup
    const  testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    const helmet = playerBuilder.equip().withHelmetEq()
    const axe = playerBuilder.withAxeEq()

    // when
    const response = await equipped(new Request(playerBuilder.player, RequestType.Equipped))

    // then
    expect(response.message).toContain(helmet.name)
    expect(response.message).not.toContain(axe.name)
  })
})
