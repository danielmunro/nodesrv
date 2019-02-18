import { CheckStatus } from "../../../check/checkStatus"
import {CheckMessages} from "../../../check/constants"
import GameService from "../../../gameService/gameService"
import {Standing} from "../../../mob/enum/standing"
import { Player } from "../../../player/model/player"
import InputContext from "../../../request/context/inputContext"
import { Request } from "../../../request/request"
import RequestBuilder from "../../../request/requestBuilder"
import { RequestType } from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import { getTestMob } from "../../../test/mob"
import { getTestRoom } from "../../../test/room"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {
  MESSAGE_FAIL_NOT_BANNED,
} from "../../constants"

const MOB_TO_UNBAN = "bob"
const MOB_SELF = "alice"
const NOT_EXISTING_MOB = "foo"
let requestBuilder: RequestBuilder
let service: GameService
let playerToUnban: Player
let action: Action

beforeEach(async () => {
  const testBuilder = new TestBuilder()
  const adminPlayerBuilder = await testBuilder.withAdminPlayer()
  const player = adminPlayerBuilder.player
  player.sessionMob.name = MOB_SELF
  const playerBuilder = await testBuilder.withPlayer()
  playerToUnban = playerBuilder.player
  playerToUnban.sessionMob.name = MOB_TO_UNBAN
  playerToUnban.sessionMob.playerMob.standing = Standing.IndefiniteBan
  service = await testBuilder.getService()
  service.mobService.mobTable.add(player.sessionMob)
  service.mobService.mobTable.add(playerToUnban.sessionMob)
  requestBuilder = await testBuilder.createRequestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Unban)
})

describe("unban moderation action", () => {
  it("should not work on non-existent mobs", async () => {
    // when
    const response = await action.check(requestBuilder.create(RequestType.Unban, `unban ${NOT_EXISTING_MOB}`))

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(CheckMessages.NoMob)
  })

  it("should not unban if the requester is not an admin", async () => {
    // when
    const response = await action.check(
      new Request(getTestMob(), getTestRoom(), new InputContext(RequestType.Unban, `unban ${MOB_TO_UNBAN}`)))

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(CheckMessages.NotAuthorized)
  })

  it("should unban if conditions met", async () => {
    // when
    const response = await action.handle(requestBuilder.create(RequestType.Unban, `unban ${MOB_TO_UNBAN}`))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
  })

  it("should not be able to unban a mob who's not banned", async () => {
    // setup
    playerToUnban.sessionMob.playerMob.standing = Standing.Good
    const request = requestBuilder.create(RequestType.Unban, `unban ${MOB_TO_UNBAN}`)
    await action.handle(request)

    // when
    const check = await action.check(request)

    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NOT_BANNED)
  })

  it("should not be able to ban mobs who are not players", async () => {
    // given
    const MOB_NAME = "fubar"
    const nonPlayerMob = getTestMob(MOB_NAME)
    service.mobService.mobTable.add(nonPlayerMob)
    // when
    const response = await action.check(requestBuilder.create(RequestType.Unban, `unban ${MOB_NAME}`))

    // then
    expect(response.status).toBe(CheckStatus.Failed)
    expect(response.result).toBe(CheckMessages.NotAPlayer)
  })
})
