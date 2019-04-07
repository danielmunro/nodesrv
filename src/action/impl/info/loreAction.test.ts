import { RequestType } from "../../../request/requestType"
import { ResponseStatus } from "../../../request/responseStatus"
import TestBuilder from "../../../support/test/testBuilder"

describe("lore", () => {
  it("should not work on unidentified items", async () => {
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    const item = testBuilder.withWeapon()
      .asAxe()
      .addToMobBuilder(mobBuilder)
      .build()
    item.identified = false

    const definition = await testBuilder.getAction(RequestType.Lore)
    const response = await definition.handle(testBuilder.createRequest(RequestType.Lore, "lore axe"))

    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.message.getMessageToRequestCreator()).toContain("has not identified")
  })

  it("should work on identified items", async () => {
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    testBuilder.withWeapon()
      .asAxe()
      .addToMobBuilder(mobBuilder)
      .build()

    const definition = await testBuilder.getAction(RequestType.Lore)
    const response = await definition.handle(testBuilder.createRequest(RequestType.Lore, "lore axe"))

    expect(response.isSuccessful()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe details:
level: 1  weight: 5  value: 10`)
  })
})
