import { Player } from "../player/model/player"
import { Channel } from "./channel"
import { Message } from "./message"

let buf = []

export function broadcastMessage(sender: Player, channel: Channel, messageStr: string): Message {
  const message = new Message(sender, channel, messageStr)
  buf.push(message)

  return message
}

export function readMessages(): Message[] {
  const returnBuf = buf
  buf = []

  return returnBuf
}
