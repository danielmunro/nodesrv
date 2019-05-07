import {injectable} from "inversify"
import "reflect-metadata"
import Maybe from "../support/functional/maybe"
import {Weather} from "./enum/weather"
import {Region} from "./model/region"
import WeatherPattern from "./weatherPattern"

@injectable()
export default class WeatherService {
  private weatherPatterns: WeatherPattern[] = []

  public updateRegionWeather(region: Region, weather: Weather): void {
    const weatherPattern = this.weatherPatterns.find(w => w.region === region)
    if (weatherPattern) {
      weatherPattern.weather = weather
      return
    }

    this.weatherPatterns.push(
      new WeatherPattern(region, weather))
  }

  public getWeatherForRegion(region: Region): Weather | undefined {
    return new Maybe(this.weatherPatterns.find(w => w.region === region))
      .do(weatherPattern => weatherPattern.weather)
      .get()
  }
}
