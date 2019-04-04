import { Terrain } from "./enum/terrain"
import { Region } from "./model/region"

export default function newRegion(name: string, terrain: Terrain) {
  const region = new Region()
  region.name = name
  region.terrain = terrain

  return region
}
