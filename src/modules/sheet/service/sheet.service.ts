import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCellDto } from '../dto/update-cell.dto';

@Injectable()
export class SheetService {
  private readonly logger = new Logger(SheetService.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateCells(updateCellDtos: UpdateCellDto[]) {
    const sheetId = updateCellDtos[0]?.sheetId;
    if (!sheetId) {
      return;
    }



    const cellUpserts = updateCellDtos.map((updateCellDto) => {
      const { sheetId, row, col, value } = updateCellDto;
      return this.prisma.cell.upsert({
        where: {
          sheetId_row_col: {
            sheetId,
            row,
            col,
          },
        },
        update: {
          value,
        },
        create: {
          sheetId,
          row,
          col,
          value,
        },
      });
    });

    try {
      await this.prisma.$transaction(cellUpserts);
    } catch (error) {
      this.logger.error('Error updating cells:', error);
      throw error;
    }
  }

  async saveHistory(sheetId: string) {
    const allCells = await this.prisma.cell.findMany({
      where: { sheetId },
    });

    return this.prisma.sheetSnapshot.create({
      data: {
        sheetId,
        data: allCells.map((cell) => ({
          row: cell.row,
          col: cell.col,
          value: cell.value,
        })),
      },
    });
  }

  async getSheetHistory(sheetId: string) {
    this.logger.log(`Fetching history for sheetId: ${sheetId}`);
    try {
      const history = await this.prisma.sheetSnapshot.findMany({
        where: {
          sheetId,
        },
      });
      this.logger.log(`Found ${history.length} history records.`);
      return history;
    } catch (error) {
      this.logger.error(`Failed to fetch history for sheetId: ${sheetId}`, error.stack);
      throw error;
    }
  }

  async getSheet(sheetId: string) {
    return this.prisma.sheet.findUnique({
      where: {
        id: sheetId,
      },
      include: {
        cells: true,
      },
    });
  }

  async getSnapshot(snapshotId: string) {
    return this.prisma.sheetSnapshot.findUnique({
      where: {
        id: snapshotId,
      },
    });
  }
}
