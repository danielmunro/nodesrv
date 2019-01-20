import { RequestType } from "../../../request/requestType"
import { ResponseStatus } from "../../../request/responseStatus"
import TestBuilder from "../../../test/testBuilder"

describe("lore", () => {
  it("should not work on unidentified items", async () => {
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    const item = mobBuilder.withAxeEq()
    item.identified = false

    const definition = await testBuilder.getActionDefinition(RequestType.Lore)
    const response = await definition.handle(testBuilder.createRequest(RequestType.Lore, "lore axe"))

    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.getMessageToRequestCreator()).toContain("is not identified")
  })
})
