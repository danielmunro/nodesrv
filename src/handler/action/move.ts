import { Player } from "../../player/model/player"
import { Direction } from "../../room/constants"
import { moveMob } from "../../room/service"

export const MESSAGE_DIRECTION_DOES_NOT_EXIST = "Alas, that direction does not exist."

export default function(player: Player, direction: Direction): Promise<any> {
  const exit = player.getExit(direction)

  if (!exit) {
    return new Promise((resolve) => resolve({ message: MESSAGE_DIRECTION_DOES_NOT_EXIST }))
  }

  return moveMob(player.sessionMob, direction)
    .then(() => ({ room: player.sessionMob.room }))
}
