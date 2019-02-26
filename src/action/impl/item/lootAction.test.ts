import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"
import {Messages} from "../../constants"

let testBuilder: TestBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
})

describe("loot action", () => {
  it("requires a corpse", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.Loot, "loot foo")

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Loot.NoCorpse)
  })

  it("a corpse must have an item to loot", async () => {
    // given
    testBuilder.withItem()
      .asCorpse()
      .addToRoomBuilder(testBuilder.withRoom())
      .build()

    // when
    const response = await testBuilder.handleAction(RequestType.Loot, "loot foo corpse")

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Loot.CorpseDoesNotHaveItem)
  })

  it("can loot a corpse", async () => {
    // given
    const item = testBuilder.withItem()
      .asHelmet()
      .build()
    testBuilder.withItem()
      .asCorpse()
      .addItemToContainerInventory(item)
      .addToRoomBuilder(testBuilder.withRoom())
      .build()

    // when
    const response = await testBuilder.handleAction(RequestType.Loot, `loot '${item.name}' corpse`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you get ${item.name} from a corpse of an unnamed mob.`)
  })
})
