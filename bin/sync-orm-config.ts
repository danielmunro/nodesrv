import * as fs from "fs"
import { Connection } from "typeorm"
import { newInn, newTrail } from "../src/area/factory"
import { getConnection } from "../src/db/connection"
import { Direction } from "../src/room/constants"
import { getFreeDirection } from "../src/room/direction"
import { newRoom } from "../src/room/factory"

const ormConfig = JSON.parse(fs.readFileSync("ormconfig.json").toString())
ormConfig.synchronize = true
getConnection(ormConfig)
