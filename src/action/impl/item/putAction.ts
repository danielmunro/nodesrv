import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/enum/checkType"
import ItemService from "../../../item/itemService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import {MESSAGE_FAIL_CONTAINER_NOT_FOUND, Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class PutAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly itemService: ItemService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const containerName = request.getComponent()
    const mobInventory = request.mob.inventory
    const item = this.itemService.findItem(mobInventory, request.getSubject())
    const container = new Maybe(this.itemService.findItem(mobInventory, containerName))
      .do((i) => i)
      .or(() => request.findItemInRoomInventory(containerName))
      .get()

    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(item, ConditionMessages.All.Item.NotOwned, CheckType.HasItem)
      .capture()
      .require(container, MESSAGE_FAIL_CONTAINER_NOT_FOUND, CheckType.ContainerPresent)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const [ item, container ] = requestService.getResults(
      CheckType.HasItem,
      CheckType.ContainerPresent)
    container.container.addItem(item)
    return requestService.respondWith()
      .success(Messages.Put.Success, { item, container })
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInInventory ]
  }

  public getRequestType(): RequestType {
    return RequestType.Put
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
