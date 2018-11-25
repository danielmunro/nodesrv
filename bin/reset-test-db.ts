import { Connection } from "typeorm"
import { getConnection } from "../src/support/db/connection"

getConnection().then(async (connection: Connection) => {
    await connection.synchronize(true)
})
