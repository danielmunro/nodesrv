import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Response from "../../../../messageExchange/response"
import RequestService from "../../../../messageExchange/service/requestService"
import {Types} from "../../../../support/types"
import {Messages} from "../../../constants"
import SimpleAction from "../../simpleAction"

@injectable()
export default class AutoSplitAction extends SimpleAction {
  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.AutoSplit, Messages.Help.NoActionHelpTextProvided)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    mob.playerMob.autoSplit = !mob.playerMob.autoSplit
    return requestService.respondWith().success(`Auto-split toggled ${mob.playerMob.autoSplit ? "on" : "off"}.`)
  }
}
