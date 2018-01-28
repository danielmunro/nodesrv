import * as model from "seraph-model"
import { PLAYER_DOMAIN } from "./../config"
import { db } from "./../db"

export default model(db, PLAYER_DOMAIN)
