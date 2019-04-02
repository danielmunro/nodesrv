import RaceService from "../../../mob/race/raceService"
import raceTable from "../../../mob/race/raceTable"
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
    const race = raceTable.find((r) => r.raceType.startsWith(request.input))

    if (!race) {
      return request.fail(this, MESSAGE_FAIL_RACE_UNAVAILABLE)
    }

    RaceService.assignRaceToMob(this.player.sessionMob, race.raceType)
    return request.ok(new Specialization(this.authService, this.player))
  }
}
