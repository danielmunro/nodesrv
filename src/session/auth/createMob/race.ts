import { allRaces } from "../../../mob/race/race"
import AuthStep from "../authStep"
import { MESSAGE_CHOOSE_RACE, MESSAGE_FAIL_RACE_UNAVAILABLE } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import Specialization from "./specialization"
import appetite from "../../../mob/race/appetite"

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

    this.player.sessionMob.race = race
    this.player.sessionMob.playerMob.appetite = appetite(race)
    return request.ok(new Specialization(this.player))
  }
}
