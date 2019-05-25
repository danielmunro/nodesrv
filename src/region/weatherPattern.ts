import {Weather} from "./enum/weather"
import {Region} from "./model/region"

export default interface WeatherPattern {
  readonly region: Region
  weather: Weather
}
