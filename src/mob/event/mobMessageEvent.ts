import Event from "../../event/event"
import {Mob} from "../model/mob"

export default interface MobMessageEvent extends Event {
  readonly mob: Mob
  readonly message: string
}
