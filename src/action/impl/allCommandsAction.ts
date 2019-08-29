import Action from "./action"

export default abstract class AllCommandsAction extends Action {
  protected actions: Action[]

  public setActions(actions: Action[]): void {
    this.actions = actions
  }
}
