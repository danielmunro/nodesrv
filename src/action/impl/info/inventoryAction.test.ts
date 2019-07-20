import {AffectType} from "../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let playerBuilder: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  playerBuilder = (await testRunner.createPlayer())
})

describe("inventory action action", () => {
  it("should return a mob's inventory", async () => {
    // given
    const item1 = testRunner.createWeapon()
      .asAxe()
      .build()
    playerBuilder.addItem(item1)
    const item2 = testRunner.createItem()
      .asHelmet()
      .build()
    playerBuilder.addItem(item2)

    // when
    const response = await testRunner.invokeAction(RequestType.Inventory)
    const message = response.getMessageToRequestCreator()

    // then
    expect(message).toContain(item1.name)
    expect(message).toContain(item2.name)
  })

  it("should not show an invisible item", async () => {
    // given
    const item = testRunner.createWeapon()
      .asAxe()
      .addAffect(AffectType.Invisible)
      .build()
    playerBuilder.addItem(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Inventory)

    // then
    expect(response.getMessageToRequestCreator()).not.toContain(item.name)
  })
})
