import {Affect} from "../../affect/model/affect"
import MobEvent from "../../mob/event/mobEvent"

export default interface ApplyAbilityResponse {
  readonly affect?: Affect
  readonly event?: MobEvent
}
