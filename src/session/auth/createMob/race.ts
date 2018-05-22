import { allRaces } from "../../../mob/race/race"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_CHOOSE_RACE } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Specialization from "./specialization"

export default class Race extends PlayerAuthStep implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_CHOOSE_RACE
  }

  public async processRequest(request: Request): Promise<any> {
    const input = request.command
    const race = allRaces.find((r) => r.startsWith(input))

    if (!race) {
      return this
    }

    this.player.sessionMob.race = race
    return new Specialization(this.player)
  }
}
