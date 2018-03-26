import { Request } from "../../server/request/request"

export default function(request: Request): Promise<any> {
  return new Promise((resolve) => resolve({ inventory: request.player.getInventory()}))
}
