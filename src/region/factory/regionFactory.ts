import { RegionEntity } from "../entity/regionEntity"
import { Terrain } from "../enum/terrain"
import {Weather} from "../enum/weather"
import WeatherPattern from "../weatherPattern"

export default function newRegion(name: string, terrain: Terrain) {
  const region = createRegion()
  region.name = name
  region.terrain = terrain

  return region
}

export function createRegion(): RegionEntity {
  const region = new RegionEntity()
  region.rooms = []
  return region
}

export function newWeatherPattern(region: RegionEntity, weather: Weather): WeatherPattern {
  return { region, weather }
}
