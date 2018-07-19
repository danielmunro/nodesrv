import { Region } from "../region/model/region"
import { Terrain } from "../region/terrain"
import { Weather } from "../region/weather"

export function getTestRegion(): Region {
  const region = new Region()
  region.terrain = Terrain.Other
  region.name = "test region"
  region.weather = Weather.Clear

  return region
}
