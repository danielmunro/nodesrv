const HOURS_IN_DAY = 24

export default class TimeService {
  constructor(private time: number = 0) {}

  public incrementTime() {
    this.time += 1
  }

  public getCurrentTime() {
    return this.time % HOURS_IN_DAY
  }
}
