import {injectable} from "inversify"
import {MobEntity} from "../../entity/mobEntity"
import Escrow from "../escrow"

@injectable()
export default class EscrowService {
  constructor(private escrows: Escrow[] = []) {}

  public addEscrow(escrow: Escrow) {
    this.escrows.push(escrow)
  }

  public findEscrowForMob(mob: MobEntity): Escrow | undefined {
    return this.escrows.find(e => e.isParticipant(mob))
  }

  public filterCompletedTransactions() {
    this.escrows = this.escrows.filter(e => !e.isResolved())
  }
}
