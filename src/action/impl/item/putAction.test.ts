import {createTestAppContainer} from "../../../app/factory/testFactory"
import { RequestType } from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

describe("put action", () => {
  it("should transfer an item", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const mobBuilder = testRunner.createMob()

    // given
    const item = testRunner.createWeapon()
      .asAxe()
      .build()
    mobBuilder.addItem(item)
    const container = testRunner.createItem()
      .asSatchel()
      .build()
    mobBuilder.addItem(container)

    // when
    const response = await testRunner.invokeAction(RequestType.Put, `put '${item}' satchel`)

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(container.container.inventory.items).toHaveLength(1)
    expect(mobBuilder.mob.inventory.items).toHaveLength(1)
  })
})
