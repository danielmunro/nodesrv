import { getConnection, initializeConnection } from "../src/db/connection"

beforeAll(async () => {
  await initializeConnection()
})

afterAll(async () => {
  await (await getConnection()).close()
})
