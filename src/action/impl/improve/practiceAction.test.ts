import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {Player} from "../../../player/model/player"
import {RequestType} from "../../../request/requestType"
import {newSkill} from "../../../skill/factory"
import {SkillType} from "../../../skill/skillType"
import PlayerBuilder from "../../../test/playerBuilder"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {Messages} from "../../constants"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let player: Player
let action: Action
const command = "practice sneak"

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.withMob().asTrainer()
  playerBuilder = await testBuilder.withPlayer()
  player = playerBuilder.player
  player.sessionMob.playerMob.practices = 1
  player.sessionMob.skills.push(newSkill(SkillType.Sneak))
  action = await testBuilder.getActionDefinition(RequestType.Practice)
})

describe("practice action", () => {
  it("requires a mob that can help you practice", async () => {
    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Practice))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Practice.MobNotHere)
  })

  it("requires available practice sessions", async () => {
    testBuilder.withMob().asPractice()
    player.sessionMob.playerMob.practices = 0

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Practice, command))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Practice.NotEnoughPractices)
  })

  it("can succeed", async () => {
    testBuilder.withMob().asPractice()
    const skill = player.sessionMob.skills[0]
    const initialValue = skill.level

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Practice, command))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`You get better at ${skill.skillType}!`)
    expect(skill.level).toBeGreaterThan(initialValue)
  })

  it("will not exceed max practice level", async () => {
    testBuilder.withMob().asPractice()
    const skill = player.sessionMob.skills[0]
    skill.level = MAX_PRACTICE_LEVEL

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Practice, command))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("You cannot improve anymore.")
    expect(skill.level).toBe(MAX_PRACTICE_LEVEL)
  })

  it("will not exceed max practice level if near limit", async () => {
    testBuilder.withMob().asPractice()
    const skill = player.sessionMob.skills[0]
    skill.level = MAX_PRACTICE_LEVEL - 1

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Practice, command))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`You get better at ${skill.skillType}!`)
    expect(skill.level).toBe(MAX_PRACTICE_LEVEL)
  })
})
