import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { MobEntity } from "../../mob/entity/mobEntity"
import { SpellType } from "../spellType"

@Entity()
export class SpellEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public spellType: SpellType

  @Column({ default: 1 })
  public level: number

  @Column()
  public levelObtained: number

  @ManyToOne(() => MobEntity, (mob) => mob.spells)
  public mob: MobEntity
}
