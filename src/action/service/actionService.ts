import {inject, injectable} from "inversify"
import "reflect-metadata"
import CheckedRequest from "../../check/checkedRequest"
import Cost from "../../check/cost/cost"
import {Client} from "../../client/client"
import InputEvent from "../../client/event/inputEvent"
import {EventType} from "../../event/enum/eventType"
import {createClientEvent, createCostEvent, createInputEvent, createMobEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import CostEvent from "../../mob/event/costEvent"
import {PlayerEntity} from "../../player/entity/playerEntity"
import {RequestType} from "../../request/enum/requestType"
import {ResponseStatus} from "../../request/enum/responseStatus"
import Request from "../../request/request"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import ClientService from "../../server/service/clientService"
import withValue from "../../support/functional/withValue"
import {Types} from "../../support/types"
import Action from "../impl/action"
import HelpAction from "../impl/info/helpAction"
import Skill from "../impl/skill"
import Spell from "../impl/spell"

@injectable()
export default class ActionService {
  constructor(
    @inject(Types.ClientService) public readonly clientService: ClientService,
    @inject(Types.EventService) public readonly eventService: EventService,
    @inject(Types.Actions) public readonly actions: Action[],
    @inject(Types.Skills) public readonly skills: Skill[],
    @inject(Types.Spells) public readonly spells: Spell[]) {
    const helpAction = this.actions.find(action => action instanceof HelpAction) as HelpAction
    if (helpAction) {
      helpAction.setActions(this.actions)
    }
  }

  public async handleRequest(client: Client, request: Request): Promise<Response> {
    if (!client.isLoggedIn()) {
      return this.handleNonLoggedInRequest(client, request)
    }
    const action = this.findActionForRequestType(request.getType())
    return withValue(await this.publishInputEvent(request, action), eventResponse =>
      eventResponse.isSatisfied() ?
        (eventResponse.event as InputEvent).response :
        this.handleAction(client, request, action))
  }

  private async handleNonLoggedInRequest(client: Client, request: Request) {
    const authResponse = await client.session.handleRequest(client, request as any)
    if (client.isLoggedIn()) {
      await this.eventService.publish(createMobEvent(EventType.MobCreated, client.getSessionMob()))
      await this.eventService.publish(createClientEvent(EventType.ClientLogin, client))
    }
    return new Response(
      request,
      ResponseStatus.Ok,
      new ResponseMessage(client.getSessionMob(), authResponse.message as string))
  }

  private findActionForRequestType(requestType: RequestType) {
    return this.actions.find(action =>
      action.isAbleToHandleRequestType(requestType)) as Action
  }

  private publishInputEvent(request: Request, action: Action) {
    return this.eventService.publish(createInputEvent(request, action))
  }

  private async handleAction(client: Client, request: Request, action: Action) {
    const response = await action.handle(request)
    if (response.request instanceof CheckedRequest) {
      await this.applyCosts(client.player, response.request.check.costs)
    }
    return response
  }

  private async applyCosts(player: PlayerEntity, costs: Cost[]): Promise<void> {
    const eventResponse = await this.eventService.publish(createCostEvent(player.sessionMob, costs))
    if (eventResponse.isModified()) {
      costs = (eventResponse.event as CostEvent).costs
    }
    costs.forEach(cost => cost.applyTo(player))
  }
}
