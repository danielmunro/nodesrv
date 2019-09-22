import { inject, injectable } from "inversify"
import ClientService from "../../client/service/clientService"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobEntity} from "../../mob/entity/mobEntity"
import DeathEvent from "../../mob/event/deathEvent"
import {Round} from "../../mob/fight/round"
import {BodyPart} from "../../mob/race/enum/bodyParts"
import {Messages} from "../../server/observers/constants"
import {simpleD4} from "../../support/random/dice"
import {format} from "../../support/string"
import {Types} from "../../support/types"

@injectable()
export default class FatalityMessagesEventConsumer implements EventConsumer {
  private static getFatalityMessages(mobKilled: MobEntity, round: Round): string[] {
    const messages = []
    messages.push(format(Messages.Fight.DeathCry, mobKilled.name))
    simpleD4(() => messages.push(format(Messages.Fight.BloodSplatter, mobKilled.name)))
    if (round.bodyParts) {
      messages.push(...round.bodyParts.map(bodyPart =>
        FatalityMessagesEventConsumer.getBodyPartMessage(mobKilled, bodyPart)))
    }

    return messages
  }

  private static getBodyPartMessage(mob: MobEntity, bodyPart: BodyPart): string {
    const m = Messages.Fight.BodyParts
    switch (bodyPart) {
      case BodyPart.Guts:
        return format(m.Guts, mob.name, mob.gender)
      case BodyPart.Head:
        return format(m.Head, mob.name, mob.gender)
      case BodyPart.Heart:
        return format(m.Heart, mob.name, mob.gender)
      case BodyPart.Brains:
        return format(m.Brains, mob.name, mob.gender)
      default:
        return format(m.Default, mob.name, bodyPart, mob.gender)
    }
  }

  constructor(@inject(Types.ClientService) private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async isEventConsumable(event: DeathEvent): Promise<boolean> {
    return !!event.fight && !!event.round
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const mobKilled = event.death.mobKilled
    FatalityMessagesEventConsumer.getFatalityMessages(mobKilled, event.round as Round)
      .forEach(message => this.clientService.sendMessageInRoom(mobKilled, message))
    return EventResponse.none(event)
  }
}
