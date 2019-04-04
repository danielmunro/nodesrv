import {Weather} from "./enum/weather"
import {Region} from "./model/region"

export default class WeatherPattern {
  constructor(
    public readonly region: Region,
    public weather: Weather,
  ) {}
}
