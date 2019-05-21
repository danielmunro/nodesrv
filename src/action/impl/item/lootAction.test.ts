import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("loot action", () => {
  it("requires a corpse", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Loot, "loot foo")

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Loot.NoCorpse)
  })

  it("a corpse must have an item to loot", async () => {
    // given
    testRunner.createItem()
      .asCorpse()
      .build()

    // when
    const response = await testRunner.invokeAction(RequestType.Loot, "loot foo corpse")

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Loot.CorpseDoesNotHaveItem)
  })

  it("can loot a corpse", async () => {
    // given
    const item = testRunner.createItem()
      .asHelmet()
      .build()
    testRunner.createItem()
      .asCorpse()
      .addItemToContainerInventory(item)
      .build()

    // when
    const response = await testRunner.invokeAction(RequestType.Loot, `loot '${item.name}' corpse`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you get ${item.name} from a corpse of an unnamed mob.`)
  })
})
