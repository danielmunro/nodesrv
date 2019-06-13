import {AffectEntity} from "../../affect/entity/affectEntity"
import MobEvent from "../../mob/event/mobEvent"
import ApplyAbilityResponse from "../response/applyAbilityResponse"

export function createApplyAbilityResponse(affect?: AffectEntity, event?: MobEvent): ApplyAbilityResponse {
  return { affect, event }
}

export function createApplyAbilityResponseWithEvent(event: MobEvent): ApplyAbilityResponse {
  return { event }
}
