import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/enum/checkType"
import {ItemType} from "../../../item/enum/itemType"
import {Item} from "../../../item/model/item"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
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

  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory
      .createCheckBuilder(request)
      .require(
        request.findItemInRoomInventory(request.getLastArg()),
        Messages.Loot.NoCorpse,
        CheckType.ContainerPresent)
      .capture()
      .require(
        (item: Item) => item.itemType === ItemType.Corpse,
          Messages.Loot.NotACorpse)
      .require(
        (corpse: Item) => corpse.container.inventory.items.find((item: Item) => match(item.name, request.getSubject())),
        Messages.Loot.CorpseDoesNotHaveItem,
        CheckType.ItemPresent)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const [ container, item ] = requestService.getResults(
      CheckType.ContainerPresent, CheckType.ItemPresent)
    const replacements = { item, container }
    requestService.addItemToMobInventory()

    return requestService.respondWith().success(
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
