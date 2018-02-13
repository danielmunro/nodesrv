import { Player } from "../player/player"
import { Room } from "../room/room"

export function getTestPlayer(): Player {
  return new Player("test", new Room(1, "test"))
}
