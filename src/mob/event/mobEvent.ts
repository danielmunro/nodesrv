import Event from "../../event/event"
import {Mob} from "../model/mob"

export default interface MobEvent extends Event {
  readonly mob: Mob
}
