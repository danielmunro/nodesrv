import { AuthorizationLevel } from "../../../player/authorizationLevel"
import { Player } from "../../../player/model/player"
import { Request } from "../../../request/request"
import RequestBuilder from "../../../request/requestBuilder"
import { RequestType } from "../../../request/requestType"
import Service from "../../../room/service"
import { getTestMob } from "../../../test/mob"
import { getTestPlayer } from "../../../test/player"
import TestBuilder from "../../../test/testBuilder"
import CheckedRequest from "../../check/checkedRequest"
import { CheckStatus } from "../../check/checkStatus"
import { default as banAction } from "../actions/ban"
import ban from "./ban"
import {
  MESSAGE_FAIL_ALREADY_BANNED, MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS,
  MESSAGE_FAIL_CANNOT_BAN_SELF,
  MESSAGE_FAIL_NO_TARGET, MESSAGE_FAIL_NOT_AUTHORIZED,
  MESSAGE_FAIL_NOT_PLAYER,
} from "./constants"

const MOB_TO_BAN = "bob"
const MOB_SELF = "alice"
const NOT_EXISTING_MOB = "foo"
let requestBuilder: RequestBuilder
let service: Service
let playerToBan: Player

describe("ban moderation precondition", () => {
  beforeEach(async () => {
    const testBuilder = new TestBuilder()
    const adminPlayerBuilder = await testBuilder.withAdminPlayer()
    const player = adminPlayerBuilder.player
    player.sessionMob.name = MOB_SELF
    const playerBuilder = await testBuilder.withPlayer()
    playerToBan = playerBuilder.player
    playerToBan.sessionMob.name = MOB_TO_BAN
    service = await testBuilder.getService()
    service.mobTable.add(player.sessionMob)
    service.mobTable.add(playerToBan.sessionMob)
    requestBuilder = new RequestBuilder(player, service.mobTable)
  })

  it("should not work on non-existent mobs", async () => {
    // when
    const response = await ban(requestBuilder.create(RequestType.Ban, `ban ${NOT_EXISTING_MOB}`), service)

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(MESSAGE_FAIL_NO_TARGET)
  })

  it("cannot ban self", async () => {
    // when
    const response = await ban(requestBuilder.create(RequestType.Ban, `ban ${MOB_SELF}`), service)

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(MESSAGE_FAIL_CANNOT_BAN_SELF)
  })

  it("should not apply a ban if the requester is not an admin", async () => {
    // when
    const response = await ban(new Request(getTestPlayer(), RequestType.Ban, `ban ${MOB_TO_BAN}`), service)

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(MESSAGE_FAIL_NOT_AUTHORIZED)
  })

  it("should apply a ban (sanity)", async () => {
    // when
    const response = await ban(requestBuilder.create(RequestType.Ban, `ban ${MOB_TO_BAN}`), service)

    // then
    expect(response.status).toBe(CheckStatus.Ok)
  })

  it("should not be able to ban an admin mob", async () => {
    // setup
    playerToBan.sessionMob.playerMob.authorizationLevel = AuthorizationLevel.Admin

    // when
    const response = await ban(requestBuilder.create(RequestType.Ban, `ban ${MOB_TO_BAN}`), service)

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS)
  })

  it("should not be able to ban a mob who's already banned", async () => {
    // setup
    const request = requestBuilder.create(RequestType.Ban, `ban ${MOB_TO_BAN}`)
    const check = await ban(request, service)
    await banAction(new CheckedRequest(request, check))

    // when
    const response = await ban(requestBuilder.create(RequestType.Ban, `ban ${MOB_TO_BAN}`), service)

    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(MESSAGE_FAIL_ALREADY_BANNED)
  })

  it("should not be able to ban mobs who are not players", async () => {
    // given
    const MOB_NAME = "fubar"
    const nonPlayerMob = getTestMob(MOB_NAME)
    service.mobTable.add(nonPlayerMob)
    // when
    const response = await ban(requestBuilder.create(RequestType.Ban, `ban ${MOB_NAME}`), service)

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(MESSAGE_FAIL_NOT_PLAYER)
  })
})
