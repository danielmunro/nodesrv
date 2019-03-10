import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Mob } from "../../mob/model/mob"
import { SkillType } from "../skillType"

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public skillType: SkillType

  @Column("integer")
  public level: number = 1

  @Column("integer")
  public levelObtained: number

  @ManyToOne(() => Mob, mob => mob.skills)
  public mob: Mob

  public toString(): string {
    return this.skillType
  }
}
