import { Player } from "../player/player"
import { Channel } from "./constants"

export class Message {
  public readonly sender: Player
  public readonly channel: Channel
  public readonly message: string

  constructor(sender: Player, channel: Channel, message: string) {
    this.sender = sender
    this.channel = channel
    this.message = message
  }
}
