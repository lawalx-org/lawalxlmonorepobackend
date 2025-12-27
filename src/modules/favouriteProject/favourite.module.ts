import { Module } from '@nestjs/common';
import { FavoriteController } from './controller/favourite.controller';
import { FavoriteProjectService } from './services/favourite.services';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteProjectService],
})
export class FavoriteModule {}
