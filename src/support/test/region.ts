import { Terrain } from "../../region/enum/terrain"
import {createRegion} from "../../region/factory/regionFactory"
import { Region } from "../../region/model/region"

export function getTestRegion(): Region {
  const region = createRegion()
  region.terrain = Terrain.Other
  region.name = "test region"

  return region
}
