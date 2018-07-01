import { Room } from "../../room/model/room"
import { Direction } from "../../room/constants"
import { newReciprocalExit, newRoom } from "../../room/factory"
import { onCoinFlipSuccess } from "../../dice/dice"
import { newCritter } from "../../mob/factory/trail"
import { getFreeReciprocalDirection } from "../../room/direction"
import { persistAll } from "../../room/service"

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
