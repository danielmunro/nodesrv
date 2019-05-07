
import {createTestAppContainer} from "../inversify.config"
import TestRunner from "../support/test/testRunner"
import {Types} from "../support/types"

const INITIAL_AMOUNT = 1000

describe("playerMob model", () => {
  it("does not add experience if the player qualifies for a level", async () => {
    // setup
    const testBuilder = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const player = testBuilder.createPlayer()
    const playerMob = player.getMob().playerMob

    // given
    playerMob.experienceToLevel = INITIAL_AMOUNT

    // when
    playerMob.addExperience(INITIAL_AMOUNT + 1)
    playerMob.addExperience(INITIAL_AMOUNT + 1)

    // then
    expect(playerMob.experienceToLevel).toBe(-1)
  })
})
