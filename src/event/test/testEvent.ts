import Event from "../event"

export default interface TestEvent extends Event {
  readonly foo?: string
}
