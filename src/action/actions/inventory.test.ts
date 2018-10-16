import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"

describe("inventory actions actions", () => {
  it("should return a mob's inventory", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const item1 = playerBuilder.withAxeEq()
    const item2 = playerBuilder.withHelmetEq()
    const actionCollection = await testBuilder.getActionCollection()
    const inv = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Inventory)

    // when
    const response = await inv.handle(testBuilder.createRequest(RequestType.Inventory))
    const message = response.message.getMessageToRequestCreator()

    // then
    expect(message).toContain(item1.name)
    expect(message).toContain(item2.name)
  })
})
