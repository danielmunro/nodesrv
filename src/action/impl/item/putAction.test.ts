import { RequestType } from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"

describe("put action", () => {
  it("should transfer an item", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()

    // given
    mobBuilder.withAxeEq()
    const container = mobBuilder.withSatchelContainer()
    const definition = await testBuilder.getActionDefinition(RequestType.Put)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Put, "put axe satchel"))

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(container.container.inventory.items).toHaveLength(1)
    expect(mobBuilder.mob.inventory.items).toHaveLength(1)
  })
})
