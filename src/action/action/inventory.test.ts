import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { RequestType } from "../../request/requestType"
import PlayerBuilder from "../../test/playerBuilder"
import TestBuilder from "../../test/testBuilder"
import {Action} from "../definition/action"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let actionDefinition: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer()
  actionDefinition = await testBuilder.getActionDefinition(RequestType.Inventory)
})

describe("inventory action action", () => {
  it("should return a mob's inventory", async () => {
    // given
    const item1 = playerBuilder.withAxeEq()
    const item2 = playerBuilder.withHelmetEq()

    // when
    const response = await actionDefinition.handle(testBuilder.createRequest(RequestType.Inventory))
    const message = response.message.getMessageToRequestCreator()

    // then
    expect(message).toContain(item1.name)
    expect(message).toContain(item2.name)
  })

  it("should not show an invisible item", async () => {
    // given
    const item = playerBuilder.withAxeEq()
    item.affects.push(newAffect(AffectType.Invisible))

    // when
    const response = await actionDefinition.handle(testBuilder.createRequest(RequestType.Inventory))
    const message1 = response.message.getMessageToRequestCreator()

    // then
    expect(message1).not.toContain(item.name)
  })
})
