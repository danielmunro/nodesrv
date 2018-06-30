import { Player } from "../player/model/player"
import { Channel } from "../social/channel"
import { broadcastMessage } from "../social/chat"
import { Message } from "../social/message"

export function gossip(sender: Player, message: string): Message {
  return broadcastMessage(sender, Channel.Gossip, message)
}
