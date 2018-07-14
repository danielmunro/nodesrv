import newRegion from "../region/factory"
import { Region } from "../region/model/region"
import { Terrain } from "../region/terrain"
import { getFreeDirection } from "../room/direction"
import { Room } from "../room/model/room"
import AreaBuilder from "./areaBuilder"
import { Arena } from "./arena"
import { newClearing } from "./builder/forest/clearing"
import { newInn } from "./builder/forest/inn"
import { newTrail } from "./builder/forest/trail"
import { SectionType } from "./sectionType"
import WorldBuilder from "./worldBuilder"

const FOREST_INN_REGION = "Forest Inn"
const FOREST_REGION = "Forest"
const TRAIL_1_ROOMS_TO_BUILD = 3
const ARENA_1_WIDTH = 5
const ARENA_1_HEIGHT = 5

async function getForestInnRegion(rootRoom: Room): Promise<Region> {
  const innAreaBuilder = await newInn(rootRoom)
  const forestInnRegion = newRegion(FOREST_INN_REGION, Terrain.Settlement)
  forestInnRegion.addRooms(innAreaBuilder.getAllRooms())
  forestInnRegion.outsideConnectionCandidates.push(...innAreaBuilder.getRoomsBySection(SectionType.Root))

  return forestInnRegion
}

function getForestTrailAreaBuilder(rootRoom: Room): Promise<AreaBuilder> {
  return newTrail(rootRoom, getFreeDirection(rootRoom), TRAIL_1_ROOMS_TO_BUILD)
}

function getClearingAreaBuilder(rootRoom: Room): Promise<AreaBuilder> {
  return newClearing(rootRoom, ARENA_1_WIDTH, ARENA_1_HEIGHT)
}

async function getForestRegion(rootRoom: Room): Promise<Region> {
  const trail1 = (await getForestTrailAreaBuilder(rootRoom))
  const trail2 = (await getForestTrailAreaBuilder(trail1.getExitRoom()))
  const clearing = (await getClearingAreaBuilder(trail2.getExitRoom()))
  const trail3 = (await getForestTrailAreaBuilder(clearing.getExitRoom()))

  const forestRegion = newRegion(FOREST_REGION, Terrain.Forest)
  forestRegion.rooms.push(
    ...trail1.getAllRooms(),
    ...trail2.getAllRooms(),
    ...clearing.getAllRooms(),
    ...trail3.getAllRooms())

  return forestRegion
}

export async function newWorld(rootRoom: Room): Promise<Set<Room>> {
  const worldBuilder = new WorldBuilder(rootRoom)
  await worldBuilder.addRootRegion(await getForestInnRegion(rootRoom))
  worldBuilder.addRegion(await getForestRegion(rootRoom))

  return new Set([
    ...worldBuilder.getRooms(),
  ])
}

export async function newArena(root: Room, width: number, height: number, mobFactory) {
  const arena = new Arena(root, width, height, mobFactory)
  await arena.buildMatrix()

  return arena
}
