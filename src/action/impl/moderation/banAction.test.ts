import {CheckStatus} from "../../../check/checkStatus"
import {CheckMessages} from "../../../check/constants"
import MobService from "../../../mob/mobService"
import {AuthorizationLevel} from "../../../player/authorizationLevel"
import {Player} from "../../../player/model/player"
import InputContext from "../../../request/context/inputContext"
import {Request} from "../../../request/request"
import RequestBuilder from "../../../request/requestBuilder"
import {RequestType} from "../../../request/requestType"
import {getTestMob} from "../../../support/test/mob"
import {getTestRoom} from "../../../support/test/room"
import TestBuilder from "../../../support/test/testBuilder"
import Action from "../../action"
import {MESSAGE_FAIL_ALREADY_BANNED, MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS} from "../../constants"

const MOB_TO_BAN = "bob"
const MOB_SELF = "alice"
const NOT_EXISTING_MOB = "foo"
let requestBuilder: RequestBuilder
let playerToBan: Player
let action: Action
let mobService: MobService

beforeEach(async () => {
  const testBuilder = new TestBuilder()
  const adminPlayerBuilder = await testBuilder.withPlayer()
  adminPlayerBuilder.setAuthorizationLevel(AuthorizationLevel.Admin)
  adminPlayerBuilder.player.sessionMob.name = MOB_SELF
  const playerBuilder = await testBuilder.withPlayer()
  playerToBan = playerBuilder.player
  playerToBan.sessionMob.name = MOB_TO_BAN
  mobService = await testBuilder.getMobService()
  requestBuilder = await testBuilder.createRequestBuilder()
  action = await testBuilder.getAction(RequestType.Ban)
})

describe("ban moderation action", () => {
  it("should not work on non-existent mobs", async () => {
    // when
    const response = await action.check(requestBuilder.create(RequestType.Ban, `ban ${NOT_EXISTING_MOB}`))

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(CheckMessages.NoMob)
  })

  it("should not apply a ban if the requester has not an admin", async () => {
    // when
    const response = await action.check(
      new Request(getTestMob(), getTestRoom(), new InputContext(RequestType.Ban, `ban ${MOB_TO_BAN}`)))

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(CheckMessages.NotAuthorized)
  })

  it("should apply a ban (sanity)", async () => {
    // when
    const response = await action.check(requestBuilder.create(RequestType.Ban, `ban ${MOB_TO_BAN}`))

    // then
    expect(response.status).toBe(CheckStatus.Ok)
  })

  it("should not be able to ban an admin mob", async () => {
    // setup
    playerToBan.sessionMob.playerMob.authorizationLevel = AuthorizationLevel.Admin

    // when
    const response = await action.check(requestBuilder.create(RequestType.Ban, `ban ${MOB_TO_BAN}`))

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS)
  })

  it("should not be able to ban a mob who's already banned", async () => {
    // setup
    const request = requestBuilder.create(RequestType.Ban, `ban ${MOB_TO_BAN}`)
    await action.handle(request)

    // when
    const check = await action.check(request)

    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ALREADY_BANNED)
  })

  it("should not be able to ban mobs who are not players", async () => {
    // given
    const MOB_NAME = "fubar"
    const nonPlayerMob = getTestMob(MOB_NAME)
    mobService.mobTable.add(nonPlayerMob)
    // when
    const response = await action.check(requestBuilder.create(RequestType.Ban, `ban ${MOB_NAME}`))

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(CheckMessages.NotAPlayer)
  })
})
