import { addFight, Fight, getFights, reset } from "../../mob/fight/fight"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { newReciprocalExit } from "../../room/factory"
import Service from "../../room/service"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import Check from "../check"
import CheckedRequest from "../checkedRequest"
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

describe("flee action handler", () => {
  it("flee should stop a fight", async () => {
    // verify
    expect(getFights().filter((f) => f.isInProgress()).length).toBe(1)

    // when
    await flee(
      new CheckedRequest(
        new Request(player, RequestType.Flee, "flee"),
        await Check.ok(fight)))

    // then
    expect(getFights().filter((f) => f.isInProgress()).length).toBe(0)
  })

  it("flee should cause the fleeing mob to change rooms", async () => {
    // when
    await flee(
      new CheckedRequest(
        new Request(player, RequestType.Flee, "flee"),
        await Check.ok(fight)))

    // then
    expect(mob.room.id).toBe(room1.id)
    expect(player.sessionMob.room.id).toBe(room2.id)
  })
})
