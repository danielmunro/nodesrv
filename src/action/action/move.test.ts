import GameService from "../../gameService/gameService"
import {Mob} from "../../mob/model/mob"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { Direction } from "../../room/constants"
import Door from "../../room/model/door"
import {Room} from "../../room/model/room"
import TestBuilder from "../../test/testBuilder"
import {Action} from "../action"
import {Messages} from "../precondition/constants"

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
  definition = await testBuilder.getActionDefinition(RequestType.East)
})

describe("move", () => {
  it("should allow movement where rooms connect", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.East))

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(service.getMobLocation(mob).room).toEqual(destination)
  })

  it("should not allow movement when an exit has a closed door", async () => {
    // given
    const door = new Door()
    door.isClosed = true
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.East))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Move.Fail.DoorIsClosed)
    expect(service.getMobLocation(mob).room).toEqual(source)
  })
})
