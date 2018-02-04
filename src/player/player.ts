import { Attributes } from "../attributes/attributes"
import { HitDam } from "../attributes/hitdam"
import { Stats } from "../attributes/stats"
import { Vitals } from "../attributes/vitals"
import { Client } from "../server/client"

class Player {
  private client: Client
  private attributes: Attributes = new Attributes(
    new HitDam(1, 2),
    new Stats(1, 1, 1, 1, 1, 1),
    new Vitals(20, 100, 100),
  )

  constructor(client) {
    this.client = client
  }
}
