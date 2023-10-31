import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { PrismaService } from './prisma/prisma.service'
import { UtilsModule } from './utils/utils.module'
import { UtilsService } from './utils/utils.service'

@Module({
  imports: [PrismaModule, UtilsModule],
  providers: [PrismaService, UtilsService],
  exports: [PrismaService, UtilsService],
})
export class CoreModule {}
