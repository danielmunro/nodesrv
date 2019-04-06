import {CheckMessages} from "../../../check/constants"
import {PlayerMob} from "../../../mob/model/playerMob"
import {RequestType} from "../../../request/requestType"
import PlayerBuilder from "../../../test/playerBuilder"
import TestBuilder from "../../../test/testBuilder"
import {Messages} from "../../constants"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let playerMob: PlayerMob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer()
  playerMob = playerBuilder.getMob().playerMob
})

describe("level action", () => {
  it("does not work if experienceToLevel has greater than 0", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.Level)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NotEnoughExperience)
  })

  it("works if experienceToLevel has less than or equal to 0", async () => {
    // given
    playerMob.experienceToLevel = 0

    // when
    const response = await testBuilder.handleAction(RequestType.Level)

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(Messages.Level.Success)
  })

  it("increases a mob's level by 1", async () => {
    // given
    playerMob.experienceToLevel = 0
    const level = playerBuilder.getMob().level

    // when
    await testBuilder.handleAction(RequestType.Level)

    // then
    expect(playerBuilder.getMob().level).toBe(level + 1)
  })

  it("resets experienceToLevel", async () => {
    // given
    playerMob.experienceToLevel = 0

    // when
    await testBuilder.handleAction(RequestType.Level)

    // then
    expect(playerMob.experienceToLevel).toBe(playerMob.experiencePerLevel)
    expect(playerMob.experienceToLevel).toBeGreaterThan(0)
  })
})
