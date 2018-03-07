import * as Neode from "neode"
import Attributes from "../attributes/model"
import Mob from "../mob/model"
import Player from "../player/model"
import Room from "../room/model"
import { DB_CONNECTION_STRING, DB_PASSWORD, DB_USER } from "./constants"

export default new Neode(DB_CONNECTION_STRING, DB_USER, DB_PASSWORD).with({
  Attributes,
  Mob,
  Player,
  Room,
})
