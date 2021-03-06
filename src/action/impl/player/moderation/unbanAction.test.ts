import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {CheckMessages} from "../../../../check/constants"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {ResponseStatus} from "../../../../messageExchange/enum/responseStatus"
import {Standing} from "../../../../mob/enum/standing"
import {AuthorizationLevel} from "../../../../player/enum/authorizationLevel"
import PlayerBuilder from "../../../../support/test/playerBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {MESSAGE_FAIL_NOT_BANNED} from "../../../constants"

let testRunner: TestRunner
let banningPlayer: PlayerBuilder
let playerToUnban: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  banningPlayer = (await testRunner.createPlayer())
    .setAuthorizationLevel(AuthorizationLevel.Admin)
  playerToUnban = (await testRunner.createPlayer())
    .setStanding(Standing.IndefiniteBan)
})

describe("unban moderation action", () => {
  it("sanity check: mob must exist", async () => {
    // when
    const response = await testRunner.invokeAction(
      RequestType.Unban, "unban foo")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NoMob)
  })

  it("requires admin to unban", async () => {
    // given
    banningPlayer.setAuthorizationLevel(AuthorizationLevel.Mortal)

    // when
    const response = await testRunner.invokeAction(
      RequestType.Unban, `unban '${playerToUnban.getMobName()}'`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NotAuthorized)
  })

  it("sanity check: happy path", async () => {
    // when
    const response = await testRunner.invokeAction(
      RequestType.Unban, `unban '${playerToUnban.getMobName()}'`)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
  })

  it("requires the mob to be banned in the first place", async () => {
    // given
    playerToUnban.setStanding(Standing.Good)

    // when
    const response = await testRunner.invokeAction(
      RequestType.Unban, `unban '${playerToUnban.getMobName()}'`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_NOT_BANNED)
  })

  it("should not be able to ban mobs who are not players", async () => {
    // given
    const mobBuilder = await testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(
      RequestType.Unban, `unban '${mobBuilder.getMobName()}'`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NotAPlayer)
  })
})
