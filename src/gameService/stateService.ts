import {inject, injectable} from "inversify"
import {Mob} from "../mob/model/mob"
import {isAbleToSee} from "../mob/race/sight"
import {Weather} from "../region/enum/weather"
import {Region} from "../region/model/region"
import WeatherService from "../region/weatherService"
import {Types} from "../support/types"
import TimeService from "./timeService"

@injectable()
export default class StateService {
  constructor(
    @inject(Types.WeatherService) public readonly weatherService: WeatherService = new WeatherService(),
    @inject(Types.TimeService) public readonly timeService: TimeService = new TimeService()) {}

  public setTime(time: number) {
    this.timeService.setTime(time)
  }

  public incrementTime() {
    this.timeService.incrementTime()
  }

  public getWeatherForRegion(region: Region): Weather | undefined {
    return this.weatherService.getWeatherForRegion(region)
  }

  public getCurrentTime(): number {
    return this.timeService.getCurrentTime()
  }

  public canMobSee(mob: Mob, region: Region) {
    return isAbleToSee(
      mob.race().sight,
      this.getCurrentTime(),
      region.terrain,
      this.getWeatherForRegion(region) as Weather)
  }
}
