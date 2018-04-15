import { newAttributes, newHitroll, newStartingStats, newVitals } from "../attributes/factory"
import { newMob } from "../mob/factory"
import { Race } from "../mob/race/race"
import { Direction } from "../room/constants"
import { getFreeDirection } from "../room/direction"
import { newReciprocalExit, newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import { getExitRepository } from "../room/repository/exit"
import { getRoomRepository } from "../room/repository/room"

function getRepositories() {
  return Promise.all([
    getExitRepository(),
    getRoomRepository(),
  ])
}

export function newWorld(rootRoom: Room): Promise<Room[]> {
  return newInn(rootRoom)
    .then(() => newTrail(rootRoom, getFreeDirection(rootRoom), 5))
    .then(() => newTrail(rootRoom, getFreeDirection(rootRoom), 2))
    .then((rooms) => {
      const connectorRoom = rooms[rooms.length - 1]

      return newTrail(connectorRoom, getFreeDirection(connectorRoom), 2)
    })
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

  return getRepositories()
    .then(([exitRepository, roomRepository]) => Promise.all(
      initialRooms.map((room) => roomRepository.save(room)))
        .then(() => Promise.all(exits.map((exit) => exitRepository.save(exit))))
          .then(() => initialRooms))
}
