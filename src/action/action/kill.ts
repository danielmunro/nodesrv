import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { ActionOutcome } from "../actionOutcome"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request

  return checkedRequest.respondWith(ActionOutcome.FightStarted).success(
    Messages.Kill.Success,
    { screamVerb: "scream", attackVerb: "attack", target: request.getTarget() },
    { screamVerb: "screams", attackVerb: "attacks", target: "you" },
  { screamVerb: "screams", attackVerb: "attacks", target: request.getTarget() })
}
