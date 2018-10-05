import { Mob } from "../mob/model/mob"
import { Channel } from "./channel"
import { Message } from "./message"

let privateBuf = {}

export function broadcastPrivateMessage(
  uniqueId: string, sender: Mob, channel: Channel, messageStr: string): Message {
  if (!privateBuf[uniqueId]) {
    privateBuf[uniqueId] = []
  }

  const message = new Message(sender, channel, messageStr)
  privateBuf[uniqueId].push(message)

  return message
}

export function readPrivateMessages() {
  const returnBuf = privateBuf
  privateBuf = {}

  return returnBuf
}
