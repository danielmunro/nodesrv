import { RequestType } from "../../handler/constants"
import { addFight, Fight, reset } from "../../mob/fight/fight"
import { Player } from "../../player/model/player"
import { createRequestArgs, Request } from "../../request/request"
import { SkillType } from "../../skill/skillType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { newSkill } from "../factory"
import bash, { MESSAGE_FAIL, MESSAGE_NO_SKILL, MESSAGE_NO_TARGET } from "./bash"

const RETRY_COUNT = 10

function createBashRequest(player: Player): Request {
  return new Request(player, RequestType.Bash, createRequestArgs("bash"))
}

function bashRepeater(player: Player) {
  return () => bash(createBashRequest(player))
}

function times(count: number, callback) {
  return Array.from(Array(10).keys()).map((n) => callback())
}

function addNewTestFight(player: Player): void {
  addFight(new Fight(player.sessionMob, getTestMob()))
}

beforeEach(() => reset())

describe("bash", () => {
  it("should not work if a mob is not in combat", async () => {
    expect.assertions(1)
    await bash(createBashRequest(getTestPlayer()))
      .then((result) => expect(result).toEqual({ message: MESSAGE_NO_TARGET }))
  })

  it("should not work if a mob does not have the skill", async () => {
    // setup
    const player = getTestPlayer()
    addNewTestFight(player)
    expect.assertions(1)

    // expect
    await bash(createBashRequest(player))
      .then((result) => expect(result).toEqual({ message: MESSAGE_NO_SKILL }))
  })

  it("should be able to trigger a failed bash", async () => {
    // setup
    const player = getTestPlayer()
    player.sessionMob.skills.push(newSkill(SkillType.Bash))
    addNewTestFight(player)
    expect.assertions(1)

    // expect
    await Promise.all(times(RETRY_COUNT, bashRepeater(player)))
      .then((results) => expect(results.some((result) => result.message === MESSAGE_FAIL)).toBeTruthy())
  })

  it("should be able to trigger a successful bash", async () => {
    // setup
    const player = getTestPlayer()
    player.sessionMob.skills.push(newSkill(SkillType.Bash, 100))
    addNewTestFight(player)
    expect.assertions(1)

    // expect:
    await Promise.all(times(RETRY_COUNT, bashRepeater(player)))
      .then((results) => expect(results.some((result) => result.message.includes("You slam into"))).toBeTruthy())
  })
})
