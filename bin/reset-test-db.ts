import { Connection } from "typeorm"
import { getConnection } from "../src/db/connection"

getConnection().then(async (connection: Connection) => {
    await connection.synchronize(true)
})
