import {createTestAppContainer} from "../../../app/factory/testFactory"
import {Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("sit action", () => {
  it("should change the mob's disposition to sitting", async () => {
    // given
    const mobBuilder = testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(RequestType.Sit)

    // then
    expect(response.getMessageToRequestCreator()).toBe("you sit down.")
    expect(response.getMessageToTarget()).toBe("you sit down.")
    expect(response.getMessageToObservers()).toBe(`${mobBuilder.getMobName()} sits down.`)
    expect(mobBuilder.mob.disposition).toBe(Disposition.Sitting)
  })

  it("should not be able to sit if already sitting", async () => {
    // given
    testRunner.createMob().withDisposition(Disposition.Sitting)

    // when
    const response = await testRunner.invokeAction(RequestType.Sit)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Sit.AlreadySitting)
  })

  it("provides accurate help text", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Help, "help sit")

    // then
    expect(response.getMessageToRequestCreator()).toBe(`syntax: sit

These commands change your position.  When you SIT or SLEEP, you
regenerate hit points, mana points, and movement points faster.
However, you are more vulnerable to attack, and if you SLEEP,
you won't hear many things happen.

Use WAKE to come back to a standing position.  You can
also WAKE other sleeping characters.`)
  })
})
