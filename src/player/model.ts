import * as model from "seraph-model"
import { db } from "./../db"
import { Domain } from "./../domain"
import { Modellable, saveDataSet } from "./../model"

const Player = model(db, Domain.Player)

export function savePlayers(players: Modellable[]) {
  saveDataSet(Player, players)
}

export default Player
