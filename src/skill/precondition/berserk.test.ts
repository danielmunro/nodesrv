import {AffectType} from "../../affect/affectType"
import {newAffect} from "../../affect/factory"
import {Messages as CheckMessages} from "../../check/constants"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {RequestType} from "../../request/requestType"
import {format} from "../../support/string"
import TestBuilder from "../../test/testBuilder"
import SkillDefinition from "../skillDefinition"
import {SkillType} from "../skillType"
import {Messages} from "./constants"

let testBuilder: TestBuilder
let skillDefinition: SkillDefinition

beforeEach(async () => {
  testBuilder = new TestBuilder()
  skillDefinition = await testBuilder.getSkillDefinition(SkillType.Berserk)
})

describe("berserk skill preconditions", () => {
  it("should not allow berserking when preconditions fail", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer(p => {
      p.sessionMob.vitals.mv = 0
      p.sessionMob.level = 20
    })
    playerBuilder.withSkill(SkillType.Berserk)

    // when
    const response = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Berserk))

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.NotEnoughMv)
  })

  it("should not allow berserking if already berserked", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer(p => {
      p.sessionMob.addAffect(newAffect(AffectType.Berserk))
      p.sessionMob.level = 20
    })
    playerBuilder.withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    const response = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Berserk))

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator())
      .toBe(format(CheckMessages.AlreadyAffected, AffectType.Berserk))
  })

  it("should be able to get a success check if conditions met", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 20)
    playerBuilder.withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    const response = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Berserk))

    // then
    expect(response.isError()).toBeFalsy()
  })
})
