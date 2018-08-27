import { verify as passwordVerify } from "password-hash"

export default function verify(password: string, input: string) {
  return passwordVerify(password, input)
}
