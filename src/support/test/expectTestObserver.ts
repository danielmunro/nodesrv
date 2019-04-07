import { Observer } from "../../server/observers/observer"

export class ExpectTestObserver implements Observer {
  public notify(clients) {
    expect(clients.length).toBe(1)
  }
}
