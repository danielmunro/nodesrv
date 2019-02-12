import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import ItemService from "../../../item/itemService"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import Action from "../../action"
import {MESSAGE_FAIL_CONTAINER_NOT_FOUND, Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class PutAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly itemService: ItemService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const containerName = request.getContextAsInput().component
    const mobInventory = request.mob.inventory
    const item = this.itemService.findItem(mobInventory, request.getSubject())
    const container = new Maybe(this.itemService.findItem(mobInventory, containerName))
      .do((i) => i)
      .or(() => this.itemService.findItem(request.getRoom().inventory, containerName))
      .get()

    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(item, ConditionMessages.All.Item.NotOwned, CheckType.HasItem)
      .capture()
      .require(container, MESSAGE_FAIL_CONTAINER_NOT_FOUND, CheckType.ContainerPresent)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    const container = checkedRequest.getCheckTypeResult(CheckType.ContainerPresent)

    container.container.addItem(item)

    return checkedRequest.respondWith().success(Messages.Put.Success, { item, container })
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInInventory ]
  }

  public getRequestType(): RequestType {
    return RequestType.Put
  }
}
