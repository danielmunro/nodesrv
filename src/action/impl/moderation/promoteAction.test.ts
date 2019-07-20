import {createTestAppContainer} from "../../../app/factory/testFactory"
import {CheckMessages} from "../../../check/constants"
import {Standing} from "../../../mob/enum/standing"
import {allAuthorizationLevels} from "../../../player/constants"
import {AuthorizationLevel} from "../../../player/enum/authorizationLevel"
import {RequestType} from "../../../request/enum/requestType"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {MESSAGE_FAIL_BANNED} from "../../constants"

let testRunner: TestRunner
let promotingPlayer: PlayerBuilder
let playerToPromote: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  promotingPlayer = (await testRunner.createPlayer())
    .setAuthorizationLevel(AuthorizationLevel.Immortal)
  playerToPromote = await testRunner.createPlayer()
})

describe("promote moderation action", () => {
  it("promotes to admin sanity check", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Promote, `promote '${playerToPromote.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You promoted ${playerToPromote.getMobName()} to admin.`)
  })

  it("promotes to judge sanity check", async () => {
    // given
    playerToPromote.setAuthorizationLevel(AuthorizationLevel.Admin)

    // when
    const response = await testRunner.invokeAction(RequestType.Promote, `promote '${playerToPromote.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You promoted ${playerToPromote.getMobName()} to judge.`)
  })

  it("promotes to immortal sanity check", async () => {
    // given
    playerToPromote.setAuthorizationLevel(AuthorizationLevel.Judge)

    // when
    const response = await testRunner.invokeAction(RequestType.Promote, `promote '${playerToPromote.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You promoted ${playerToPromote.getMobName()} to immortal.`)
  })

  it("cannot promote past immortal sanity check", async () => {
    // given
    playerToPromote.setAuthorizationLevel(AuthorizationLevel.Immortal)

    // when
    const response = await testRunner.invokeAction(RequestType.Promote, `promote '${playerToPromote.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${playerToPromote.getMobName()} has no more promotions.`)
  })

  it("cannot promote if not an immortal", async () => {
    return await Promise.all(
      allAuthorizationLevels.filter((auth) => auth !== AuthorizationLevel.Immortal)
        .map(async (authorizationLevel) => {
          // given
          promotingPlayer.setAuthorizationLevel(authorizationLevel)

          // when
          const response = await testRunner.invokeAction(
            RequestType.Promote, `promote '${playerToPromote.getMobName()}'`)

          // then
          expect(response.isError()).toBeTruthy()
          expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NotAuthorized)
    }))
  })

  it("cannot promote banned mobs", async () => {
    // given
    playerToPromote.getMob().playerMob.standing = Standing.PermaBan

    // when
    const response = await testRunner.invokeAction(
      RequestType.Promote, `promote '${playerToPromote.getMobName()}'`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_BANNED)
  })

  it("cannot promote non-player mobs", async () => {
    // given
    const mobBuilder = await testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(
      RequestType.Promote, `promote '${mobBuilder.getMobName()}'`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(CheckMessages.NotAPlayer)
  })
})
