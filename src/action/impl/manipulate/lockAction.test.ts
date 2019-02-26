import {RequestType} from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import {Direction} from "../../../room/constants"
import {newDoor} from "../../../room/factory"
import PlayerBuilder from "../../../test/playerBuilder"
import RoomBuilder from "../../../test/roomBuilder"
import TestBuilder from "../../../test/testBuilder"
import {ConditionMessages} from "../../constants"

let testBuilder: TestBuilder
let player: PlayerBuilder
let source: RoomBuilder
const lockCanonicalId = 123
const lockCommand = "lock door"

beforeEach(async () => {
  testBuilder = new TestBuilder()
  source = testBuilder.withRoom()
  testBuilder.withRoom(Direction.East)
  player = await testBuilder.withPlayer()
  const key = player.withKey(lockCanonicalId as any)
  const service = await testBuilder.getService()
  service.itemService.add(key)
})

describe("lock action", () => {
  it("should require arguments", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.Lock, "lock")

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Lock)
  })

  it("should require a key to be able to lock a locked door", async () => {
    // given
    const door = newDoor("door", true, false)
    source.addDoor(door, Direction.East)

    // when
    const response = await testBuilder.handleAction(RequestType.Lock, lockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Lock.Fail.NoKey)
    expect(door.isLocked).toBeFalsy()
  })

  it("should be able to lock an unlocked door", async () => {
    // given
    const door = newDoor("door", true, false)
    door.unlockedByCanonicalId = lockCanonicalId
    source.addDoor(door, Direction.East)

    // when
    const response = await testBuilder.handleAction(RequestType.Lock, lockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.getMessageToRequestCreator()).toBe("you lock a door east.")
    expect(response.message.getMessageToObservers()).toBe(`${player.getMob().name} locks a door east.`)
    expect(door.isClosed).toBeTruthy()
    expect(door.isLocked).toBeTruthy()
  })

  it("should not be able to lock an already locked door", async () => {
    // given
    const door = newDoor("door", true, true)
    door.unlockedByCanonicalId = lockCanonicalId
    source.addDoor(door, Direction.East)

    // when
    const response = await testBuilder.handleAction(RequestType.Lock, lockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Lock.Fail.AlreadyLocked)
  })
})
