import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import {Direction} from "../../../room/constants"
import {newDoor} from "../../../room/factory"
import {Room} from "../../../room/model/room"
import TestBuilder from "../../../test/testBuilder"
import {ConditionMessages} from "../../constants"

let testBuilder: TestBuilder
let source: Room
let mob: Mob
const unlockCanonicalId = 123
const unlockCommand = "unlock door"

beforeEach(async () => {
  testBuilder = new TestBuilder()
  source = testBuilder.withRoom().room
  testBuilder.withRoom(Direction.East)
  const playerBuilder = await testBuilder.withPlayer()
  const key = playerBuilder.withKey(unlockCanonicalId as any)
  mob = playerBuilder.player.sessionMob
  const service = await testBuilder.getService()
  service.itemService.add(key)
})

describe("unlock action", () => {
  it("should require arguments", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.Unlock, "unlock")

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Unlock)
  })

  it("should require a key to be able to unlock a locked door", async () => {
    // given
    const door = newDoor("door", true, true)
    source.exits[0].door = door

    // when
    const response = await testBuilder.handleAction(RequestType.Unlock, unlockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Unlock.Fail.NoKey)
    expect(door.isLocked).toBeTruthy()
  })

  it("should be able to unlock a locked door", async () => {
    // given
    const door = newDoor("door", true, true)
    door.unlockedByCanonicalId = unlockCanonicalId
    source.exits[0].door = door

    // when
    const response = await testBuilder.handleAction(RequestType.Unlock, unlockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.getMessageToRequestCreator()).toBe("you unlock a door east.")
    expect(response.message.getMessageToObservers()).toBe(mob.name + " unlocks a door east.")
    expect(door.isClosed).toBeTruthy()
    expect(door.isLocked).toBeFalsy()
  })

  it("should not be able to unlock an already unlocked door", async () => {
    // given
    const door = newDoor("door", true, false)
    door.unlockedByCanonicalId = unlockCanonicalId
    source.exits[0].door = door

    // when
    const response = await testBuilder.handleAction(RequestType.Unlock, unlockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Unlock.Fail.AlreadyUnlocked)
    expect(door.isClosed).toBeTruthy()
  })
})
