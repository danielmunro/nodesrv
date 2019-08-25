import {injectable} from "inversify"
import {MobEntity} from "../entity/mobEntity"
import Escrow from "./escrow"

@injectable()
export default class EscrowService {
  constructor(private readonly escrows: Escrow[] = []) {}

  public addEscrow(escrow: Escrow) {
    this.escrows.push(escrow)
  }

  public findEscrowForMob(mob1: MobEntity): Escrow | undefined {
    return this.escrows.find(e => e.isParticipant(mob1))
  }
}
