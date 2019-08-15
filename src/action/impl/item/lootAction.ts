import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {ItemEntity} from "../../../item/entity/itemEntity"
import {ItemType} from "../../../item/enum/itemType"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import match from "../../../support/matcher/match"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class LootAction extends Action {
  private static getVerb(isRequestCreator: boolean) {
    if (isRequestCreator) {
      return "get"
    }

    return "gets"
  }

  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory) {
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
        (item: ItemEntity) => item.itemType === ItemType.Corpse,
          Messages.Loot.NotACorpse)
      .require(
        (corpse: ItemEntity) =>
          corpse.container.inventory.items.find((item: ItemEntity) => match(item.name, request.getSubject())),
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
