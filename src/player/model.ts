import * as model from "seraph-model"
import { db } from "./../db"
import { PLAYER_DOMAIN } from "./../domain"
import { saveModels as parentSaveAllModels } from "./../model"

const Player = model(db, PLAYER_DOMAIN)

export function saveModels(models) {
  console.log(models)
  parentSaveAllModels(Player, models, () => {})
}

export default Player
