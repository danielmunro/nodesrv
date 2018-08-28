import AreaBuilder from "./areaBuilder"

export default interface Shape {
  build(areaBuilder: AreaBuilder): Promise<void>
}
