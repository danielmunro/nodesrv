import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let player: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  player = await testRunner.createPlayer()
})

describe("afk action", () => {
  it("can toggle on", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Afk)

    // then
    expect(response.getMessageToRequestCreator()).toBe("you are AFK")
  })

  it("can toggle off", async () => {
    // given
    player.get().isAfk = true

    // when
    const response = await testRunner.invokeAction(RequestType.Afk)

    // then
    expect(response.getMessageToRequestCreator()).toBe("you are back")
  })
})
