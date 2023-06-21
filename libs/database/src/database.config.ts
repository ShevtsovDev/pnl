import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfigInterface } from '@app/database/databaseConfig.interface';
import { PdlReport } from '../../../src/pdl-report/entities/pdl-report.entity';

export const getDatabaseConfig = ({
  host,
  port,
  username,
  password,
  database,
}: DatabaseConfigInterface): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
  autoLoadEntities: true,
  synchronize: true,
  entities: [PdlReport],
});
