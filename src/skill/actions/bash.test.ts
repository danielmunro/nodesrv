import { RequestType } from "../../handler/constants"
import { addFight, Fight } from "../../mob/fight/fight"
import { Request } from "../../server/request/request"
import { Skill } from "../../skill/model/skill"
import { SkillType } from "../../skill/skillType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import bash, { MESSAGE_FAIL, MESSAGE_NO_SKILL, MESSAGE_NO_TARGET } from "./bash"

describe("bash", () => {
  it("should not work if a mob is not in combat", () => {
    const player = getTestPlayer()
    expect.assertions(1)

    return bash(new Request(player, RequestType.Bash, {request: "bash"}))
      .then((result) => expect(result).toEqual({ message: MESSAGE_NO_TARGET }))
  })

  it("should not work if a mob does not have the skill", () => {
    const player = getTestPlayer()
    const target = getTestMob()
    const fight = new Fight(player.sessionMob, target)
    addFight(fight)
    expect.assertions(1)

    return bash(new Request(player, RequestType.Bash, {request: "bash"}))
      .then((result) => expect(result).toEqual({ message: MESSAGE_NO_SKILL }))
  })

  it("should be able to trigger a failed bash", () => {
    const player = getTestPlayer()
    const skill = new Skill()
    skill.skillType = SkillType.Bash
    player.sessionMob.skills.push(skill)
    const target = getTestMob()
    const fight = new Fight(player.sessionMob, target)
    addFight(fight)
    expect.assertions(1)

    const bashRepeater = () => bash(new Request(player, RequestType.Bash, {request: "bash"}))

    return Promise.all(Array.from(Array(10).keys()).map((n) => bashRepeater()))
      .then((results) => expect(results.find((result) => result.message === MESSAGE_FAIL)).toBeTruthy())
  })

  it("should be able to trigger a successful bash", () => {
    const player = getTestPlayer()
    const skill = new Skill()
    skill.skillType = SkillType.Bash
    skill.level = 100
    player.sessionMob.skills.push(skill)
    const target = getTestMob()
    const fight = new Fight(player.sessionMob, target)
    addFight(fight)
    expect.assertions(1)

    const bashRepeater = () => bash(new Request(player, RequestType.Bash, {request: "bash"}))

    return Promise.all(Array.from(Array(10).keys()).map((n) => bashRepeater()))
      .then((results) => expect(results.find((result) => result.message.includes("You slam into"))).toBeTruthy())
  })
})
