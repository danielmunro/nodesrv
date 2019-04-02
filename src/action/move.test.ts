import {AffectType} from "../affect/affectType"
import {newAffect} from "../affect/factory"
import {CheckStatus} from "../check/checkStatus"
import GameService from "../gameService/gameService"
import {Mob} from "../mob/model/mob"
import { RequestType } from "../request/requestType"
import { ResponseStatus } from "../request/responseStatus"
import { Direction } from "../room/constants"
import Door from "../room/model/door"
import {Room} from "../room/model/room"
import TestBuilder from "../test/testBuilder"
import Action from "./action"
import {ConditionMessages} from "./constants"
import {MESSAGE_DIRECTION_DOES_NOT_EXIST, MESSAGE_OUT_OF_MOVEMENT} from "./constants"

let testBuilder: TestBuilder
let service: GameService
let definition: Action
let mob: Mob
let source: Room
let destination: Room

beforeEach(async () => {
  testBuilder = new TestBuilder()
  source = testBuilder.withRoom().room
  destination = testBuilder.withRoom(Direction.East).room
  mob = (await testBuilder.withPlayer()).player.sessionMob
  service = await testBuilder.getService()
  definition = await testBuilder.getAction(RequestType.East)
})

describe("move", () => {
  it("should allow movement where rooms connect", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.East))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(service.getMobLocation(mob).room).toEqual(destination)
  })

  it("should not cost movement if flying", async () => {
    mob.addAffect(newAffect(AffectType.Fly))

    // when
    await definition.handle(testBuilder.createRequest(RequestType.East))

    const combined = mob.getCombinedAttributes()
    // then
    expect(mob.vitals.mv).toBe(combined.vitals.mv)
  })

  it("should not be able to move if immobilized", async () => {
    // given
    mob.affects.push(newAffect(AffectType.Immobilize))

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.East))

    // then
    expect(response.isError()).toBeTruthy()
    expect(service.getMobLocation(mob).room).toEqual(source)
  })

  it("should not allow movement when an exit has a closed door", async () => {
    // given
    const door = new Door()
    door.isClosed = true
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.East))

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Move.Fail.DoorIsClosed)
    expect(service.getMobLocation(mob).room).toEqual(source)
  })

  it("should not allow movement where an exit does not exist", async () => {
    // when
    await testBuilder.withPlayer()
    definition = await testBuilder.getAction(RequestType.North)
    const check = await definition.check(testBuilder.createRequest(RequestType.North))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  })

  it("should not allow movement when movement points are depleted", async () => {
    // given
    mob.vitals.mv = 0

    // when
    const check = await definition.check(testBuilder.createRequest(RequestType.East))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_OUT_OF_MOVEMENT)
  })

  it("should allow movement when preconditions pass", async () => {
    // given
    await testBuilder.withPlayer()

    // when
    const check = await definition.check(testBuilder.createRequest(RequestType.East))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })
})
