import { Player } from "../player/model/player"
import { Channel } from "./channel"

export class Message {
  public readonly sender: Player
  public readonly channel: Channel
  public readonly message: string

  constructor(sender: Player, channel: Channel, message: string) {
    this.sender = sender
    this.channel = channel
    this.message = message
  }

  public getData() {
    return {
      channel: this.channel,
      message: this.message,
      sender: this.sender,
    }
  }
}
