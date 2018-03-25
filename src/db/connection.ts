import { Connection, createConnection } from "typeorm"

let connection: Connection

export async function getConnection(options = null): Promise<any> {
  if (connection) {
    return new Promise((resolve) => resolve(connection))
  }
  return createConnection(options).then((conn) => connection = conn)
}
