import { Request } from "../../request/request"
import { gossip } from "../social"

export default function(request: Request): Promise<any> {
  return new Promise((resolve) => {
    gossip(request.player, request.player.sessionMob.name + " gossips, \"" + request.message + "\"")
    return resolve({ message: "You gossip, '" + request.message + "'"})
  })
}
