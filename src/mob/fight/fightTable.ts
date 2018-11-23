import { Fight } from "./fight"

export default class FightTable {
  private fights: Fight[] = []

  public addFight(fight: Fight) {
    this.fights.push(fight)
  }

  public getFights(): Fight[] {
    return this.fights
  }

  public filterCompleteFights() {
    this.fights = this.fights.filter(fight => fight.isInProgress())
  }
}
