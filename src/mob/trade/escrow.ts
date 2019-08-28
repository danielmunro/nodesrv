import {ItemEntity} from "../../item/entity/itemEntity"
import Maybe from "../../support/functional/maybe/maybe"
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
    this.maybeParticipant(mob)
      .do(participant => {
        participant.approve()
        if (this.isReadyToResolve()) {
          this.accept()
        }
      })
      .orThrow(new Error("mob cannot approve trade"))
      .get()
  }

  public addItemForMob(mob: MobEntity, item: ItemEntity) {
    this.resetAccept()
    this.maybeParticipant(mob)
      .do(participant => participant.addItem(item))
      .orThrow(new Error("mob cannot add item to trade"))
      .get()
  }

  public addGoldForMob(mob: MobEntity, gold: number) {
    this.resetAccept()
    this.maybeParticipant(mob)
      .do(participant => participant.addGold(gold))
      .orThrow(new Error("mob cannot add gold to trade"))
      .get()
  }

  public resolveTrade() {
    if (this.participants.every(participant => participant.isApproved())) {
      this.accept()
      return
    }
    this.reject()
  }

  public isParticipant(mob: MobEntity) {
    return !!this.participants.find(participant => participant.isMob(mob))
  }

  public isResolved() {
    return this.escrowStatus === EscrowStatus.Confirmed
  }

  private maybeParticipant(mob: MobEntity) {
    return new Maybe<EscrowParticipant>(this.participants.find(p => p.isMob(mob)))
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
