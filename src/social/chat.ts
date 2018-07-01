import { Player } from "../player/model/player"
import { Channel } from "./channel"
import { Message } from "./message"

let privateBuf = []

export function broadcastPrivateMessage(
  uniqueId: string, sender: Player, channel: Channel, messageStr: string): Message {
  if (!privateBuf[uniqueId]) {
    privateBuf[uniqueId] = []
  }

  const message = new Message(sender, channel, messageStr)
  privateBuf[uniqueId].push(message)

  return message
}

export function readPrivateMessages(): Message[] {
  const returnBuf = privateBuf
  privateBuf = []

  return returnBuf
}

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
