import { Observer } from "../server/observers/observer"

export class DontExecuteTestObserver implements Observer {
  public notify() {
    throw new Error("this shouldn't execute")
  }
}
