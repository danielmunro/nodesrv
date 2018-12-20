import {Mob} from "../../mob/model/mob"
import {RequestType} from "../../request/requestType"
import {ResponseStatus} from "../../request/responseStatus"
import {Direction} from "../../room/constants"
import {newDoor} from "../../room/factory"
import {Room} from "../../room/model/room"
import TestBuilder from "../../test/testBuilder"
import getActionCollection from "../actionCollection"
import {Definition} from "../definition/definition"
import {Messages} from "../precondition/constants"

describe("unlock action", () => {

  let testBuilder: TestBuilder
  let definition: Definition
  let source: Room
  let mob: Mob
  const unlockCanonicalId = 123

  beforeEach(async () => {
    testBuilder = new TestBuilder()
    source = testBuilder.withRoom().room
    testBuilder.withRoom(Direction.East)
    const playerBuilder = await testBuilder.withPlayer()
    const key = playerBuilder.withKey(unlockCanonicalId)
    mob = playerBuilder.player.sessionMob
    const service = await testBuilder.getService()
    service.itemService.add(key)
    const actionCollection = getActionCollection(service)
    definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Unlock)
  })

  it("should require arguments", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Unlock, "unlock"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.Arguments.Unlock)
  })

  it("should be able to unlock a locked door", async () => {
    // given
    const door = newDoor("door", true, true)
    door.unlockedByCanonicalId = unlockCanonicalId
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Unlock, "unlock door"))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("you unlock a door east.")
    expect(response.message.getMessageToObservers()).toBe(mob.name + " unlocks a door east.")
    expect(door.isClosed).toBeTruthy()
    expect(door.isLocked).toBeFalsy()
  })

  it("should not be able to unlock an already unlocked door", async () => {
    // given
    const door = newDoor("door", true, false)
    source.exits[0].door = door

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Unlock, "unlock door"))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Unlock.Fail.AlreadyUnlocked)
    expect(door.isClosed).toBeTruthy()
  })
})
