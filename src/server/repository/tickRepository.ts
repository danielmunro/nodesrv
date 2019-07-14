import {EntityRepository, Repository} from "typeorm"
import {TickEntity} from "../entity/tickEntity"

@EntityRepository(TickEntity)
export default class TickRepository extends Repository<TickEntity> {}
