import { Player } from "../player/model/player"
import { Channel } from "../social/channel"
import { Message } from "../social/message"
import { broadcastMessage } from "../social/publicBroadcast"

export function gossip(sender: Player, message: string): Message {
  return broadcastMessage(sender, Channel.Gossip, message)
}
