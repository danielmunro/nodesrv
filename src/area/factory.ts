import { newCritter } from "../mob/factory/trail"
import { getFreeDirection, getFreeReciprocalDirection } from "../room/direction"
import { newReciprocalExit } from "../room/factory"
import { Room } from "../room/model/room"
import { getExitRepository } from "../room/repository/exit"
import { Arena } from "./arena"
import { newInn } from "./builder/forest/inn"
import { newTrail } from "./builder/forest/trail"
import { newClearing } from "./builder/forest/clearing"

export async function newWorld(rootRoom: Room): Promise<Set<Room>> {
  const TRAIL_1_ROOMS_TO_BUILD = 3
  const ARENA_1_WIDTH = 5
  const ARENA_1_HEIGHT = 5

  const inn = await newInn(rootRoom)
  const trail1 = await newTrail(rootRoom, getFreeDirection(rootRoom), TRAIL_1_ROOMS_TO_BUILD)
  const clearing = await newClearing(trail1[2], ARENA_1_WIDTH, ARENA_1_HEIGHT)
  console.log(inn.length, trail1.length, clearing.length)
  return new Set([
    ...inn,
    ...trail1,
    ...clearing,
  ])
}

export async function newArena(root: Room, width: number, height: number) {
  const arena = new Arena(root, width, height, newCritter)
  const exits = newReciprocalExit(
    getFreeReciprocalDirection(root, arena.connectingRoom),
    root,
    arena.connectingRoom,
  )
  const exitRepository = await getExitRepository()
  await exitRepository.save(exits)

  return arena
}
