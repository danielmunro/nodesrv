import {AffectEntity} from "../../affect/entity/affectEntity"
import MobEvent from "../../mob/event/mobEvent"

export default interface ApplyAbilityResponse {
  readonly affect?: AffectEntity
  readonly event?: MobEvent
}
