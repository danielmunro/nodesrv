import { newStartingVitals } from "../../../attributes/factory"
import { Mob } from "../../../mob/model/mob"
import { Player } from "../../../player/model/player"
import { savePlayer } from "../../../player/service"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_NEW_PLAYER_CONFIRM } from "../constants"
import Email from "./email"
import Name from "./name"
import Password from "./password"

export default class NewPlayerConfirm implements AuthStep {
  public readonly email: string

  constructor(email: string) {
    this.email = email
  }

  public getStepMessage(): string {
    return MESSAGE_NEW_PLAYER_CONFIRM
  }

  public async processRequest(request: Request): Promise<any> {
    const response = request.command

    if (response === "n") {
      return new Email()
    }

    if (response === "y") {
      const player = new Player()
      player.email = this.email
      await savePlayer(player)

      return new Name(player)
    }

    return this
  }
}
