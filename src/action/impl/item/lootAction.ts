import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {ItemType} from "../../../item/enum/itemType"
import ItemService from "../../../item/itemService"
import {Item} from "../../../item/model/item"
import Request from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import match from "../../../support/matcher/match"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class LootAction extends Action {
  private static getVerb(isRequestCreator: boolean) {
    if (isRequestCreator) {
      return "get"
    }

    return "gets"
  }

  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly itemService: ItemService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory
      .createCheckBuilder(request)
      .require(
        this.itemService.findItem(request.room.inventory, request.getLastArg()),
        Messages.Loot.NoCorpse,
        CheckType.ContainerPresent)
      .capture()
      .require(
        (item: Item) => item.itemType === ItemType.Corpse,
          Messages.Loot.NotACorpse)
      .require(
        (corpse: Item) => corpse.container.inventory.items.find((item: Item) => match(item.name, request.getSubject())),
        Messages.Loot.CorpseDoesNotHaveItem,
        CheckType.HasItem)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const [ container, item ] = checkedRequest.results(CheckType.ContainerPresent, CheckType.HasItem)

    checkedRequest.mob.inventory.addItem(item)

    const replacements = { item, container }

    return checkedRequest.respondWith().success(
      Messages.Get.SuccessFromContainer,
      { verb: LootAction.getVerb(true), ...replacements },
      { verb: LootAction.getVerb(false), ...replacements })
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInInventory, ActionPart.ItemInRoom ]
  }

  public getRequestType(): RequestType {
    return RequestType.Loot
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
