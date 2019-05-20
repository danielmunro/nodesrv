import {createTestAppContainer} from "../../../app/testFactory"
import {CheckMessages} from "../../../check/constants"
import {RequestType} from "../../../request/enum/requestType"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"

let testRunner: TestRunner
let playerBuilder: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  playerBuilder = testRunner.createPlayer()
})

describe("level action", () => {
  it("does not work if experienceToLevel has greater than 0", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Level)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NotEnoughExperience)
  })

  it("works if experienceToLevel has less than or equal to 0", async () => {
    // given
    playerBuilder.setExperienceToLevel(0)

    // when
    const response = await testRunner.invokeAction(RequestType.Level)

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(Messages.Level.Success)
  })

  it("increases a mob's level by 1", async () => {
    // given
    playerBuilder.setExperienceToLevel(0)
    const level = playerBuilder.getMobLevel()

    // when
    await testRunner.invokeAction(RequestType.Level)

    // then
    expect(playerBuilder.getMobLevel()).toBe(level + 1)
  })

  it("resets experienceToLevel", async () => {
    // given
    playerBuilder.setExperienceToLevel(0)

    // when
    await testRunner.invokeAction(RequestType.Level)

    // then
    expect(playerBuilder.getExperienceToLevel()).toBe(playerBuilder.getMob().playerMob.experiencePerLevel)
    expect(playerBuilder.getExperienceToLevel()).toBeGreaterThan(0)
  })
})
