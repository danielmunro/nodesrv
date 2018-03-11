import { Player } from "../player/model/player"
import { Channel } from "./constants"
import { Message } from "./message"

let buf = []

export function broadcastMessage(sender: Player, channel: Channel, message: string): void {
  buf.push(new Message(sender, channel, message))
}

export function readMessages(): Message[] {
  const returnBuf = buf
  buf = []

  return returnBuf
}
