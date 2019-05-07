import {injectable} from "inversify"
import "reflect-metadata"

const HOURS_IN_DAY = 24

@injectable()
export default class TimeService {
  constructor(private time: number = 0) {}

  public setTime(time: number) {
    this.time = time
  }

  public incrementTime() {
    this.time += 1
  }

  public getCurrentTime() {
    return this.time % HOURS_IN_DAY
  }
}
