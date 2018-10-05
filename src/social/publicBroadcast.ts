import { Mob } from "../mob/model/mob"
import { Channel } from "./channel"
import { Message } from "./message"

let buf = []

export function broadcastMessage(sender: Mob, channel: Channel, messageStr: string): Message {
  const message = new Message(sender, channel, messageStr)
  buf.push(message)

  return message
}

export function readMessages(): Message[] {
  const returnBuf = buf
  buf = []

  return returnBuf
}
