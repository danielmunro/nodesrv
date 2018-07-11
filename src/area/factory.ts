import { getFreeDirection } from "../room/direction"
import { Room } from "../room/model/room"
import { Arena } from "./arena"
import { newClearing } from "./builder/forest/clearing"
import { newInn } from "./builder/forest/inn"
import { newTrail } from "./builder/forest/trail"

export async function newWorld(rootRoom: Room): Promise<Set<Room>> {
  const TRAIL_1_ROOMS_TO_BUILD = 3
  const TRAIL_2_ROOMS_TO_BUILD = 3
  const ARENA_1_WIDTH = 5
  const ARENA_1_HEIGHT = 5
  const inn = await newInn(rootRoom)
  const trail1 = await newTrail(rootRoom, getFreeDirection(rootRoom), TRAIL_1_ROOMS_TO_BUILD)
  const trail1Ending = trail1[trail1.length - 1]
  const trail2 = await newTrail(trail1Ending, getFreeDirection(trail1Ending), TRAIL_2_ROOMS_TO_BUILD)
  const clearing = await newClearing(trail2[trail2.length - 1], ARENA_1_WIDTH, ARENA_1_HEIGHT)

  return new Set([
    ...inn,
    ...trail1,
    ...trail2,
    ...clearing,
  ])
}

export async function newArena(root: Room, width: number, height: number, mobFactory) {
  const arena = new Arena(root, width, height, mobFactory)
  await arena.buildMatrix()

  return arena
}
