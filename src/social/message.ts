import { Mob } from "../mob/model/mob"
import { Channel } from "./channel"

export class Message {

  constructor(
    public readonly sender: Mob, public readonly channel: Channel, public readonly message: string) {}

  public getData() {
    return {
      channel: this.channel,
      message: this.message,
      sender: this.sender,
    }
  }
}
