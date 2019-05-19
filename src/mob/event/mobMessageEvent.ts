import MobEvent from "./mobEvent"

export default interface MobMessageEvent extends MobEvent {
  readonly message: string
}
