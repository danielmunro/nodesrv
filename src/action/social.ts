import { Mob } from "../mob/model/mob"
import { Channel } from "../social/channel"
import { Message } from "../social/message"
import { broadcastMessage } from "../social/publicBroadcast"

export function gossip(sender: Mob, message: string): Message {
  return broadcastMessage(sender, Channel.Gossip, message)
}
