import {inject, injectable} from "inversify"
import {MobEntity} from "../mob/entity/mobEntity"
import {isAbleToSee} from "../mob/race/sight"
import {RegionEntity} from "../region/entity/regionEntity"
import {Weather} from "../region/enum/weather"
import WeatherService from "../region/service/weatherService"
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

  public getWeatherForRegion(region: RegionEntity): Weather {
    return this.weatherService.getWeatherForRegion(region)
      .or(() => Weather.Clear)
      .get()
  }

  public getCurrentTime(): number {
    return this.timeService.getCurrentTime()
  }

  public canMobSee(mob: MobEntity, region: RegionEntity) {
    return isAbleToSee(
      mob.race().sight,
      this.getCurrentTime(),
      region.terrain,
      this.getWeatherForRegion(region))
  }
}
