import { newTraveller } from "../mob/factory/inn"
import { Mob } from "../mob/model/mob"
import { Direction } from "../room/constants"
import { getFreeDirection } from "../room/direction"
import { newReciprocalExit, newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import { getExitRepository } from "../room/repository/exit"
import { getRoomRepository } from "../room/repository/room"
import { Arena } from "./arena"

function getRepositories() {
  return Promise.all([
    getExitRepository(),
    getRoomRepository(),
  ])
}

function getRandomRoom(rooms: Room[]) {
  return rooms[Math.floor(Math.random() * rooms.length)]
}

function persistAll(rooms, exits): Promise<Room[]> {
  return getRepositories()
    .then(([exitRepository, roomRepository]) => Promise.all(
      rooms.map((room) => roomRepository.save(room)))
        .then(() => Promise.all(exits.map((exit) => exitRepository.save(exit))))
          .then(() => rooms))
}

export function newWorld(rootRoom: Room): Promise<Room[]> {
  const TRAIL_1_ROOMS_TO_BUILD = 2
  // const TRAIL_2_ROOMS_TO_BUILD = 2
  // const TRAIL_3_ROOMS_TO_BUILD = 4
  // const TRAIL_4_ROOMS_TO_BUILD = 3
  const ARENA_1_WIDTH = 5
  const ARENA_1_HEIGHT = 5

  const trail = (room, count) => newTrail(room, getFreeDirection(room), count)

  return newInn(rootRoom)
    .then(() => trail(rootRoom, TRAIL_1_ROOMS_TO_BUILD))
    // .then(() => trail(rootRoom, TRAIL_2_ROOMS_TO_BUILD))
    // .then((roomCollection1) => trail(getRandomRoom(roomCollection1), TRAIL_3_ROOMS_TO_BUILD)
    //   .then(() => trail(getRandomRoom(roomCollection1), TRAIL_4_ROOMS_TO_BUILD))
      .then((roomCollection2) =>
        newArena(
          getRandomRoom(roomCollection2),
          ARENA_1_WIDTH,
          ARENA_1_HEIGHT)) // )
}

export function newInn(root: Room): Promise<Room[]> {
  const innRoom = (mobs: Mob[] = []) => newRoom(
    "A cozy room at the Inn",
    "Something about a room in the inn.",
    mobs)

  return getRepositories()
    .then(([exitRepository, roomRepository]) =>
     Promise.all([
      newRoom(
        "Inn at the lodge",
        "Flickering torches provide the only light in the large main mess hall. "
        + "The room is filled with the chatter of travellers preparing for the journey ahead.",
      [ newTraveller("an old traveller", "an old traveller sits at the bar, studying a small pamphlet") ]),
      innRoom([
        newTraveller(
          "a fur trapper",
          "tall and slender, a middle-age man sits at a bench. " +
          "Intent on cleaning and cataloguing his tools, he barely notices your presence.") ]),
      innRoom(),
      innRoom(),
      root,
    ].map((room) => roomRepository.save(room))).then((rooms) => {
      const [inn1, inn2, inn3, inn4] = rooms;
      [
        ...newReciprocalExit(Direction.North, inn1, inn2),
        ...newReciprocalExit(Direction.West, inn1, inn3),
        ...newReciprocalExit(Direction.East, inn1, inn4),
        ...newReciprocalExit(Direction.South, inn1, root),
      ].map((exit) => exitRepository.save(exit))

      return rooms
    }))
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
    exits.push(...newReciprocalExit(direction, initialRooms[i - 1], initialRooms[i]))
  }

  return persistAll(initialRooms, exits)
}

export function newArena(root: Room, width: number, height: number) {
  const arena = new Arena(root, width, height)

  return persistAll(arena.rooms, arena.exits)
}
