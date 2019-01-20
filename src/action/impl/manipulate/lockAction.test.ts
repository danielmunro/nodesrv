import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import {Direction} from "../../../room/constants"
import {newDoor} from "../../../room/factory"
import {Room} from "../../../room/model/room"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {ConditionMessages} from "../../constants"

describe("lock action", () => {

  let testBuilder: TestBuilder
  let definition: Action
  let source: Room
  let mob: Mob
  const lockCanonicalId = 123
  const lockCommand = "lock door"

  beforeEach(async () => {
    testBuilder = new TestBuilder()
    source = testBuilder.withRoom().room
    testBuilder.withRoom(Direction.East)
    const playerBuilder = await testBuilder.withPlayer()
    const key = playerBuilder.withKey(lockCanonicalId)
    mob = playerBuilder.player.sessionMob
    const service = await testBuilder.getService()
    service.itemService.add(key)
    definition = await testBuilder.getActionDefinition(RequestType.Lock)
  })

  it("should require arguments", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Lock, "lock"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Lock)
  })

  it("should require a key to be able to lock a locked door", async () => {
    // given
    const door = newDoor("door", true, false)
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Lock, lockCommand))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Lock.Fail.NoKey)
    expect(door.isLocked).toBeFalsy()
  })

  it("should be able to lock an unlocked door", async () => {
    // given
    const door = newDoor("door", true, false)
    door.unlockedByCanonicalId = lockCanonicalId
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Lock, lockCommand))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("you lock a door east.")
    expect(response.message.getMessageToObservers()).toBe(mob.name + " locks a door east.")
    expect(door.isClosed).toBeTruthy()
    expect(door.isLocked).toBeTruthy()
  })

  it("should not be able to lock an already locked door", async () => {
    // given
    const door = newDoor("door", true, true)
    door.unlockedByCanonicalId = lockCanonicalId
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Lock, lockCommand))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Lock.Fail.AlreadyLocked)
  })
})
