import { injectable } from "inversify"
import "reflect-metadata"

@injectable()
export default abstract class EveryMessageEventConsumer {
  public async isEventConsumable(): Promise<boolean> {
    return true
  }
}
