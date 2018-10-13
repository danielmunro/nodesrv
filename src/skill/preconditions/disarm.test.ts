
import { addFight, Fight, reset } from "../../mob/fight/fight"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"
import { Messages } from "./constants"
import disarm from "./disarm"

describe("disarm preconditions", () => {
  beforeEach(() => reset())

  it("should not work if not in a fight", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 20)
    playerBuilder.withSkill(SkillType.Disarm)
    const mob = playerBuilder.player.sessionMob
    const request = new Request(mob, new InputContext(RequestType.Disarm))

    // when
    const check = await disarm(request)

    // then
    expect(check.isOk()).toBeFalsy()
    expect(check.result).toBe(Messages.All.NoTarget)
  })

  it("should not work if the target is not armed", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 20)
    playerBuilder.withSkill(SkillType.Disarm)
    const target = testBuilder.withMob().mob
    const mob = playerBuilder.player.sessionMob
    addFight(new Fight(mob, target, testBuilder.room))
    const request = new Request(mob, new InputContext(RequestType.Disarm))

    // when
    const check = await disarm(request)

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
    addFight(new Fight(mob, target, testBuilder.room))
    const request = new Request(mob, new InputContext(RequestType.Disarm))

    // given
    mob.vitals.mv = 0

    // when
    const response = await disarm(request)

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
    const mob = playerBuilder.player.sessionMob
    playerBuilder.withSkill(SkillType.Disarm)
    addFight(new Fight(mob, target, testBuilder.room))
    const request = new Request(mob, new InputContext(RequestType.Disarm))

    // when
    const response = await disarm(request)

    // then
    expect(response.isOk()).toBeTruthy()
  })
})
