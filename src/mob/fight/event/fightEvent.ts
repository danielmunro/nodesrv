import Event from "../../../event/event"
import {Mob} from "../../model/mob"
import {Attack} from "../attack"
import {Fight} from "../fight"

export default interface FightEvent extends Event {
  readonly mob: Mob
  readonly fight: Fight
  readonly attacks: Attack[]
}
