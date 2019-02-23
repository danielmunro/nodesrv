import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"

describe("equipped", () => {
  it("should describe the items worn by a mob", async () => {
    // setup
    const  testBuilder = new TestBuilder()
    const action = await testBuilder.getActionDefinition(RequestType.Equipped)
    const playerBuilder = await testBuilder.withPlayer()
    const helmet = playerBuilder.equip().withHelmetEq()
    const axe = testBuilder.withWeapon()
      .asAxe()
      .addToInventory(playerBuilder.player.sessionMob.inventory)
      .build()

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Equipped))

    // then
    const message = response.message.getMessageToRequestCreator()
    expect(message).toContain(helmet.name)
    expect(message).not.toContain(axe.name)
  })
})
