import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USERNAME ?? 'ledger',
      password: process.env.DB_PASSWORD ?? 'ledger',
      database: process.env.DB_NAME ?? 'pattern_ledger',
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
