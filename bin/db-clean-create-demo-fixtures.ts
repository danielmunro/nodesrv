import * as fs from "fs"
import { newInn } from "../src/area/factory"
import { getConnection } from "./../src/db/connection"

const ormConfig = JSON.parse(fs.readFileSync("ormconfig.json").toString())
ormConfig.synchronize = true

fs.unlink("database.db", () =>
  getConnection(ormConfig).then((connection) =>
    newInn()))
