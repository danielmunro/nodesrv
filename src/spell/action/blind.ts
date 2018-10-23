import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)

  target.addAffect(newAffect(AffectType.Blind, checkedRequest.mob.level / 10))

  return checkedRequest
    .respondWith()
    .success(
      Messages.Blind.Success,
      { verb: "is", target },
      { verb: "are", target: "you"},
      { verb: "is", target })
}
