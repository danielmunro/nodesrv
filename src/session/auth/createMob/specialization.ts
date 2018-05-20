import { assignSpecializationToMob } from "../../../mob/service"
import { createSpecializationFromType } from "../../../mob/specialization/factory"
import { allSpecializations } from "../../../mob/specialization/specializationType"
import { Player } from "../../../player/model/player"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import Complete from "../complete"
import { MESSAGE_CHOOSE_SPECIALIZATION } from "../constants"

export default class Specialization implements AuthStep {
  public readonly player: Player

  constructor(player: Player) {
    this.player = player
  }

  public getStepMessage(): string {
    return MESSAGE_CHOOSE_SPECIALIZATION
  }

  public async processRequest(request: Request): Promise<any> {
    const input = request.command
    const specialization = allSpecializations.find((s) => s.startsWith(input))

    if (!specialization) {
      return this
    }

    assignSpecializationToMob(this.player.sessionMob, createSpecializationFromType(specialization))

    return new Complete(this.player)
  }
}
