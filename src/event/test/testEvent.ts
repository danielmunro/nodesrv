import Event from "../interface/event"

export default interface TestEvent extends Event {
  readonly foo?: string
}
