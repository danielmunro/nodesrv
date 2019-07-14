import {injectable} from "inversify"
import "reflect-metadata"
import Maybe from "../../support/functional/maybe/maybe"
import {RegionEntity} from "../entity/regionEntity"
import {Weather} from "../enum/weather"
import {newWeatherPattern} from "../factory/regionFactory"
import WeatherPattern from "../weatherPattern"

@injectable()
export default class WeatherService {
  private weatherPatterns: WeatherPattern[] = []

  public updateRegionWeather(region: RegionEntity, weather: Weather): void {
    const weatherPattern = this.weatherPatterns.find(w => w.region === region)
    if (weatherPattern) {
      weatherPattern.weather = weather
      return
    }

    this.weatherPatterns.push(newWeatherPattern(region, weather))
  }

  public getWeatherForRegion(region: RegionEntity): Weather | undefined {
    return new Maybe(this.weatherPatterns.find(w => w.region === region))
      .do(weatherPattern => weatherPattern.weather)
      .get()
  }
}
