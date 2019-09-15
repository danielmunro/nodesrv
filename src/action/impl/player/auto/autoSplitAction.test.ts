import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {PlayerEntity} from "../../../../player/entity/playerEntity"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let player: PlayerEntity

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  player = (await testRunner.createPlayer()).get()
})

describe("auto split action", () => {
  it("toggles off", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.AutoSplit)

    // then
    expect(response.getMessageToRequestCreator()).toBe("Auto-split toggled off.")
  })

  it("toggles on", async () => {
    // given
    player.sessionMob.playerMob.autoSplit = false

    // when
    const response = await testRunner.invokeAction(RequestType.AutoSplit)

    // then
    expect(response.getMessageToRequestCreator()).toBe("Auto-split toggled on.")
  })
})
