import TestBuilder from "../test/testBuilder"

const INITIAL_AMOUNT = 1000

describe("playerMob model", () => {
  it("does not add experience if the player qualifies for a level", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const player = await testBuilder.withPlayer()
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
