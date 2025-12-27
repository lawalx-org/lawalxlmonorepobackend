import {
    Controller, Post, Delete, Get, Body, Req,
    UseGuards,
    UnauthorizedException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
} from '@nestjs/swagger';
import { FavoriteProjectDto } from '../dto/favorite.dto';
import { FavoriteProjectService } from '../services/favourite.services';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { RequestWithUser } from 'src/types/RequestWithUser';



@ApiTags('Favorite Projects')
@UseGuards(JwtAuthGuard)
@Controller('favorites-project')
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteProjectService) { }

    @Post()
    @ApiOperation({ summary: 'Add project to favorites (max 5)' })
    add(@Req() req: RequestWithUser, @Body() dto: FavoriteProjectDto) {
        const userId = req.user.userId; 
        if (!userId) {
            throw new UnauthorizedException('User ID not found in token');
        }
        return this.favoriteService.add(userId, dto.projectId);
    }

    @Delete()
    remove(@Req() req: RequestWithUser, @Body() dto: FavoriteProjectDto) {
        return this.favoriteService.remove(req.user.userId, dto.projectId);
    }

    @Get('me')
    myFavorites(@Req() req: RequestWithUser) {
        return this.favoriteService.myFavorites(req.user.userId);
    }

}
