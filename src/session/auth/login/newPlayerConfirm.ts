import { Player } from "../../../player/model/player"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_NEW_PLAYER_CONFIRM } from "../constants"
import Password from "../createPlayer/password"
import Email from "./email"

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

      return new Password(player)
    }

    return this
  }
}
