import { Affect } from "../../affect/model/affect"
import { Request } from "../../request/request"

function reduceAffects(affects) {
  return affects.reduce(
    (previous, current: Affect) =>
      previous + "\n" + current.affectType + ": " + current.timeout + " hour" + (current.timeout === 1 ? "" : "s"),
    "")
}

export default function(request: Request): Promise<any> {
  return new Promise((resolve) => resolve({
    message: "Your affects:\n" + reduceAffects(request.player.sessionMob.affects),
  }))
}
