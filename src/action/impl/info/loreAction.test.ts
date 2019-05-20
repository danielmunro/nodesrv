import {createTestAppContainer} from "../../../app/testFactory"
import { RequestType } from "../../../request/enum/requestType"
import { ResponseStatus } from "../../../request/enum/responseStatus"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let mobBuilder: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = testRunner.createMob()
})

describe("lore", () => {
  it("should not work on unidentified items", async () => {
    // setup
    const item = testRunner.createWeapon()
      .asAxe()
      .build()
    mobBuilder.addItem(item)
    item.identified = false

    const response = await testRunner.invokeAction(RequestType.Lore, "lore axe")

    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toContain("has not identified")
  })

  it("should work on identified items", async () => {
    const item = testRunner.createWeapon()
      .asAxe()
      .build()
    mobBuilder.addItem(item)

    const response = await testRunner.invokeAction(RequestType.Lore, "lore axe")

    expect(response.isSuccessful()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe details:
level: 1  weight: 5  value: 10`)
  })
})
