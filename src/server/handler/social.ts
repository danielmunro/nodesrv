import { Player } from "../../player/player"
import { Channel } from "../../social/constants"
import { broadcastMessage } from "../../social/chat"

export function gossip(sender: Player, message: string): void {
  broadcastMessage(sender, Channel.Gossip, message)
}