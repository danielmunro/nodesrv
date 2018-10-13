import { RequestType } from "../../request/requestType"
import PlayerBuilder from "../../test/playerBuilder"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"
import bash from "./bash"
import { Messages } from "./constants"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 10)
  playerBuilder.withSkill(SkillType.Bash)
})

describe("bash skill precondition", () => {
  it("should not allow bashing when too tired", async () => {
    // given
    playerBuilder.player.sessionMob.vitals.mv = 0

    // and
    testBuilder.fight()

    // when
    const check = await bash(testBuilder.createRequest(RequestType.Bash))

    // then
    expect(check.isOk()).toBeFalsy()
    expect(check.result).toBe(Messages.All.NotEnoughMv)
  })

  it("should not allow bashing when not fighting", async () => {
    // when
    const check = await bash(testBuilder.createRequest(RequestType.Bash))

    // then
    expect(check.isOk()).toBeFalsy()
    expect(check.result).toBe(Messages.All.NoTarget)
  })

  it("should pass the check if all preconditions pass", async () => {
    // given
    testBuilder.fight()

    // when
    const check = await bash(testBuilder.createRequest(RequestType.Bash))

    // then
    expect(check.isOk()).toBeTruthy()
  })
})
