import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {format} from "../../../support/string"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"

let testRunner: TestRunner
let mob1: MobBuilder
let mob2: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob1 = await testRunner.createMob()
  mob1.setLevel(15)
  mob2 = await testRunner.createMob()
})

describe("consider action", () => {
  it.each([
    [1, Messages.Consider.NakedAndWeaponless],
    [6, Messages.Consider.NoMatch],
    [11, Messages.Consider.EasyKill],
    [14, Messages.Consider.PerfectMatch],
    [17, Messages.Consider.FeelLucky],
    [20, Messages.Consider.LaughsMercilessly],
    [25, Messages.Consider.Death],
  ])("considers a mob correctly when the target is level %s", async (level: any, message: any) => {
    // given
    mob2.setLevel(level)

    // when
    const response = await testRunner.invokeAction(RequestType.Consider, `consider '${mob2.getMobName()}'`)

    // then
    const formatted = format(message, mob2.getMobName())
    expect(response.getMessageToRequestCreator()).toBe(formatted || message)
  })
})
