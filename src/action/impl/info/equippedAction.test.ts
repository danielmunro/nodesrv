import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

describe("equipped", () => {
  it("should describe the items worn by a mob", async () => {
    // setup
    const  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const helmet = testRunner.createItem()
      .asHelmet()
      .build()
    const axe = testRunner.createWeapon()
      .asAxe()
      .build()

    // given
    testRunner.createMob()
      .equip(helmet)
      .addItem(axe)

    // when
    const response = await testRunner.invokeAction(RequestType.Equipped)

    // then
    const message = response.message.getMessageToRequestCreator()
    expect(message).toContain(helmet.name)
    expect(message).not.toContain(axe.name)
  })
})
