import { Terrain } from "../../region/enum/terrain"
import { Region } from "../../region/model/region"

export function getTestRegion(): Region {
  const region = new Region()
  region.terrain = Terrain.Other
  region.name = "test region"

  return region
}
