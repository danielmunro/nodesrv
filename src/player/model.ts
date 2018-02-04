import * as model from "seraph-model"
import { db } from "./../db"
import { PLAYER_DOMAIN } from "./../domain"

export default model(db, PLAYER_DOMAIN)
