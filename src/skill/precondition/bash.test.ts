import { RequestType } from "../../request/requestType"
import PlayerBuilder from "../../test/playerBuilder"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"
import { Messages } from "./constants"
import SkillDefinition from "../skillDefinition"
import {Mob} from "../../mob/model/mob"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let skillDefinition: SkillDefinition
let target: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 10)
  playerBuilder.withSkill(SkillType.Bash)
  skillDefinition = await testBuilder.getSkillDefinition(SkillType.Bash)
  target = testBuilder.withMob("bob").mob
})

describe("bash skill preconditions", () => {
  it("should not allow bashing when too tired", async () => {
    // given
    playerBuilder.player.sessionMob.vitals.mv = 0

    // when
    const response = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Bash, "bash bob", target))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.NotEnoughMv)
  })

  it("should not allow bashing when not fighting", async () => {
    // when
    const response = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Bash))

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.NoTarget)
  })

  it("should pass the check if all preconditions pass", async () => {
    // given
    await testBuilder.fight()

    // when
    const response = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Bash))

    // then
    expect(response.isError()).toBeFalsy()
  })
})
