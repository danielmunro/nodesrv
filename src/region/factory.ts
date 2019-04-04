import { Terrain } from "./enum/terrain"
import { Weather } from "./enum/weather"
import { Region } from "./model/region"

export default function newRegion(name: string, terrain: Terrain, weather: Weather = Weather.Clear) {
  const region = new Region()
  region.name = name
  region.terrain = terrain
  region.weather = weather

  return region
}
