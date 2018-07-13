import { Region } from "./model/region"
import { Terrain } from "./terrain"

export default function newRegion(name: string, terrain: Terrain) {
  const region = new Region()
  region.name = name
  region.terrain = terrain

  return region
}
