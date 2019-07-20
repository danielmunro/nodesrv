import {AffectType} from "../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../app/factory/testFactory"
import {Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {MESSAGE_FAIL_ALREADY_AWAKE, Messages} from "../../constants"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("wake action", () => {
  it("should change the mob's disposition to standing", async () => {
    // given
    const mobBuilder = (await testRunner.createMob()).withDisposition(Disposition.Sleeping)

    // when
    const response = await testRunner.invokeAction(RequestType.Wake)

    // then
    expect(response.getMessageToRequestCreator()).toBe("you wake and stand up.")
    expect(response.getMessageToTarget()).toBe("you wake and stand up.")
    expect(response.getMessageToObservers()).toBe(`${mobBuilder.getMobName()} wakes and stands up.`)
    expect(mobBuilder.mob.disposition).toBe(Disposition.Standing)
  })

  it("should not be able to wake if already standing", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Wake)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_ALREADY_AWAKE)
  })

  it("should not be able to wake if affected by sleep", async () => {
    // given
    const mobBuilder = (await testRunner.createMob()).withDisposition(Disposition.Sleeping)
    mobBuilder.addAffectType(AffectType.Sleep)

    // when
    const response = await testRunner.invokeAction(RequestType.Wake)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(Messages.Wake.CannotWakeUp)
  })

  it("provides accurate help text", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Help, "help wake")

    // then
    expect(response.getMessageToRequestCreator()).toBe(`Help:
command: wake
syntax: wake
These commands change your position.  When you SIT or SLEEP, you
regenerate hit points, mana points, and movement points faster.
However, you are more vulnerable to attack, and if you SLEEP,
you won't hear many things happen.

Use WAKE to come back to a standing position.  You can
also WAKE other sleeping characters.`)
  })
})
