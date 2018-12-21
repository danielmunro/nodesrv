import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import {Item} from "../../item/model/item"
import Response from "../../request/response"
import {Exit} from "../../room/model/exit"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)

  if (target instanceof Exit) {
    return closeDoor(checkedRequest, target)
  } else if (target instanceof Item) {
    return closeContainer(checkedRequest, target)
  }

  return checkedRequest.respondWith().error("Unknown problem")
}

function closeContainer(checkedRequest, item) {
  item.container.isClosed = true

  return checkedRequest.respondWith().success(
    Messages.CloseContainer.Success, {
      closeVerb: "close",
      item: item.name,
    }, {
      closeVerb: "closes",
      item: item.name,
    })
}

function closeDoor(checkedRequest, exit) {
  exit.door.isClosed = true

  return checkedRequest.respondWith().success(
    Messages.CloseDoor.Success, {
      closeVerb: "close",
      direction: exit.direction,
      door: exit.door.name,
    }, {
      closeVerb: "closes",
      direction: exit.direction,
      door: exit.door.name,
    })
}
