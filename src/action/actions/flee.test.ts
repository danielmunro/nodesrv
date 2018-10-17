import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import { addFight, Fight, getFights, reset } from "../../mob/fight/fight"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { newReciprocalExit } from "../../room/factory"
import Service from "../../service/service"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import flee from "./flee"
import doNTimes from "../../functional/times"

let fight
let mob
let player
let room1
let room2
let service

beforeEach(async () => {
  reset()
  player = getTestPlayer()
  mob = getTestMob()
  // room with a fight
  room1 = getTestRoom()
  // room to flee to
  room2 = getTestRoom()
  fight = new Fight(player.sessionMob, mob, room1)
  const allRooms = [room1, room2]
  service = await Service.newWithArray(allRooms)
  await service.saveRoom(allRooms)
  await service.saveExit(newReciprocalExit(room1, room2))
  addFight(fight)
  room1.addMob(player.sessionMob)
  room1.addMob(mob)
})

describe("flee action handler", () => {
  it("flee should stop a fight", async () => {
    // verify
    expect(getFights().filter(f => f.isInProgress()).length).toBe(1)

    // when
    await doNTimes(10, async () => flee(
      new CheckedRequest(
        new Request(mob, new InputContext(RequestType.Flee)),
        await Check.ok(fight)),
      service))

    // then
    expect(getFights().filter(f => f.isInProgress()).length).toBe(0)
  })

  it("flee should cause the fleeing mob to change rooms", async () => {
    // when
    await doNTimes(20, async () => flee(
      new CheckedRequest(
        new Request(mob, new InputContext(RequestType.Flee)),
        await Check.ok(fight)),
      service))

    // then
    expect(mob.room.id).toBe(room2.id)
  })

  it("flee should accurately build its response message", async () => {
    // setup
    mob.name = "bob"

    // when
    const responses = await doNTimes(10, async () => flee(
      new CheckedRequest(
        new Request(mob, new InputContext(RequestType.Flee)),
        await Check.ok(fight)),
      service))

    const response = responses.find(r => r.isSuccessful())

    // then
    expect(response.message.getMessageToRequestCreator()).toContain("you flee to the")
    expect(response.message.getMessageToTarget()).toContain("bob flees to the")
  })
})
