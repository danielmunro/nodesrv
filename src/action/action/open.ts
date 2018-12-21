import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import {Item} from "../../item/model/item"
import Response from "../../request/response"
import {Exit} from "../../room/model/exit"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)

  if (target instanceof Exit) {
    return openDoor(checkedRequest, target)
  } else if (target instanceof Item) {
    return openContainer(checkedRequest, target)
  }

  return checkedRequest.respondWith().error("Unknown problem")
}

function openContainer(checkedRequest, item) {
  item.container.isClosed = false

  return checkedRequest.respondWith().success(
    Messages.OpenContainer.Success, {
      item: item.name,
      openVerb: "open",
    }, {
      item: item.name,
      openVerb: "opens",
    })
}

function openDoor(checkedRequest, exit: Exit) {
  exit.door.isClosed = false

  return checkedRequest.respondWith().success(
    Messages.OpenDoor.Success, {
      direction: exit.direction,
      door: exit.door.name,
      openVerb: "open",
    }, {
      direction: exit.direction,
      door: exit.door.name,
      openVerb: "opens",
    })
}
