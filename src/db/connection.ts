import { Connection, createConnection } from "typeorm"

let connection: Connection

export async function getConnection(): Promise<any> {
  if (connection) {
    return new Promise((resolve) => resolve(connection))
  }
  return createConnection().then((conn) => connection = conn)
}
