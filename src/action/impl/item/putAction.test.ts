import { RequestType } from "../../../request/requestType"
import TestBuilder from "../../../support/test/testBuilder"

describe("put action", () => {
  it("should transfer an item", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()

    // given
    const item = testBuilder.withWeapon()
      .asAxe()
      .addToMobBuilder(mobBuilder)
      .build()
    const container = testBuilder.withItem()
      .asSatchel()
      .addToMobBuilder(mobBuilder)
      .build()
    const definition = await testBuilder.getAction(RequestType.Put)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Put, `put '${item}' satchel`))

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(container.container.inventory.items).toHaveLength(1)
    expect(mobBuilder.mob.inventory.items).toHaveLength(1)
  })
})
