import Event from "../../event/interface/event"
import Death from "../fight/death"

export default interface DeathEvent extends Event {
  readonly death: Death
}
