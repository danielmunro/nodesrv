import { Mob } from "../../../mob/model/mob"
import { allRaces } from "../../../mob/race/race"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_CHOOSE_RACE } from "../constants"
import Specialization from "./specialization"

export default class Race implements AuthStep {
  public readonly mob: Mob

  constructor(mob: Mob) {
    this.mob = mob
  }

  public getStepMessage(): string {
    return MESSAGE_CHOOSE_RACE
  }

  public async processRequest(request: Request): Promise<any> {
    const input = request.command
    const race = allRaces.find((r) => r.startsWith(input))

    if (!race) {
      return this
    }

    this.mob.race = race
    return new Specialization(this.mob)
  }
}
