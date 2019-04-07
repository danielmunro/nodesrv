import {RequestType} from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import {Direction} from "../../../room/constants"
import {newDoor} from "../../../room/factory"
import PlayerBuilder from "../../../support/test/playerBuilder"
import RoomBuilder from "../../../support/test/roomBuilder"
import TestBuilder from "../../../support/test/testBuilder"
import {ConditionMessages} from "../../constants"

let testBuilder: TestBuilder
let player: PlayerBuilder
let source: RoomBuilder
const unlockCanonicalId = 123
const unlockCommand = "unlock door"

beforeEach(async () => {
  testBuilder = new TestBuilder()
  source = testBuilder.withRoom()
  testBuilder.withRoom(Direction.East)
  player = await testBuilder.withPlayer()
  const key = player.withKey(unlockCanonicalId as any)
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
    source.addDoor(door, Direction.East)

    // when
    const response = await testBuilder.handleAction(RequestType.Unlock, unlockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Unlock.Fail.NoKey)
    expect(door.isLocked).toBeTruthy()
  })

  it("should be able to unlock a locked door", async () => {
    // given
    const door = newDoor("door", true, true, unlockCanonicalId)
    source.addDoor(door, Direction.East)

    // when
    const response = await testBuilder.handleAction(RequestType.Unlock, unlockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.getMessageToRequestCreator()).toBe("you unlock a door east.")
    expect(response.message.getMessageToObservers()).toBe(`${player.getMob().name} unlocks a door east.`)
    expect(door.isClosed).toBeTruthy()
    expect(door.isLocked).toBeFalsy()
  })

  it("should not be able to unlock an already unlocked door", async () => {
    // given
    const door = newDoor("door", true, false, unlockCanonicalId)
    source.addDoor(door, Direction.East)

    // when
    const response = await testBuilder.handleAction(RequestType.Unlock, unlockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Unlock.Fail.AlreadyUnlocked)
    expect(door.isClosed).toBeTruthy()
  })
})
