import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {Item} from "../../../item/model/item"
import ItemService from "../../../item/service/itemService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import {MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE, Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class GetAction extends Action {
  private static getMessage(isFromContainer: boolean) {
    if (isFromContainer) {
      return Messages.Get.SuccessFromContainer
    }

    return Messages.Get.SuccessFromRoom
  }

  private static getVerb(isFromContainer: boolean, isRequestCreator: boolean) {
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

  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly itemService: ItemService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return new Maybe(request.getContextAsInput().component)
      .do(() => this.getFromInventory(request))
      .or(() => this.getFromRoom(request))
      .get()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const [ item, container ] = requestService.getResults(
      CheckType.ItemPresent,
      CheckType.ContainerPresent)
    const replacements = { item, container }
    const isContainer = !!container
    requestService.addItemToMobInventory()

    return requestService.respondWith().success(
      GetAction.getMessage(isContainer),
      { verb: GetAction.getVerb(isContainer, true), ...replacements },
      { verb: GetAction.getVerb(isContainer, false), ...replacements })
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInRoom ]
  }

  public getRequestType(): RequestType {
    return RequestType.Get
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  private getFromInventory(request: Request) {
    const container = this.itemService.findItem(request.mob.inventory, request.getContextAsInput().component)

    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(container, ConditionMessages.All.Item.NotFound, CheckType.ContainerPresent)
      .require(() => this.itemService.findItem(container.container.inventory, request.getSubject()),
        ConditionMessages.All.Item.NotFound, CheckType.ItemPresent)
      .capture()
      .create()
  }

  private getFromRoom(request: Request) {
    const item = request.findItemInRoomInventory() as Item
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .require(() => item.isTransferable, MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
      .create()
  }
}
