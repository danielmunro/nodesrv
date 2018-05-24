import { Request } from "../../request/request"

export const NOT_FOUND = "You don't see that anywhere."

export default function(request: Request): Promise<any> {
  return new Promise((resolve) => {
    if (request.subject) {
      const mob = request.findMobInRoom()
      if (mob) {
        return resolve({ mob })
      }

      let item = request.findItemInRoomInventory()
      if (item) {
        return resolve({ item })
      }

      item = request.findItemInSessionMobInventory()
      if (item) {
        return resolve({ item })
      }

      return resolve({ message: NOT_FOUND })
    }

    return resolve({ room: request.getRoom() })
  })
}
