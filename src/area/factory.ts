import { onCoinFlipSuccess } from "../dice/dice"
import { newTraveller } from "../mob/factory/inn"
import { newCritter } from "../mob/factory/trail"
import { Mob } from "../mob/model/mob"
import { Direction } from "../room/constants"
import { getFreeDirection, getFreeReciprocalDirection } from "../room/direction"
import { newReciprocalExit, newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import { persistAll } from "../room/service"
import { Arena } from "./arena"

export async function newWorld(rootRoom: Room): Promise<Room[]> {
  const TRAIL_1_ROOMS_TO_BUILD = 3
  const ARENA_1_WIDTH = 5
  const ARENA_1_HEIGHT = 5

  const inn = await newInn(rootRoom)
  const trail1 = await newTrail(rootRoom, getFreeDirection(rootRoom), TRAIL_1_ROOMS_TO_BUILD)
  const arena = await newArena(trail1[2], ARENA_1_WIDTH, ARENA_1_HEIGHT)
  // const trail2 = await newTrail(arena.matrix[4][4])

  return [
    ...inn,
    ...trail1,
    ...arena.rooms,
  ]
}

export function newInn(root: Room): Promise<Room[]> {
  const innRoom = (mobs: Mob[] = []) => newRoom(
    "A cozy room at the Inn",
    "Something about a room in the inn.",
    mobs)

  const main = newRoom(
    "Inn at the lodge",
    "Flickering torches provide the only light in the large main mess hall. "
    + "The room is filled with the chatter of travellers preparing for the journey ahead.",
  [ newTraveller("an old traveller", "an old traveller sits at the bar, studying a small pamphlet") ])
  const inn1 = innRoom([
    newTraveller(
      "a fur trapper",
      "tall and slender, a middle-age man sits at a bench. " +
      "Intent on cleaning and cataloguing his tools, he barely notices your presence.") ])
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

export function newTrail(root: Room, direction: Direction, length: number) {
  const trailRoom = () => newRoom(
    "A trail in the woods",
    "Old growth trees line a narrow and meandering trail. " +
    "Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs " +
    "frozen in the canopy, leaving an eerie silence.")
  const initialRooms = []
  const exits = []

  for (let i = 0; i < length; i++) {
    initialRooms.push(trailRoom())
    if (i === 0) {
      exits.push(...newReciprocalExit(direction, root, initialRooms[0]))
      continue
    }
    onCoinFlipSuccess(() => initialRooms[i].mobs.push(newCritter()))
    exits.push(
      ...newReciprocalExit(
        getFreeReciprocalDirection(initialRooms[i - 1], initialRooms[i]),
        initialRooms[i - 1],
        initialRooms[i]))
  }

  return persistAll(initialRooms, exits)
}

export async function newArena(root: Room, width: number, height: number) {
  const arena = new Arena(root, width, height, newCritter)
  const exits = newReciprocalExit(
    getFreeReciprocalDirection(root, arena.connectingRoom),
    root,
    arena.connectingRoom,
  )

  await persistAll(arena.rooms, [...arena.exits, ...exits])

  return arena
}
