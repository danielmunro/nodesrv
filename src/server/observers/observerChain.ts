import { Client } from "../../client/client"
import { Observer } from "./observer"

export class ObserverChain implements Observer {
  private readonly observers: Observer[]

  constructor(observers: Observer[]) {
    this.observers = observers
  }

  public notify(clients: Client[]): void {
    this.observers.forEach((ob) => ob.notify(clients))
  }
}
