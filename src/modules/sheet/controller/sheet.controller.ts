// import { Controller, Post, Body, Get, Param } from '@nestjs/common';
// import { SheetService } from '../service/sheet.service';
// import { UpdateCellDto } from '../dto/update-cell.dto';

// @Controller('sheet')
// export class SheetController {
//   constructor(private readonly sheetService: SheetService) {}

//   @Post('update-cells')
//   updateCells(@Body() updateCellDtos: UpdateCellDto[]) {
//     return this.sheetService.updateCells(updateCellDtos);
//   }

//   @Post('save-history')
//   saveHistory(@Body() { sheetId }: { sheetId: string }) {
//     return this.sheetService.saveHistory(sheetId);
//   }

//   @Get('history/:sheetId')
//   getSheetHistory(@Param('sheetId') sheetId: string) {
//     return this.sheetService.getSheetHistory(sheetId);
//   }

//   @Get('snapshot/:snapshotId')
//   getSnapshot(@Param('snapshotId') snapshotId: string) {
//     return this.sheetService.getSnapshot(snapshotId);
//   }

//   @Get(':sheetId')
//   getSheet(@Param('sheetId') sheetId: string) {
//     return this.sheetService.getSheet(sheetId);
//   }
// }

import { Controller, Post, Body, Get, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SheetService } from '../service/sheet.service';
import { UpdateCellDto } from '../dto/update-cell.dto';
import { CreateSubmittedCellDto } from '../dto/create-submitted-cell.dto';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';

@ApiTags('Sheet') // Groups all endpoints under "Sheet" in Swagger
@Controller('sheet')
@UseGuards(JwtAuthGuard)
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  @Post('submit-cell')
  @ApiOperation({ summary: 'Submit a single cell' })
  @ApiBody({ type: CreateSubmittedCellDto })
  @ApiResponse({ status: 201, description: 'Cell submitted successfully' })
  createSubmittedCell(@Body() createSubmittedCellDto: CreateSubmittedCellDto,  @Req() req: RequestWithUser ) {
     
     const  employeeId = req?.user?.employeeId
      if (!employeeId) {
    throw new UnauthorizedException('Employee ID missing. Only employees can submit cells.');
  }
    return this.sheetService.createSubmittedCell(createSubmittedCellDto,employeeId);
  }

  @Post('update-cells')
  @ApiOperation({ summary: 'Update multiple cells in a sheet' })
  @ApiBody({ type: [UpdateCellDto], description: 'List of cell updates' })
  @ApiResponse({ status: 200, description: 'Cells updated successfully' })
  updateCells(@Body() updateCellDtos: UpdateCellDto[]) {
    return this.sheetService.updateCells(updateCellDtos);
  }

  @Post('save-history')
  @ApiOperation({ summary: 'Save the current state of a sheet as history' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sheetId: { type: 'string', example: 'sheet_12345abc' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Sheet history saved successfully' })
  saveHistory(@Body() { sheetId }: { sheetId: string }) {
    return this.sheetService.saveHistory(sheetId);
  }

  @Get('history/:sheetId')
  @ApiOperation({ summary: 'Get all history snapshots for a given sheet' })
  @ApiParam({ name: 'sheetId', type: String, example: 'sheet_12345abc' })
  @ApiResponse({ status: 200, description: 'List of sheet history snapshots' })
  getSheetHistory(@Param('sheetId') sheetId: string) {
    return this.sheetService.getSheetHistory(sheetId);
  }

  @Get('snapshot/:snapshotId')
  @ApiOperation({ summary: 'Get a specific sheet snapshot by ID' })
  @ApiParam({ name: 'snapshotId', type: String, example: 'snapshot_98765xyz' })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested snapshot data',
  })
  getSnapshot(@Param('snapshotId') snapshotId: string) {
    return this.sheetService.getSnapshot(snapshotId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all sheets for a given project' })
  @ApiParam({ name: 'projectId', type: String, example: 'project_12345abc' })
  @ApiResponse({ status: 200, description: 'List of sheets for the project' })
  getSheetsByProjectId(@Param('projectId') projectId: string) {
    return this.sheetService.getSheetsByProjectId(projectId);
  }

  @Get(':sheetId')
  @ApiOperation({ summary: 'Get the current state of a sheet by ID' })
  @ApiParam({ name: 'sheetId', type: String, example: 'sheet_12345abc' })
  @ApiResponse({ status: 200, description: 'Returns the current sheet data' })
  getSheet(@Param('sheetId') sheetId: string) {
    return this.sheetService.getSheet(sheetId);
  }
}
