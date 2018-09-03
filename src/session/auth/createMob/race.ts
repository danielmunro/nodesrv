import appetite from "../../../mob/race/appetite"
import { allRaces } from "../../../mob/race/race"
import { getRaceSkills } from "../../../mob/race/skillTable"
import { newSkill } from "../../../skill/factory"
import AuthStep from "../authStep"
import { MESSAGE_CHOOSE_RACE, MESSAGE_FAIL_RACE_UNAVAILABLE } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import Specialization from "./specialization"

export default class Race extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_CHOOSE_RACE
  }

  public async processRequest(request: Request): Promise<Response> {
    const race = allRaces.find((r) => r.startsWith(request.input))

    if (!race) {
      return request.fail(this, MESSAGE_FAIL_RACE_UNAVAILABLE)
    }

    const mob = this.player.sessionMob
    mob.race = race
    mob.playerMob.appetite = appetite(race)
    mob.playerMob.hunger = appetite(race)
    mob.skills.push(...getRaceSkills(race).map((skill) => newSkill(skill.skillType)))
    return request.ok(new Specialization(this.player))
  }
}
