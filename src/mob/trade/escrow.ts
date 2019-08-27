import {ItemEntity} from "../../item/entity/itemEntity"
import {MobEntity} from "../entity/mobEntity"
import EscrowParticipant from "./escrowParticipant"
import {EscrowStatus} from "./escrowStatus"

export default class Escrow {
  private escrowStatus: EscrowStatus = EscrowStatus.Live

  constructor(private readonly participants: EscrowParticipant[]) {
    if (participants.length !== 2) {
      throw Error("escrow needs two participants")
    }
  }

  public approveForMob(mob: MobEntity) {
    for (const participant of this.participants) {
      if (participant.isMob(mob)) {
        participant.approve()
        if (this.isReadyToResolve()) {
          this.accept()
        }
        return
      }
    }
    throw new Error("mob cannot approve trade")
  }

  public addItemForMob(mob: MobEntity, item: ItemEntity) {
    this.resetAccept()
    for (const participant of this.participants) {
      if (participant.isMob(mob)) {
        participant.addItem(item)
        return
      }
    }
    throw new Error("mob cannot add item to trade")
  }

  public addGoldForMob(mob: MobEntity, gold: number) {
    this.resetAccept()
    for (const participant of this.participants) {
      if (participant.isMob(mob)) {
        participant.addGold(gold)
        return
      }
    }
    throw new Error("mob cannot add gold to trade")
  }

  public resolveTrade() {
    for (const participant of this.participants) {
      if (!participant.isApproved()) {
        this.reject()
        return
      }
    }
    this.accept()
  }

  public isParticipant(mob: MobEntity) {
    return !!this.participants.find(participant => participant.isMob(mob))
  }

  public isResolved() {
    return this.escrowStatus === EscrowStatus.Confirmed
  }

  private resetAccept() {
    this.participants.forEach(participant => participant.resetApproval())
  }

  private accept() {
    this.escrowStatus = EscrowStatus.Confirmed
    const p1 = this.participants[0]
    const p2 = this.participants[1]
    p1.collectFrom(p2)
    p2.collectFrom(p1)
  }

  private reject() {
    this.escrowStatus = EscrowStatus.Cancelled
    const p1 = this.participants[0]
    const p2 = this.participants[1]
    p1.collectFrom(p1)
    p2.collectFrom(p2)
  }

  private isReadyToResolve() {
    return this.escrowStatus === EscrowStatus.Live && this.participants.every(participant => participant.isApproved())
  }
}
