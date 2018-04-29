import { RequestType } from "../../handler/constants"
import { addFight, Fight } from "../../mob/fight/fight"
import { Player } from "../../player/model/player"
import { createRequestArgs, Request } from "../../server/request/request"
import { Skill } from "../../skill/model/skill"
import { SkillType } from "../../skill/skillType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { newSkill } from "../factory"
import bash, { MESSAGE_FAIL, MESSAGE_NO_SKILL, MESSAGE_NO_TARGET } from "./bash"

function createBashRequest(player: Player): Request {
  return new Request(player, RequestType.Bash, createRequestArgs("bash"))
}

describe("bash", () => {
  it("should not work if a mob is not in combat", async () => {
    expect.assertions(1)

    await bash(createBashRequest(getTestPlayer()))
      .then((result) => expect(result).toEqual({ message: MESSAGE_NO_TARGET }))
  })

  it("should not work if a mob does not have the skill", async () => {
    const player = getTestPlayer()
    const target = getTestMob()
    const fight = new Fight(player.sessionMob, target)
    addFight(fight)
    expect.assertions(1)

    await bash(createBashRequest(player))
      .then((result) => expect(result).toEqual({ message: MESSAGE_NO_SKILL }))
  })

  it("should be able to trigger a failed bash", async () => {
    const player = getTestPlayer()
    player.sessionMob.skills.push(newSkill(SkillType.Bash))
    const target = getTestMob()
    const fight = new Fight(player.sessionMob, target)
    addFight(fight)
    expect.assertions(1)

    const bashRepeater = () => bash(createBashRequest(player))

    await Promise.all(Array.from(Array(10).keys()).map((n) => bashRepeater()))
      .then((results) => expect(results.find((result) => result.message === MESSAGE_FAIL)).toBeTruthy())
  })

  it("should be able to trigger a successful bash", async () => {
    const player = getTestPlayer()
    player.sessionMob.skills.push(newSkill(SkillType.Bash, 100))
    const target = getTestMob()
    const fight = new Fight(player.sessionMob, target)
    addFight(fight)
    expect.assertions(1)

    const bashRepeater = () => bash(createBashRequest(player))

    await Promise.all(Array.from(Array(10).keys()).map((n) => bashRepeater()))
      .then((results) => expect(results.find((result) => result.message.includes("You slam into"))).toBeTruthy())
  })
})
