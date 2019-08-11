import {Client} from "../../client/client"
import { Observer } from "../../server/observers/observer"

export class ExpectTestObserver implements Observer {
  public notify(clients: Client[]) {
    expect(clients.length).toBe(1)
  }
}
