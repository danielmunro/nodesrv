import {createTestAppContainer} from "../../../app/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import {newDoor} from "../../../room/factory"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner
let mobBuilder: MobBuilder
const unlockCanonicalId = 123
const unlockCommand = "unlock door"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createRoom()
  mobBuilder = testRunner.createMob()
  const item = testRunner.createItem().asKey(unlockCanonicalId as any).build()
  mobBuilder.addItem(item)
})

describe("unlock action", () => {
  it("should require arguments", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Unlock, "unlock")

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Unlock)
  })

  it("should require a key to be able to unlock a locked door", async () => {
    // given
    const door = newDoor("door", true, true)
    testRunner.getStartRoom().addDoor(door)

    // when
    const response = await testRunner.invokeAction(RequestType.Unlock, unlockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Unlock.Fail.NoKey)
    expect(door.isLocked).toBeTruthy()
  })

  it("should be able to unlock a locked door", async () => {
    // given
    const door = newDoor("door", true, true, unlockCanonicalId)
    testRunner.getStartRoom().addDoor(door)

    // when
    const response = await testRunner.invokeAction(RequestType.Unlock, unlockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.getMessageToRequestCreator()).toContain("you unlock a door")
    expect(response.message.getMessageToObservers())
      .toContain(`${mobBuilder.getMobName()} unlocks a door`)
    expect(door.isClosed).toBeTruthy()
    expect(door.isLocked).toBeFalsy()
  })

  it("should not be able to unlock an already unlocked door", async () => {
    // given
    const door = newDoor("door", true, false, unlockCanonicalId)
    testRunner.getStartRoom().addDoor(door)

    // when
    const response = await testRunner.invokeAction(RequestType.Unlock, unlockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Unlock.Fail.AlreadyUnlocked)
    expect(door.isClosed).toBeTruthy()
  })
})
