import {EventType} from "../../../event/enum/eventType"
import Event from "../../../event/interface/event"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import EscrowService from "../service/escrowService"

export default class CompletedEscrowEventConsumer implements EventConsumer {
  constructor(private readonly escrowService: EscrowService) {}

  public consume(event: Event): Promise<EventResponse> {
    this.escrowService.filterCompletedTransactions()
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Tick ]
  }
}
