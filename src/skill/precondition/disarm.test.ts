import {RequestType} from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import {SkillType} from "../skillType"
import {Messages} from "./constants"
import SkillDefinition from "../skillDefinition"
import PlayerBuilder from "../../test/playerBuilder"

let testBuilder: TestBuilder
let skillDefinition: SkillDefinition
let playerBuilder: PlayerBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 20)
  playerBuilder.withSkill(SkillType.Disarm)
  skillDefinition = await testBuilder.getSkillDefinition(SkillType.Disarm)
})

describe("disarm preconditions", () => {
  it("should not work if not in a fight", async () => {
    // when
    const result = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Disarm))

    // then
    expect(result.isError()).toBeTruthy()
    expect(result.message.getMessageToRequestCreator()).toBe(Messages.All.NoTarget)
  })

  it("should not work if the target is not armed", async () => {
    // setup
    await testBuilder.fight()

    // when
    const result = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Disarm))

    // then
    expect(result.isError()).toBeTruthy()
    expect(result.message.getMessageToRequestCreator()).toBe(Messages.Disarm.FailNothingToDisarm)
  })

  it("should not work if the mob is too tired", async () => {
    // setup
    const targetBuilder = testBuilder.withMob()
    targetBuilder.equip().withAxeEq()
    await testBuilder.fight(targetBuilder.mob)

    // given
    playerBuilder.player.sessionMob.vitals.mv = 0

    // when
    const response = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Disarm))

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.NotEnoughMv)
  })

  it("should succeed if all conditions are met", async () => {
    // setup
    const targetBuilder = testBuilder.withMob()
    targetBuilder.equip().withAxeEq()
    await testBuilder.fight(targetBuilder.mob)

    // when
    const response = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Disarm))

    // then
    expect(response.isError()).toBeFalsy()
  })
})
