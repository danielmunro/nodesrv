import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import ClientService from "../../../client/service/clientService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {Types} from "../../../support/types"
import SimpleAction from "../simpleAction"

@injectable()
export default class WhoAction extends SimpleAction {
  private static formatLevel(mob: MobEntity): string {
    return mob.level < 10 ? " " + mob.level : mob.level.toString()
  }

  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.ClientService) private readonly clientService: ClientService) {
    super(checkBuilderFactory, RequestType.Who)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith().info(
      this.clientService.getLoggedInMobs().reduce((previous: string, current: MobEntity) =>
        previous + "[" + WhoAction.formatLevel(current) + " " + current.race().formattedName +
        " " + current.specialization().getFormattedName() + "] " + current.name +
        " " + current.playerMob.title + "\n", "Who list:\n"))
  }
}
