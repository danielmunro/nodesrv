import TestBuilder from "../../test/testBuilder"
import { RequestType } from "../../request/requestType"

describe("put action", () => {
  it("should transfer an item", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()

    // given
    mobBuilder.withAxeEq()
    const container = mobBuilder.withSatchelContainer()
    const definition = await testBuilder.getActionCollection()
    const put = definition.getMatchingHandlerDefinitionForRequestType(RequestType.Put)

    // when
    const response = await put.handle(testBuilder.createRequest(RequestType.Put, "put axe satchel"))

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(container.containerInventory.items).toHaveLength(1)
    expect(mobBuilder.mob.inventory.items).toHaveLength(1)
  })
})
