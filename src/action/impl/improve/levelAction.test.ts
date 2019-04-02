import {CheckMessages} from "../../../check/constants"
import {RequestType} from "../../../request/requestType"
import PlayerBuilder from "../../../test/playerBuilder"
import TestBuilder from "../../../test/testBuilder"
import {Messages} from "../../constants"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer()
})

describe("level action", () => {
  it("does not work if experienceToLevel is greater than 0", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.Level)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NotEnoughExperience)
  })

  it("works if experienceToLevel is less than or equal to 0", async () => {
    // given
    playerBuilder.getMob().playerMob.experienceToLevel = 0

    // when
    const response = await testBuilder.handleAction(RequestType.Level)

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(Messages.Level.Success)
  })

  it("increases a mob's level by 1", async () => {
    // given
    playerBuilder.getMob().playerMob.experienceToLevel = 0
    const level = playerBuilder.getMob().level

    // when
    await testBuilder.handleAction(RequestType.Level)

    // then
    expect(playerBuilder.getMob().level).toBe(level + 1)
  })
})
