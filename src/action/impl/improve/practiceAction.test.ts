import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import {Player} from "../../../player/model/player"
import {RequestType} from "../../../request/requestType"
import {SkillType} from "../../../skill/skillType"
import PlayerBuilder from "../../../test/playerBuilder"
import TestBuilder from "../../../test/testBuilder"
import {Messages} from "../../constants"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let player: Player
const command = "practice sneak"

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer()
  playerBuilder.addSkill(SkillType.Sneak)
    .setSpecializationType(SpecializationType.Ranger)
    .setPractices(1)
  player = playerBuilder.player
})

describe("practice action", () => {
  it("cannot practice if not at minimum level", async () => {
    // given
    testBuilder.withMob().asPractice()

    // when
    const response = await testBuilder.handleAction(RequestType.Practice, command)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(Messages.Practice.CannotPractice)
  })

  it("requires a mob that can help you practice", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.Practice)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Practice.MobNotHere)
  })

  it("requires available practice sessions", async () => {
    testBuilder.withMob().asPractice()
    player.sessionMob.playerMob.practices = 0

    // when
    const response = await testBuilder.handleAction(RequestType.Practice, command)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Practice.NotEnoughPractices)
  })

  it("can succeed", async () => {
    testBuilder.withMob().asPractice()
    playerBuilder.setLevel(4)
    const skill = player.sessionMob.skills[0]
    const initialValue = skill.level

    // when
    const response = await testBuilder.handleAction(RequestType.Practice, command)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You get better at ${skill.skillType}!`)
    expect(skill.level).toBeGreaterThan(initialValue)
  })

  it("will not exceed max practice level", async () => {
    testBuilder.withMob().asPractice()
    playerBuilder.setLevel(4)
    const skill = player.sessionMob.skills[0]
    skill.level = MAX_PRACTICE_LEVEL

    // when
    const response = await testBuilder.handleAction(RequestType.Practice, command)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You cannot improve anymore.")
    expect(skill.level).toBe(MAX_PRACTICE_LEVEL)
  })

  it("will not exceed max practice level if near limit", async () => {
    testBuilder.withMob().asPractice()
    playerBuilder.setLevel(4)
    const skill = player.sessionMob.skills[0]
    skill.level = MAX_PRACTICE_LEVEL - 1

    // when
    const response = await testBuilder.handleAction(RequestType.Practice, command)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You get better at ${skill.skillType}!`)
    expect(skill.level).toBe(MAX_PRACTICE_LEVEL)
  })
})
