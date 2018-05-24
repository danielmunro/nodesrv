import { Request } from "../../request/request"

export default function(request: Request): Promise<any> {
  return new Promise((resolve) =>
    resolve({
      message: "You are wearing:\n" +
        request.player.sessionMob.equipped.inventory.getItems().map((item) => item.name).join("\n"),
    }))
}
