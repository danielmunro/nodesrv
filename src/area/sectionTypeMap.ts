import { SectionType } from "./sectionType"
import root from "./section/root"
import matrix from "./section/matrix"
import connection from "./section/connection"

export default [
  {
    section: root,
    type: SectionType.Root,
  },
  {
    section: connection,
    type: SectionType.Connection,
  },
  {
    section: matrix,
    type: SectionType.Matrix,
  },
]
