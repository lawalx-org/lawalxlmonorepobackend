// const ExcelJS = require('exceljs/dist/es5');

const PROJECT_NODE_BLUEPRINT = [
  { header: 'Project Name', key: 'projectName', width: 25 },
  { header: 'Node Name', key: 'taskName', width: 30 },
  { header: 'Parent Node', key: 'parentName', width: 30 },
  { header: 'Is Leaf', key: 'isLeaf', width: 10 },
  { header: 'Progress (%)', key: 'progress', width: 15 },
  { header: 'Computed Progress (%)', key: 'computedProgress', width: 20 },
  { header: 'Start Date', key: 'startDate', width: 15 },
  { header: 'Finish Date', key: 'finishDate', width: 15 },
];

async function downloadExcel(projects) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Project Nodes');
  sheet.columns = PROJECT_NODE_BLUEPRINT;

  projects.forEach((project) => {
    project.nodes.forEach((node) => {
      sheet.addRow({
        projectName: project.name,
        taskName: node.taskName,
        parentName: node.parentId || 'ROOT',
        isLeaf: node.isLeaf ? 'YES' : 'NO',
        progress: node.progress ?? '',
        computedProgress: node.computedProgress,
        startDate: node.startDate?.split('T')[0],
        finishDate: node.finishDate?.split('T')[0],
      });
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'project_nodes.xlsx';
  link.click();
}
