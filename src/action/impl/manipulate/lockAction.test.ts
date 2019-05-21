import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import {newDoor} from "../../../room/factory"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner
let mobBuilder: MobBuilder
const lockCanonicalId = 123
const lockCommand = "lock door"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createRoom()
  mobBuilder = testRunner.createMob()
})

describe("lock action", () => {
  it("should require arguments", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Lock, "lock")

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Lock)
  })

  it("should require a key to be able to lock a locked door", async () => {
    // given
    const door = newDoor("door", true, false)
    testRunner.getStartRoom().addDoor(door)

    // when
    const response = await testRunner.invokeAction(RequestType.Lock, lockCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Lock.Fail.NoKey)
    expect(door.isLocked).toBeFalsy()
  })

  it("should be able to lock an unlocked door", async () => {
    // given
    const door = newDoor("door", true, false)
    door.unlockedByCanonicalId = lockCanonicalId
    testRunner.getStartRoom().addDoor(door)
    mobBuilder.addItem(testRunner.createItem().asKey(lockCanonicalId as any).build())

    // when
    const response = await testRunner.invokeAction(RequestType.Lock, lockCommand)

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toContain("you lock a door")
    expect(response.message.getMessageToObservers()).toContain(`${mobBuilder.getMobName()} locks a door`)
    expect(door.isClosed).toBeTruthy()
    expect(door.isLocked).toBeTruthy()
  })

  it("should not be able to lock an already locked door", async () => {
    // given
    const door = newDoor("door", true, true)
    door.unlockedByCanonicalId = lockCanonicalId
    testRunner.getStartRoom().addDoor(door)

    // when
    const response = await testRunner.invokeAction(RequestType.Lock, lockCommand)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Lock.Fail.AlreadyLocked)
  })
})
