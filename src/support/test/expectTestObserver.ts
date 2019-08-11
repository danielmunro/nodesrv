import { Observer } from "../../server/observers/observer"
import {Client} from "../../client/client"

export class ExpectTestObserver implements Observer {
  public notify(clients: Client[]) {
    expect(clients.length).toBe(1)
  }
}
