import { decrementAffects, pruneTimedOutAffects } from "../../affect/repository/affect"
import { Client } from "../../client/client"
import { Observer } from "./observer"

export class DecrementAffects implements Observer {
  public notify(clients: Client[]): Promise<any> {
    return decrementAffects().then(async () => await pruneTimedOutAffects())
  }
}
