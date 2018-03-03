import { Observer } from "./../server/observers/observer"

export class DontExecuteTestObserver implements Observer {
  public notify(clients) {
    throw new Error("this shouldn't execute")
  }
}
