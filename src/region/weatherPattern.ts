import {RegionEntity} from "./entity/regionEntity"
import {Weather} from "./enum/weather"

export default interface WeatherPattern {
  readonly region: RegionEntity
  weather: Weather
}
