import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import PlayerBuilder from "../../test/playerBuilder"
import { newAffect } from "../../affect/factory"
import { AffectType } from "../../affect/affectType"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer()
})

describe("inventory action action", () => {
  it("should return a mob's inventory", async () => {
    // given
    const item1 = playerBuilder.withAxeEq()
    const item2 = playerBuilder.withHelmetEq()
    const actionCollection = await testBuilder.getActionCollection()
    const inventoryDefinition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Inventory)

    // when
    const response = await inventoryDefinition.handle(testBuilder.createRequest(RequestType.Inventory))
    const message = response.message.getMessageToRequestCreator()

    // then
    expect(message).toContain(item1.name)
    expect(message).toContain(item2.name)
  })

  it("should not show an invisible item", async () => {
    // given
    const item = playerBuilder.withAxeEq()
    item.affects.push(newAffect(AffectType.Invisible))
    const actionCollection = await testBuilder.getActionCollection()
    const inventoryDefinition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Inventory)

    // when
    const response = await inventoryDefinition.handle(testBuilder.createRequest(RequestType.Inventory))
    const message1 = response.message.getMessageToRequestCreator()

    // then
    expect(message1).not.toContain(item.name)
  })
})
