import Event from "../../event/event"
import Death from "../fight/death"

export default interface DeathEvent extends Event {
  readonly death: Death
}
