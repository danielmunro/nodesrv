import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"
import bash from "./bash"
import { Messages } from "./constants"

describe("bash skill precondition", () => {
  it("should not allow bashing when too tired", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const player = await testBuilder.withPlayer(p => p.sessionMob.vitals.mv = 0)
    player.withSkill(SkillType.Bash)

    // and
    testBuilder.fight()

    // when
    const check = await bash(testBuilder.createRequest(RequestType.Bash))

    // then
    expect(check.isOk()).toBeFalsy()
    expect(check.result).toBe(Messages.All.NotEnoughMv)
  })

  it("should not allow bashing when not fighting", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const player = await testBuilder.withPlayer()
    player.withSkill(SkillType.Bash)

    // when
    const check = await bash(testBuilder.createRequest(RequestType.Bash))

    // then
    expect(check.isOk()).toBeFalsy()
    expect(check.result).toBe(Messages.All.NoTarget)
  })

  it("should pass the check if all preconditions pass", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const player = await testBuilder.withPlayer()
    player.withSkill(SkillType.Bash)

    // and
    testBuilder.fight()

    // when
    const check = await bash(testBuilder.createRequest(RequestType.Bash))

    // then
    expect(check.isOk()).toBeTruthy()
  })
})
