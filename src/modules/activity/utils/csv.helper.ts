export class CsvHelper {
  static generateActivitiesCsv(activities: any[]): string {
    const headers = 'Timestamp,User,Description,Project Name,IP Address';
    const rows = activities.map(
      (a) =>
        `${a.timestamp},"${a.user}","${a.description}","${a.projectName}","${a.ipAddress}"`,
    );
    return [headers, ...rows].join('\n');
  }
}
