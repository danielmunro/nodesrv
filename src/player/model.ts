import * as model from "seraph-model"
import { db } from "./../db/db"
import { Modellable, saveDataSet } from "./../db/model"
import { Domain } from "./../domain"

const Player = model(db, Domain.Player)

export function savePlayers(players: Modellable[]): Promise<any> {
  return saveDataSet(Player, players)
}

export default Player
