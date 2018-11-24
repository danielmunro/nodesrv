import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"
import { Messages } from "./constants"
import disarm from "./disarm"

describe("disarm preconditions", () => {
  it("should not work if not in a fight", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 20)
    playerBuilder.withSkill(SkillType.Disarm)
    const request = testBuilder.createRequest(RequestType.Disarm)

    // when
    const check = await disarm(request, await testBuilder.getService())

    // then
    expect(check.isOk()).toBeFalsy()
    expect(check.result).toBe(Messages.All.NoTarget)
  })

  it("should not work if the target is not armed", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 20)
    playerBuilder.withSkill(SkillType.Disarm)
    await testBuilder.fight()
    const request = testBuilder.createRequest(RequestType.Disarm)

    // when
    const check = await disarm(request, await testBuilder.getService())

    // then
    expect(check.isOk()).toBeFalsy()
    expect(check.result).toBe(Messages.Disarm.FailNothingToDisarm)
  })

  it("should not work if the mob is too tired", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 20)
    const targetBuilder = testBuilder.withMob()
    targetBuilder.equip().withAxeEq()
    const target = targetBuilder.mob
    const mob = playerBuilder.player.sessionMob
    playerBuilder.withSkill(SkillType.Disarm)
    await testBuilder.fight(target)
    const request = testBuilder.createRequest(RequestType.Disarm)

    // given
    mob.vitals.mv = 0

    // when
    const response = await disarm(request, await testBuilder.getService())

    // then
    expect(response.isOk()).toBeFalsy()
    expect(response.result).toBe(Messages.All.NotEnoughMv)
  })

  it("should succeed if all conditions are met", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 20)
    const targetBuilder = testBuilder.withMob()
    targetBuilder.equip().withAxeEq()
    const target = targetBuilder.mob
    playerBuilder.withSkill(SkillType.Disarm)
    await testBuilder.fight(target)

    // when
    const response = await disarm(testBuilder.createRequest(RequestType.Disarm), await testBuilder.getService())

    // then
    expect(response.isOk()).toBeTruthy()
  })
})
