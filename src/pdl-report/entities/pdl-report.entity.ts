import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PdlReportPosition } from '../../pdl-report-position/entities/pdl-report-position.entity';

@Entity()
export class PdlReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  user_id: number;

  @Column()
  date: string;

  @Column('float')
  totalSale: number;

  @Column('float')
  totalPayment: number;

  @Column('float')
  ozonCost: number;

  @Column('float')
  costPrice: number;

  @Column('float', { default: 0 })
  additionalClosures: number;

  @Column('float', { default: 0 })
  ozonCostToSale: number;

  @Column('float')
  income: number;

  @Column('float')
  margin: number;

  @Column('float')
  roi: number;

  @Column('float', { default: 0 })
  taxValue: number;

  @Column('integer', { default: 0 })
  taxPercentage: number;

  @JoinColumn({ name: 'reportPositions' })
  @OneToMany(
    () => PdlReportPosition,
    (pdlReportPosition) => pdlReportPosition.report_id,
    { cascade: true },
  )
  reportPositions: PdlReportPosition[];
}
