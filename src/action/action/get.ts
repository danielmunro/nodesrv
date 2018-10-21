import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.ItemPresent)
  const container = checkedRequest.getCheckTypeResult(CheckType.ContainerPresent)

  checkedRequest.mob.inventory.addItem(item)

  const replacements = { item, container }
  const isContainer = !!container

  return checkedRequest.respondWith().success(
    getMessage(isContainer),
    { verb: getVerb(isContainer, true), ...replacements },
    { verb: getVerb(isContainer, false), ...replacements })
}

function getMessage(isFromContainer: boolean) {
  if (isFromContainer) {
    return Messages.Get.SuccessFromContainer
  }

  return Messages.Get.SuccessFromRoom
}

function getVerb(isFromContainer: boolean, isRequestCreator: boolean) {
  if (isFromContainer) {
    if (isRequestCreator) {
      return "get"
    }

    return "gets"
  }

  if (isRequestCreator) {
    return "pick up"
  }

  return "picks up"
}
