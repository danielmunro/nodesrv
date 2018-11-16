import { CheckStatus } from "../../check/checkStatus"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import PlayerBuilder from "../../test/playerBuilder"
import { getTestRoom } from "../../test/room"
import RoomBuilder from "../../test/roomBuilder"
import TestBuilder from "../../test/testBuilder"
import { MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE, MESSAGE_FAIL_NOT_FIGHTING, MESSAGE_FAIL_TOO_TIRED } from "./constants"
import flee from "./flee"

let testBuilder: TestBuilder
let fight
let mob
let player: PlayerBuilder
let room1: RoomBuilder
let room2: RoomBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  player = await testBuilder.withPlayer()
  mob = testBuilder.withMob()
  room1 = testBuilder.withRoom()
  room2 = testBuilder.withRoom()
  fight = testBuilder.fight(mob)
})

describe("flee action preconditions", () => {
  it("should not work if the mob is not fighting", async () => {
    // when
    testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const check = await flee(testBuilder.createRequest(RequestType.Flee, "flee"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NOT_FIGHTING)
  })

  it("should not work if no exits available", async () => {
    // given
    const room3 = getTestRoom()
    room3.addMob(player.player.sessionMob)
    room3.addMob(mob)

    // when
    const check = await flee(new Request(player.player.sessionMob, room3, new InputContext(RequestType.Flee, "flee")))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE)
  })

  it("should not work if a mob has no movement", async () => {
    // given
    player.player.sessionMob.vitals.mv = 0

    // when
    const check = await flee(testBuilder.createRequest(RequestType.Flee, "flee"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_TOO_TIRED)
  })

  it("should work if all preconditions met", async () => {
    // when
    const check = await flee(testBuilder.createRequest(RequestType.Flee, "flee"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(fight)
  })
})
