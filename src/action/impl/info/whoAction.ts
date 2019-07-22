import Check from "../../../check/check"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {RequestType} from "../../../request/enum/requestType"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import ClientService from "../../../server/service/clientService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class WhoAction extends Action {
  private static formatLevel(mob: MobEntity): string {
    return mob.level < 10 ? " " + mob.level : mob.level.toString()
  }

  constructor(private readonly clientService: ClientService) {
    super()
  }

  public check(): Promise<Check> {
    return Check.ok()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.Who
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith().info(
      this.clientService.getLoggedInMobs().reduce((previous: string, current: MobEntity) =>
        previous + "[" + WhoAction.formatLevel(current) + " " + current.race().formattedName +
        " " + current.specialization().getFormattedName() + "] " + current.name +
        " " + current.playerMob.title + "\n", "Who list:\n"))
  }
}
