// user.mapper.ts
export function mapUserWithAssignedProjects(
  user: any,
  viewerProjectMap: Map<string, any>,
) {
  const {
    password,
    manager,
    employee,
    viewer,
    ...cleanUser
  } = user;

  const managerProjects = manager?.projects || [];

  const employeeProjects =
    employee?.projectEmployees?.map(
      (pe: any) => pe.project,
    ) || [];

  const viewerProjects =
    viewer?.projectId
      ?.map((id: string) => viewerProjectMap.get(id))
      .filter(Boolean) || [];

  const assignedProjects = Array.from(
    new Map(
      [...managerProjects, ...employeeProjects, ...viewerProjects].map(
        (p: any) => [p.id, p],
      ),
    ).values(),
  );

  return {
    ...cleanUser,
    assignedProjects,
  };
}
