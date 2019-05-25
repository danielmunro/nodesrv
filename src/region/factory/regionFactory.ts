import { Terrain } from "../enum/terrain"
import {Weather} from "../enum/weather"
import { Region } from "../model/region"
import WeatherPattern from "../weatherPattern"

export default function newRegion(name: string, terrain: Terrain) {
  const region = new Region()
  region.name = name
  region.terrain = terrain

  return region
}

export function newWeatherPattern(region: Region, weather: Weather): WeatherPattern {
  return { region, weather }
}
