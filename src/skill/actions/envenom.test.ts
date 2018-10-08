import CheckedRequest from "../../check/checkedRequest"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import Response from "../../request/response"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "../constants"
import envenomPrecondition from "../preconditions/envenom"
import { SkillType } from "../skillType"
import envenom from "./envenom"
import { getSkillActionDefinition } from "../skillCollection"

async function getTestBuilder() {
  const testBuilder = new TestBuilder()
  const playerBuilder = await testBuilder.withPlayer()
  playerBuilder.withSkill(SkillType.Envenom)
  testBuilder.addWeaponToPlayerInventory()

  return testBuilder
}

const definition = getSkillActionDefinition(SkillType.Envenom)

describe("envenom", () => {
  it("should fail at low levels", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    const axe = mobBuilder.withAxeEq()
    mobBuilder.withSkill(SkillType.Envenom)

    // when
    const responses = await doNTimes(10, async () =>
      envenom(await testBuilder.createCheckedRequestFrom(
        RequestType.Envenom,
        definition.preconditions,
        "envenom axe",
        axe)))

    // then
    expect(responses.filter(response => response.isFailure())).toHaveLength(10)
  })

  it("should succeed sometimes with sufficient practice", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    const axe = mobBuilder.withAxeEq()
    mobBuilder.withAxeEq()
    mobBuilder.withSkill(SkillType.Envenom, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(10, async () =>
      envenom(await testBuilder.createCheckedRequestFrom(
        RequestType.Envenom,
        definition.preconditions,
        "envenom axe",
        axe)))

    // then
    expect(responses.filter(response => response.isSuccessful()).length).toBeGreaterThan(5)
  })

  it("should not be able to envenom a non weapon", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder = await testBuilder.withMob()
    mobBuilder.withSkill(SkillType.Envenom)

    // given
    const eq = mobBuilder.withHelmetEq()
    const request = testBuilder.createRequest(RequestType.Envenom, "envenom cap", eq)

    // when
    const response = await definition.action(new CheckedRequest(request, await definition.preconditions(request)))

    // then
    expect(response.isFailure()).toBeTruthy()
    expect(response.message).toBe(Messages.Envenom.Error.NotAWeapon)
  })

  it("should only be able to envenom bladed weapons", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Envenom, MAX_PRACTICE_LEVEL)
    const weapon = playerBuilder.withMaceEq()
    const mob = playerBuilder.player.sessionMob

    // given
    const request = new Request(mob, new InputContext(RequestType.Envenom, "envenom mace"), weapon)

    // when
    const response = await envenom(new CheckedRequest(request, await envenomPrecondition(request)))

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.message).toBe(Messages.Envenom.Error.WrongWeaponType)
  })
})
