import { Region } from "./model/region"
import { Terrain } from "./terrain"
import { Weather } from "./weather"

export default function newRegion(name: string, terrain: Terrain, weather: Weather = Weather.Clear) {
  const region = new Region()
  region.name = name
  region.terrain = terrain
  region.weather = weather

  return region
}
