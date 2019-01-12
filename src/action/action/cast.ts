import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import Response from "../../request/response"
import {Messages} from "./constants"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const spellDefinition = checkedRequest.getCheckTypeResult(CheckType.HasSpell)
  await spellDefinition.doAction(checkedRequest.request)
  return checkedRequest.respondWith().success(
      Messages.Cast.Success,
    { verb: "utter", spell: spellDefinition.spellType },
    { verb: "utters", spell: spellDefinition.spellType })
}
