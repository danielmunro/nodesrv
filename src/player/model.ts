import * as model from "seraph-model"
import { db } from "./../db"
import { PLAYER_DOMAIN } from "./../domain"
import { Modellable, saveDataSet } from "./../model"

const Player = model(db, PLAYER_DOMAIN)

export function savePlayers(players: Modellable[]) {
  saveDataSet(Player, players)
}

export default Player
