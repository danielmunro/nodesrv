import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { MobEntity } from "../../mob/entity/mobEntity"
import { SpellType } from "../spellType"

@Entity()
export class Spell {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public spellType: SpellType

  @Column("integer")
  public level: number = 1

  @Column("integer")
  public levelObtained: number

  @ManyToOne(() => MobEntity, (mob) => mob.spells)
  public mob: MobEntity
}
