import {createTestAppContainer} from "../../../app/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

describe("score information action", () => {
  it("outputs score information", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)

    // given
    const playerBuilder = testRunner.createPlayer()

    // when
    const response = await testRunner.invokeAction(RequestType.Score)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`
You are ${playerBuilder.player.sessionMob.name}, level 1 with 0 experience points.
A human warrior.
Attributes: 15 str, 15 int, 15 wis, 15 dex, 15 con, 15 sta
You have 0 gold.
`)
  })
})
