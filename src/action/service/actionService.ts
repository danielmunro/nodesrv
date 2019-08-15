import {inject, injectable, multiInject} from "inversify"
import "reflect-metadata"
import CheckedRequest from "../../check/checkedRequest"
import Cost from "../../check/cost/cost"
import {Client} from "../../client/client"
import InputEvent from "../../client/event/inputEvent"
import {EventType} from "../../event/enum/eventType"
import {createClientEvent, createCostEvent, createInputEvent, createMobEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import ResponseMessageBuilder from "../../messageExchange/builder/responseMessageBuilder"
import {RequestType} from "../../messageExchange/enum/requestType"
import {ResponseStatus} from "../../messageExchange/enum/responseStatus"
import Request from "../../messageExchange/request"
import Response from "../../messageExchange/response"
import ResponseMessage from "../../messageExchange/responseMessage"
import CostEvent from "../../mob/event/costEvent"
import {PlayerEntity} from "../../player/entity/playerEntity"
import ClientService from "../../server/service/clientService"
import Maybe from "../../support/functional/maybe/maybe"
import withValue from "../../support/functional/withValue"
import {Types} from "../../support/types"
import Action from "../impl/action"
import HelpAction from "../impl/info/helpAction"
import Skill from "../impl/skill"
import Spell from "../impl/spell"

const errorNoAssociatedAction = "No action found to handle input"

@injectable()
export default class ActionService {
  constructor(
    @inject(Types.ClientService) public readonly clientService: ClientService,
    @inject(Types.EventService) public readonly eventService: EventService,
    @multiInject(Types.Actions) public readonly actions: Action[],
    @multiInject(Types.Skills) public readonly skills: Skill[],
    @multiInject(Types.Spells) public readonly spells: Spell[]) {
    withValue(
      this.actions.find(action => action instanceof HelpAction),
      helpAction => helpAction.setActions(this.actions))
  }

  public async handleRequest(client: Client, request: Request): Promise<Response> {
    return new Maybe(this.findActionForRequestType(request.getType()))
      .do(action =>
      client.isLoggedIn() ?
        this.handleAuthenticatedRequest(client, request, action) :
        this.handleUnauthenticatedRequest(client, request))
      .or(() => new Response(
        request,
        ResponseStatus.Error,
        new ResponseMessageBuilder(request.mob, errorNoAssociatedAction).create()))
      .get()
  }

  private async handleAuthenticatedRequest(client: Client, request: Request, action: Action) {
    return withValue(await this.publishInputEvent(request, action), eventResponse =>
      eventResponse.isSatisfied() ?
        (eventResponse.event as InputEvent).response :
        this.handleAction(client, request, action))
  }

  private async handleUnauthenticatedRequest(client: Client, request: Request) {
    const authResponse = await client.session.handleRequest(client, request)
    if (client.isLoggedIn()) {
      await this.eventService.publish(createMobEvent(EventType.MobCreated, client.getSessionMob()))
      await this.eventService.publish(createClientEvent(EventType.ClientLogin, client))
    }
    return new Response(
      request,
      ResponseStatus.Ok,
      new ResponseMessage(client.getSessionMob(), authResponse.message || ""))
  }

  private findActionForRequestType(requestType: RequestType): Action | undefined {
    return this.actions.find(action => action.isAbleToHandleRequestType(requestType))
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
