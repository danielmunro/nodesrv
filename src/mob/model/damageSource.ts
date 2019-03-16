import {Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"
import {DamageType} from "../../damage/damageType"

@Entity()
export default class DamageSource {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("boolean")
  public summon: boolean = false

  @Column("boolean")
  public charm: boolean = false

  @Column("boolean")
  public magic: boolean = false

  @Column("boolean")
  public weapon: boolean = false

  @Column("boolean")
  public bash: boolean = false

  @Column("boolean")
  public slash: boolean = false

  @Column("boolean")
  public pierce: boolean = false

  @Column("boolean")
  public fire: boolean = false

  @Column("boolean")
  public cold: boolean = false

  @Column("boolean")
  public lightning: boolean = false

  @Column("boolean")
  public acid: boolean = false

  @Column("boolean")
  public poison: boolean = false

  @Column("boolean")
  public negative: boolean = false

  @Column("boolean")
  public holy: boolean = false

  @Column("boolean")
  public energy: boolean = false

  @Column("boolean")
  public mental: boolean = false

  @Column("boolean")
  public disease: boolean = false

  @Column("boolean")
  public drowning: boolean = false

  @Column("boolean")
  public light: boolean = false

  @Column("boolean")
  public sound: boolean = false

  @Column("boolean")
  public wood: boolean = false

  @Column("boolean")
  public silver: boolean = false

  @Column("boolean")
  public iron: boolean = false

  @Column("boolean")
  public distraction: boolean = false

  public isDamageTypeActive(damageType: DamageType): boolean {
    switch (damageType) {
      case DamageType.Mental:
        return this.mental
      case DamageType.Bash:
        return this.bash
      default:
        return false
    }
  }
}
