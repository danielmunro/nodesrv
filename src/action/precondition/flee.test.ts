import { addFight, Fight, reset } from "../../mob/fight/fight"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { newReciprocalExit } from "../../room/factory"
import Service from "../../room/service"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import { CheckStatus } from "../check"
import { MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE, MESSAGE_FAIL_NOT_FIGHTING, MESSAGE_FAIL_TOO_TIRED } from "./constants"
import flee from "./flee"

let fight
let mob
let player
let room1
let room2

beforeEach(async () => {
  reset()
  player = getTestPlayer()
  mob = getTestMob()
  fight = new Fight(player.sessionMob, mob)
  room1 = getTestRoom()
  room2 = getTestRoom()
  const service = await Service.new()
  await service.saveRoom([room1, room2])
  await service.saveExit(newReciprocalExit(room1, room2))
  addFight(fight)
  room1.addMob(player.sessionMob)
  room1.addMob(mob)
})

describe("flee action precondition", () => {
  it("should not work if the mob is not fighting", async () => {
    // when
    const check = await flee(new Request(getTestPlayer(), RequestType.Flee, "flee"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NOT_FIGHTING)
  })

  it("should not work if no exits available", async () => {
    // given
    const room3 = getTestRoom()
    room3.addMob(player.sessionMob)
    room3.addMob(mob)

    // when
    const check = await flee(new Request(player, RequestType.Flee, "flee"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE)
  })

  it("should not work if a mob has no movement", async () => {
    // given
    player.sessionMob.vitals.mv = 0

    // when
    const check = await flee(new Request(player, RequestType.Flee, "flee"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_TOO_TIRED)
  })

  it("should work if all preconditions met", async () => {
    // when
    const check = await flee(new Request(player, RequestType.Flee, "flee"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(fight)
  })
})
