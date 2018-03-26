import { Player } from "../player/model/player"
import { broadcastMessage } from "../social/chat"
import { Channel } from "../social/constants"
import { Message } from "../social/message"

export function gossip(sender: Player, message: string): Message {
  return broadcastMessage(sender, Channel.Gossip, message)
}
