import { CheckStatus } from "../../../check/checkStatus"
import {Messages} from "../../../check/constants"
import GameService from "../../../gameService/gameService"
import { AuthorizationLevel } from "../../../player/authorizationLevel"
import { Player } from "../../../player/model/player"
import InputContext from "../../../request/context/inputContext"
import { Request } from "../../../request/request"
import RequestBuilder from "../../../request/requestBuilder"
import { RequestType } from "../../../request/requestType"
import { getTestMob } from "../../../test/mob"
import { getTestRoom } from "../../../test/room"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {
  MESSAGE_FAIL_ALREADY_BANNED,
  MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS,
  MESSAGE_FAIL_NO_TARGET,
} from "../../constants"

const MOB_TO_BAN = "bob"
const MOB_SELF = "alice"
const NOT_EXISTING_MOB = "foo"
let requestBuilder: RequestBuilder
let service: GameService
let playerToBan: Player
let action: Action

describe("ban moderation preconditions", () => {
  beforeEach(async () => {
    const testBuilder = new TestBuilder()
    const adminPlayerBuilder = await testBuilder.withAdminPlayer()
    const player = adminPlayerBuilder.player
    player.sessionMob.name = MOB_SELF
    const playerBuilder = await testBuilder.withPlayer()
    playerToBan = playerBuilder.player
    playerToBan.sessionMob.name = MOB_TO_BAN
    service = await testBuilder.getService()
    service.mobService.mobTable.add(player.sessionMob)
    service.mobService.mobTable.add(playerToBan.sessionMob)
    requestBuilder = await testBuilder.createRequestBuilder()
    action = await testBuilder.getActionDefinition(RequestType.Ban)
  })

  it("should not work on non-existent mobs", async () => {
    // when
    const response = await action.check(requestBuilder.create(RequestType.Ban, `ban ${NOT_EXISTING_MOB}`))

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(MESSAGE_FAIL_NO_TARGET)
  })

  it("should not apply a ban if the requester is not an admin", async () => {
    // when
    const response = await action.check(
      new Request(getTestMob(), getTestRoom(), new InputContext(RequestType.Ban, `ban ${MOB_TO_BAN}`)))

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(Messages.NotAuthorized)
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
    service.mobService.mobTable.add(nonPlayerMob)
    // when
    const response = await action.check(requestBuilder.create(RequestType.Ban, `ban ${MOB_NAME}`))

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(Messages.NotAPlayer)
  })
})
