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

describe("auto loot action", () => {
  it("toggles off", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.AutoLoot)

    // then
    expect(response.getMessageToRequestCreator()).toBe("Auto-loot toggled off.")
  })

  it("toggles on", async () => {
    // given
    player.sessionMob.playerMob.autoLoot = false

    // when
    const response = await testRunner.invokeAction(RequestType.AutoLoot)

    // then
    expect(response.getMessageToRequestCreator()).toBe("Auto-loot toggled on.")
  })

  it("modifies `look` to not include exits", async () => {
    // given
    player.sessionMob.playerMob.autoExit = false

    // when
    const response = await testRunner.invokeAction(RequestType.Look)

    // then
    expect(response.getMessageToRequestCreator().toLowerCase()).not.toContain("exits")
  })
})
