import {
    Controller,
    HttpCode,
    Post,
    UseGuards,
    Request,
    Body,
} from '@nestjs/common';
import { PageService } from './page.service';
import { AuthGuard } from '@nestjs/passport';
import { PageDto } from './dto/PageDto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserType } from '../../types/UserType';
import { Roles } from '../auth/decorator/roles.decorator';

@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('page')
export class PageController {
    constructor(private pageService: PageService) {}

    @Post('create')
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    async createPage(@Request() req, @Body() pageDto: PageDto) {
        await this.pageService.createPage(req.user, pageDto);
    }
}
