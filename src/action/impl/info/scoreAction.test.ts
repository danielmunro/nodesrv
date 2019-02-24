import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"

describe("score information action", () => {
  it("outputs score information", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const action = await testBuilder.getAction(RequestType.Score)
    const response = await action.handle(testBuilder.createRequest(RequestType.Score))
    expect(response.message.getMessageToRequestCreator())
      .toBe(`
You are ${playerBuilder.player.sessionMob.name}, level 1 with 0 experience points.
A human warrior.
Attributes: 15 str, 15 int, 15 wis, 15 dex, 15 con, 15 sta
You have 0 gold.
`)
  })
})
