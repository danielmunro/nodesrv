import {createTestAppContainer} from "../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {SkillEntity} from "../../../mob/skill/entity/skillEntity"
import {SkillType} from "../../../mob/skill/skillType"
import {SpecializationType} from "../../../mob/specialization/enum/specializationType"
import {SpellEntity} from "../../../mob/spell/entity/spellEntity"
import {SpellType} from "../../../mob/spell/spellType"
import {RequestType} from "../../../request/enum/requestType"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"

let testRunner: TestRunner
let playerBuilder: PlayerBuilder
const command = "practice sneak"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  playerBuilder = testRunner.createPlayer()
    .addSkill(SkillType.Sneak)
    .addSpell(SpellType.MagicMissile)
    .setSpecializationType(SpecializationType.Ranger)
    .setPractices(1)
})

describe("practice action", () => {
  it("cannot practice if not at minimum level", async () => {
    // given
    testRunner.createMob().asPractice()

    // when
    const response = await testRunner.invokeAction(RequestType.Practice, command)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(Messages.Practice.CannotPractice)
  })

  it("requires a mob that can help you practice", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Practice)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Practice.MobNotHere)
  })

  it("requires available practice sessions", async () => {
    // given
    testRunner.createMob().asPractice()
    playerBuilder.setPractices(0)

    // when
    const response = await testRunner.invokeAction(RequestType.Practice, command)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Practice.NotEnoughPractices)
  })

  it("increases skill level when successfully practiced", async () => {
    testRunner.createMob().asPractice()
    playerBuilder.setLevel(4)
    const skill = playerBuilder.getMob().getSkill(SkillType.Sneak) as SkillEntity
    const initialValue = skill.level

    // when
    const response = await testRunner.invokeAction(RequestType.Practice, command)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You get better at ${skill.skillType}!`)
    expect(skill.level).toBeGreaterThan(initialValue)
  })

  it("increases spell level when successfully practiced", async () => {
    testRunner.createMob().asPractice()
    playerBuilder.setLevel(4)
    const spell = playerBuilder.getMob().getSpell(SpellType.MagicMissile) as SpellEntity
    const initialValue = spell.level

    // when
    const response = await testRunner.invokeAction(RequestType.Practice, "practice magic")

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You get better at ${spell.spellType}!`)
    expect(spell.level).toBeGreaterThan(initialValue)
  })

  it("will not exceed max practice level", async () => {
    testRunner.createMob().asPractice()
    playerBuilder.setLevel(4)
    const skill = playerBuilder.getMob().getSkill(SkillType.Sneak) as SkillEntity
    skill.level = MAX_PRACTICE_LEVEL

    // when
    const response = await testRunner.invokeAction(RequestType.Practice, command)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You cannot improve anymore.")
    expect(skill.level).toBe(MAX_PRACTICE_LEVEL)
  })

  it("will not exceed max practice level if near limit", async () => {
    testRunner.createMob().asPractice()
    playerBuilder.setLevel(4)
    const skill = playerBuilder.getMob().getSkill(SkillType.Sneak) as SkillEntity
    skill.level = MAX_PRACTICE_LEVEL - 1

    // when
    const response = await testRunner.invokeAction(RequestType.Practice, command)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You get better at ${skill.skillType}!`)
    expect(skill.level).toBe(MAX_PRACTICE_LEVEL)
  })
})
