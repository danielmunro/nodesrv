import doNTimes from "../../support/functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import MobBuilder from "../../test/mobBuilder"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "../constants"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"

const iterations = 10
let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let skillDefinition: SkillDefinition

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob().withLevel(20)
  skillDefinition = await testBuilder.getSkillDefinition(SkillType.Envenom)
})

async function action(input: string, target: any) {
  return skillDefinition.doAction(testBuilder.createRequest(RequestType.Envenom, input, target))
}

describe("envenom skill action", () => {
  it("should fail at low levels", async () => {
    // given
    const axe = mobBuilder.withAxeEq()
    mobBuilder.withSkill(SkillType.Envenom)

    // when
    const responses = await doNTimes(iterations, () => action("envenom axe", axe))

    // then
    expect(responses.filter(response => response.isFailure())).toHaveLength(iterations)
  })

  it("should succeed sometimes with sufficient practice", async () => {
    // setup
    const axe = mobBuilder.withAxeEq()
    mobBuilder.withSkill(SkillType.Envenom, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, async () => {
      axe.affects = []
      return action("envenom axe", axe)
    })

    // then
    expect(responses.filter(response => response.isSuccessful()).length).toBe(1)
  })

  it("should not be able to envenom a non weapon", async () => {
    // setup
    mobBuilder.withSkill(SkillType.Envenom)

    // given
    const eq = mobBuilder.withHelmetEq()

    // when
    const response = await action("envenom cap", eq)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Envenom.Error.NotAWeapon)
  })

  it("should only be able to envenom bladed weapons", async () => {
    // setup
    mobBuilder.withSkill(SkillType.Envenom, MAX_PRACTICE_LEVEL)

    // given
    const weapon = mobBuilder.withMaceEq()

    // when
    const response = await action("envenom mace", weapon)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Envenom.Error.WrongWeaponType)
  })
})
