import {CheckMessages} from "../../../check/constants"
import {createTestAppContainer} from "../../../inversify.config"
import {Standing} from "../../../mob/enum/standing"
import {AuthorizationLevel} from "../../../player/authorizationLevel"
import {RequestType} from "../../../request/requestType"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {MESSAGE_FAIL_ALREADY_BANNED, MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS} from "../../constants"

let testRunner: TestRunner
let banningPlayer: PlayerBuilder
let playerToBan: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  banningPlayer = testRunner.createPlayer()
    .setAuthorizationLevel(AuthorizationLevel.Admin)
  playerToBan = testRunner.createPlayer()
})

describe("ban moderation action", () => {
  it("cannot work on non-existent mobs", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Ban, "ban foo")

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NoMob)
  })

  it("cannot apply a ban if the requester is not an admin", async () => {
    // given
    banningPlayer.setAuthorizationLevel(AuthorizationLevel.Mortal)

    // when
    const response = await testRunner.invokeAction(RequestType.Ban, `ban '${playerToBan.getMobName()}'`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NotAuthorized)
  })

  it("can apply a ban (sanity)", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Ban, `ban '${playerToBan.getMobName()}'`)

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })

  it("cannot ban an admin mob", async () => {
    // setup
    playerToBan.setAuthorizationLevel(AuthorizationLevel.Admin)

    // when
    const response = await testRunner.invokeAction(RequestType.Ban, `ban '${playerToBan.getMobName()}'`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS)
  })

  it("cannot ban a mob who's already banned", async () => {
    // given
    playerToBan.setStanding(Standing.IndefiniteBan)

    // when
    const response = await testRunner.invokeAction(RequestType.Ban, `ban '${playerToBan.getMobName()}'`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_ALREADY_BANNED)
  })

  it("should not be able to ban mobs who are not players", async () => {
    // given
    const mobBuilder = testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(RequestType.Ban, `ban '${mobBuilder.getMobName()}'`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NotAPlayer)
  })
})
