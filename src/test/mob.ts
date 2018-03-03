import * as v4 from "uuid"
import { Attributes } from "./../attributes/attributes"
import { Mob } from "./../mob/mob"
import { Race } from "./../mob/race/race"
import { Room } from "./../room/room"

export function getTestMob(): Mob {
  return new Mob(
    v4(),
    "mob name",
    Race.Human,
    1,
    0,
    0,
    Attributes.withNoAttributes(),
    new Room(
      v4(),
      "room name",
      "description",
      [],
    ),
  )
}
