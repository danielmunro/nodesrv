import {Connection, createConnection, getConnectionOptions} from "typeorm"

let connection: Connection

export async function getConnection(): Promise<any> {
  const options = await getConnectionOptions()
  if (process.env.ENV === "test") {
    Object.assign(options, {database: `nodesrvtest`})
  }
  if (connection) {
    return Promise.resolve(connection)
  }
  return createConnection(options).then((conn) => connection = conn)
}
