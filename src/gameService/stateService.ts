import {Mob} from "../mob/model/mob"
import {isAbleToSee} from "../mob/race/sight"
import {Weather} from "../region/enum/weather"
import {Region} from "../region/model/region"
import WeatherService from "../region/weatherService"
import TimeService from "./timeService"

export default class StateService {
  constructor(
    public readonly weatherService: WeatherService,
    public readonly timeService: TimeService,
  ) {}

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
