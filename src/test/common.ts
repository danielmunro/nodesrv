import { Attributes } from "./../attributes/attributes"
import { Mob } from "./../mob/mob"
import { Race } from "./../mob/race/race"
import { Player } from "./../player/player"
import { Room } from "./../room/room"

export function getTestPlayer(): Player {
  const player = new Player("test")
  player.setMob(
    new Mob(
      "identifier",
      "mob",
      Race.Human,
      0,
      0,
      0,
      Attributes.withNoAttributes(),
      new Room("uuid", "name", "description", [])))

  return player
}
