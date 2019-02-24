import {AffectType} from "../../../affect/affectType"
import {RequestType} from "../../../request/requestType"
import PlayerBuilder from "../../../test/playerBuilder"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer()
  action = await testBuilder.getAction(RequestType.Inventory)
})

describe("inventory action action", () => {
  it("should return a mob's inventory", async () => {
    // given
    const item1 = testBuilder.withWeapon()
      .asAxe()
      .addToPlayerBuilder(playerBuilder)
      .build()
    const item2 = testBuilder.withItem()
      .asHelmet()
      .addToPlayerBuilder(playerBuilder)
      .build()

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Inventory))
    const message = response.message.getMessageToRequestCreator()

    // then
    expect(message).toContain(item1.name)
    expect(message).toContain(item2.name)
  })

  it("should not show an invisible item", async () => {
    // given
    const item = testBuilder.withWeapon()
      .asAxe()
      .addToPlayerBuilder(playerBuilder)
      .addAffect(AffectType.Invisible)
      .build()

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Inventory))

    // then
    expect(response.message.getMessageToRequestCreator()).not.toContain(item.name)
  })
})
