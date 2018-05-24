import { persistMob } from "../../../mob/repository/mob"
import { Request } from "../../../request/request"
import AuthStep from "../authStep"
import { default as FinalComplete } from "../complete"
import { MESSAGE_COMPLETE } from "../constants"
import PlayerAuthStep from "../playerAuthStep"

export default class Complete extends PlayerAuthStep implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_COMPLETE
  }

  public async processRequest(request: Request): Promise<any> {
    await persistMob(this.player.sessionMob)

    return new FinalComplete(this.player)
  }
}
