import RaceService from "../../../../mob/race/raceService"
import raceTable from "../../../../mob/race/raceTable"
import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import AuthStep from "../authStep"
import PlayerAuthStep from "../playerAuthStep"
import Specialization from "./specialization"

export default class Race extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Mob.RacePrompt
  }

  public async processRequest(request: Request): Promise<Response> {
    const race = raceTable.find((r) => r.raceType.startsWith(request.input))

    if (!race) {
      return request.fail(this, CreationMessages.Mob.RaceInvalid)
    }

    RaceService.assignRaceToMob(this.player.sessionMob, race.raceType)
    return request.ok(new Specialization(this.creationService, this.player))
  }
}
