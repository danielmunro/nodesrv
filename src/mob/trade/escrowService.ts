import {injectable} from "inversify"
import {Mob} from "../model/mob"
import Escrow from "./escrow"

@injectable()
export default class EscrowService {
  constructor(private readonly escrows: Escrow[] = []) {}

  public addEscrow(escrow: Escrow) {
    this.escrows.push(escrow)
  }

  public findEscrowForMobs(mob1: Mob, mob2: Mob): Escrow | undefined {
    return this.escrows.find(e => e.isParticipant(mob1) && e.isParticipant(mob2))
  }
}
