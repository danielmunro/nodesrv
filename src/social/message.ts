import { Player } from "../player/player"
import { Channel } from "./channel"

export class Message {
  private readonly sender: Player
  private readonly channel: Channel
  private readonly message: string

  constructor(sender: Player, channel: Channel, message: string) {
    this.sender = sender
    this.channel = channel
    this.message = message
  }

  public getSender(): Player {
    return this.sender
  }

  public getChannel(): Channel {
    return this.channel
  }

  public getMessage(): string {
    return this.message
  }
}
