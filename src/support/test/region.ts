import { RegionEntity } from "../../region/entity/regionEntity"
import { Terrain } from "../../region/enum/terrain"
import {createRegion} from "../../region/factory/regionFactory"

export function getTestRegion(): RegionEntity {
  const region = createRegion()
  region.terrain = Terrain.Other
  region.name = "test region"

  return region
}
