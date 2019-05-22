import {Affect} from "../../affect/model/affect"
import MobEvent from "../../mob/event/mobEvent"
import ApplyAbilityResponse from "../response/applyAbilityResponse"

export function createApplyAbilityResponse(affect?: Affect, event?: MobEvent): ApplyAbilityResponse {
  return { affect, event }
}

export function createApplyAbilityResponseWithEvent(event: MobEvent): ApplyAbilityResponse {
  return { event }
}
