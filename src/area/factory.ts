import { newAttributes, newHitroll, newStartingStats, newVitals } from "../attributes/factory"
import { newMob } from "../mob/factory"
import { Race } from "../mob/race/race"
import { Direction } from "../room/constants"
import { getFreeDirection } from "../room/direction"
import { newReciprocalExit, newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import { getExitRepository } from "../room/repository/exit"
import { getRoomRepository } from "../room/repository/room"
import { Arena } from "./arena"
import { Size } from "./size"

function getRepositories() {
  return Promise.all([
    getExitRepository(),
    getRoomRepository(),
  ])
}

function getRoomCount(baseSize: number, modifier: number) {
  return Math.ceil(baseSize * modifier)
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

export function newWorld(rootRoom: Room, size: Size = Size.Medium): Promise<Room[]> {
  const TRAIL_1_ROOMS_TO_BUILD = 2
  const TRAIL_2_ROOMS_TO_BUILD = 2
  const TRAIL_3_ROOMS_TO_BUILD = 4
  const TRAIL_4_ROOMS_TO_BUILD = 3
  const ARENA_1_WIDTH = 5
  const ARENA_1_HEIGHT = 5

  const trail = (room, count) => newTrail(room, getFreeDirection(room), getRoomCount(count, size))

  return newInn(rootRoom)
    .then(() => trail(rootRoom, TRAIL_1_ROOMS_TO_BUILD))
    // .then(() => trail(rootRoom, TRAIL_2_ROOMS_TO_BUILD))
    // .then((rooms1) => trail(getRandomRoom(rooms1), TRAIL_3_ROOMS_TO_BUILD)
      // .then(() => trail(getRandomRoom(rooms1), TRAIL_4_ROOMS_TO_BUILD))
      .then((rooms2) =>
        newArena(
          getRandomRoom(rooms2),
          ARENA_1_WIDTH,
          ARENA_1_HEIGHT))// )
}

export function newInn(root: Room): Promise<Room[]> {
  const innRoom = () => newRoom(
    "A cozy room at the Inn",
    "Something about a room in the inn.")

  return getRepositories()
    .then(([exitRepository, roomRepository]) =>
     Promise.all([
      newRoom(
        "Inn at the lodge",
        "Flickering torches provide the only light in the large main mess hall. "
        + "The room is filled with the chatter of travellers preparing for the journey ahead.",
      [
        newMob(
          "an old traveller",
          "an old traveller sits at the bar, studying a small pamphlet",
          Race.Human,
          newVitals(100, 100, 100),
          newAttributes(
            newVitals(100, 100, 100),
            newStartingStats(),
            newHitroll(2, 3)),
        ),
      ]),
      innRoom(),
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
  const matrix = []
  for (let y = 0; y < height; y++) {
    matrix[y] = []
    for (let x = 0; x < width; x++) {
      matrix[y][x] = newRoom(root.name, root.description)
    }
  }
  const arena = new Arena()
  matrix.forEach((row, y) =>
    row.forEach((pos, x) => {
      matrix[y][x] = newRoom(root.name, root.description)
      connectArena(matrix, x, y, arena)
    }))
  // todo: ensure matrix[0][0] has a free direction for this room connection
  addReciprocalExitToArena(getFreeDirection(root), root, matrix[0][0], arena)

  return persistAll(arena.getRooms(), arena.getExits())
}

function connectArena(matrix: Room[][], x: number, y: number, arena: Arena) {
  const current = matrix[y][x]

  if (x > 0) {
    addReciprocalExitToArena(Direction.West, current, matrix[y][x - 1], arena)
  }

  if (y > 0) {
    addReciprocalExitToArena(Direction.North, current, matrix[y - 1][x], arena)
  }

  arena.addRoom(current)
}

function addReciprocalExitToArena(direction: Direction, room1: Room, room2: Room, arena: Arena) {
  newReciprocalExit(direction, room1, room2).map((e) => arena.addExit(e))
}
