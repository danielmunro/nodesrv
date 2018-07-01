import { Room } from "../../room/model/room"
import { Mob } from "../../mob/model/mob"
import { newReciprocalExit, newRoom } from "../../room/factory"
import { newTraveller } from "../../mob/factory/inn"
import { persistAll } from "../../room/service"
import { Direction } from "../../room/constants"
import { getFreeReciprocalDirection } from "../../room/direction"

export function newInn(root: Room): Promise<Room[]> {
  const innRoom = (mobs: Mob[] = []) => newRoom(
    "A cozy room at the Inn",
    "Something about a room in the inn.",
    mobs)

  const main = newRoom(
    "Inn at the lodge",
    "Flickering torches provide the only light in the large main mess hall. "
    + "The room is filled with the chatter of travellers preparing for the journey ahead.",
    [newTraveller("an old traveller", "an old traveller sits at the bar, studying a small pamphlet")])
  const inn1 = innRoom([
    newTraveller(
      "a fur trapper",
      "tall and slender, a middle-age man sits at a bench. " +
      "Intent on cleaning and cataloguing his tools, he barely notices your presence.")])
  const inn2 = innRoom()
  const inn3 = innRoom()

  return persistAll(
    [
      main,
      inn1,
      inn2,
      inn3,
      root,
    ], [
      ...newReciprocalExit(Direction.North, main, inn1),
      ...newReciprocalExit(Direction.West, main, inn2),
      ...newReciprocalExit(Direction.East, main, inn3),
      ...newReciprocalExit(getFreeReciprocalDirection(main, root), main, root),
    ])
}

