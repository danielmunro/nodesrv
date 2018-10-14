import { Connection, createConnection, getConnectionOptions } from "typeorm"

let connection: Connection

export async function initializeConnection() {
  const options = await getConnectionOptions()

  if (process.env.ENV === "test") {
    Object.assign(options, { database: "nodesrvtest" })
  }

  connection = await createConnection(options)
}

export async function getConnection(): Promise<Connection> {
  return connection
}
