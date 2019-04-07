import {CheckStatus} from "../../../check/checkStatus"
import {CheckMessages} from "../../../check/constants"
import GameService from "../../../gameService/gameService"
import {Standing} from "../../../mob/enum/standing"
import {AuthorizationLevel} from "../../../player/authorizationLevel"
import {allAuthorizationLevels} from "../../../player/constants"
import {Player} from "../../../player/model/player"
import RequestBuilder from "../../../request/requestBuilder"
import {RequestType} from "../../../request/requestType"
import {getTestMob} from "../../../support/test/mob"
import TestBuilder from "../../../support/test/testBuilder"
import Action from "../../action"
import {MESSAGE_FAIL_BANNED} from "../../constants"

const MOB_TO_PROMOTE = "bob"
const MOB_SELF = "alice"
let requestBuilder: RequestBuilder
let service: GameService
let player: Player
let playerToPromote: Player

let action: Action

beforeEach(async () => {
  const testBuilder = new TestBuilder()
  const adminPlayerBuilder = await testBuilder.withPlayer()
  adminPlayerBuilder.setAuthorizationLevel(AuthorizationLevel.Immortal)
  player = adminPlayerBuilder.player
  player.sessionMob.name = MOB_SELF
  const playerBuilder = await testBuilder.withPlayer()
  playerToPromote = playerBuilder.player
  playerToPromote.sessionMob.name = MOB_TO_PROMOTE
  requestBuilder = await testBuilder.createRequestBuilder()
  service = await testBuilder.getService()
  action = await testBuilder.getAction(RequestType.Promote)
})

describe("promote moderation action", () => {
  it("promotes to admin sanity check", async () => {
    // when
    const response = await action.handle(requestBuilder.create(RequestType.Promote, `promote ${MOB_TO_PROMOTE}`))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("You promoted bob to admin.")
  })

  it("promotes to judge sanity check", async () => {
    // given
    playerToPromote.sessionMob.playerMob.authorizationLevel = AuthorizationLevel.Admin

    // when
    const response = await action.handle(requestBuilder.create(RequestType.Promote, `promote ${MOB_TO_PROMOTE}`))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("You promoted bob to judge.")
  })

  it("promotes to immortal sanity check", async () => {
    // given
    playerToPromote.sessionMob.playerMob.authorizationLevel = AuthorizationLevel.Judge

    // when
    const response = await action.handle(requestBuilder.create(RequestType.Promote, `promote ${MOB_TO_PROMOTE}`))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("You promoted bob to immortal.")
  })

  it("cannot promote past immortal sanity check", async () => {
    // given
    playerToPromote.sessionMob.playerMob.authorizationLevel = AuthorizationLevel.Immortal

    // when
    const response = await action.handle(requestBuilder.create(RequestType.Promote, `promote ${MOB_TO_PROMOTE}`))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("bob has no more promotions.")
  })

  it("should not be able to promote if not an immortal", async () => {
    return await Promise.all(
      allAuthorizationLevels.filter((auth) => auth !== AuthorizationLevel.Immortal)
        .map(async (authorizationLevel) => {
      player.sessionMob.playerMob.authorizationLevel = authorizationLevel
      const check = await action.check(
        requestBuilder.create(RequestType.Promote, `promote ${playerToPromote.sessionMob.name}`))
      expect(check.status).toBe(CheckStatus.Failed)
      expect(check.result).toBe(CheckMessages.NotAuthorized)
    }))
  })

  it("should be able to promote a player's mob", async () => {
    // when
    const check = await action.check(
      requestBuilder.create(RequestType.Promote, `promote ${playerToPromote.sessionMob.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(playerToPromote.sessionMob)
  })

  it("should not promote if already immortal", async () => {
    // given
    playerToPromote.sessionMob.playerMob.authorizationLevel = AuthorizationLevel.Immortal

    // when
    const check = await action.check(
      requestBuilder.create(RequestType.Promote, `promote ${playerToPromote.sessionMob.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe("bob has no more promotions.")
  })

  it("should not be able to promote banned mobs", async () => {
    playerToPromote.sessionMob.playerMob.standing = Standing.PermaBan

    // when
    const check = await action.check(
      requestBuilder.create(RequestType.Promote, `promote ${playerToPromote.sessionMob.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_BANNED)
  })

  it("cannot promote non-player mobs", async () => {
    const MOB_NAME = "baz"
    const mob = getTestMob(MOB_NAME)
    service.mobService.mobTable.add(mob)

    const check = await action.check(requestBuilder.create(RequestType.Promote, `promote ${mob.name}`))

    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(CheckMessages.NotAPlayer)
  })
})
