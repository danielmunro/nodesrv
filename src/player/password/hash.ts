import { generate } from "password-hash"

const DefaultSaltLength = 16

export default function hash(password: string) {
  return generate(password, { saltLength: DefaultSaltLength })
}
