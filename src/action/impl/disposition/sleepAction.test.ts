import {createTestAppContainer} from "../../../app/testFactory"
import {Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages, Messages} from "../../constants"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("sleep action action", () => {
  it("should change the mob's disposition to sleeping", async () => {
    // given
    const mobBuilder = testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(RequestType.Sleep)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.getMessageToRequestCreator()).toBe(Messages.Sleep.Success)
    expect(mobBuilder.mob.disposition).toBe(Disposition.Sleeping)
  })

  it("should not be able to sleep if already sleeping", async () => {
    // given
    testRunner.createMob().withDisposition(Disposition.Sleeping)

    // when
    const response = await testRunner.invokeAction(RequestType.Sleep)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Sleep.AlreadySleeping)
  })

  it("provides accurate help text", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Help, "help sleep")

    // then
    expect(response.getMessageToRequestCreator()).toBe(`syntax: sleep

These commands change your position.  When you REST or SLEEP, you
regenerate hit points, mana points, and movement points faster.
However, you are more vulnerable to attack, and if you SLEEP,
you won't hear many things happen.

Use STAND or WAKE to come back to a standing position.  You can
also WAKE other sleeping characters.`)
  })
})
