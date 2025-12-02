Test api 

- main route : http://localhost:5000/api/v1

- Authentication
# login 
``` 
{
    "email":"sakibsoftvence@gmail.com",
    "password":"123456789"
}
```
-- output --
```
{
    "statusCode": 201,
    "success": true,
    "message": "Login User successfully",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzY2ZTY3Yy1jYmU1LTQ0ZmQtYWExNy1kNjdjYTMzMmM5YzEiLCJyb2xlIjoiQ0xJRU5UIiwidXNlckVtYWlsIjoic2FraWJzb2Z0dmVuY2VAZ21haWwuY29tIiwiY2xpZW50SWQiOiJmZmQ2ZjczYi03NThiLTRmZDAtYjdjYy0zODcxODMyZjc0Y2YiLCJpYXQiOjE3NjQxMjM0ODgsImV4cCI6MTc2NTQxOTQ4OH0.BepqOonfEkJtmpyuJSbR-vqj0Hc3PGOMjPcaIb-_I8E",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzY2ZTY3Yy1jYmU1LTQ0ZmQtYWExNy1kNjdjYTMzMmM5YzEiLCJyb2xlIjoiQ0xJRU5UIiwidXNlckVtYWlsIjoic2FraWJzb2Z0dmVuY2VAZ21haWwuY29tIiwiY2xpZW50SWQiOiJmZmQ2ZjczYi03NThiLTRmZDAtYjdjYy0zODcxODMyZjc0Y2YiLCJpYXQiOjE3NjQxMjM0ODgsImV4cCI6MTc2NDcyODI4OH0.q1XkJFP4bbym4z7nuzRZlTpDK6Iu4TYzcgqBpBuQjb8"
    }
}
```
<br>
<br>

# Create ClientEmployee / ClientManager / ClientViewer  

## Create manager ->
## Endpoints
**POST** `/api/v1/users/managers/create`

## Request body
```
{
  "name": "John Doe",
  "email": "john-m1@example.com",
  "phoneNumber": "25464654651",
  "password": "password123",
  "skills": [
    "Civil Eng",
    "Architect"
  ],
  "description": "Responsible for managing infrastructure projects",
  "joinedDate": "2025-10-11",
  "sendWelcomeEmail": true,
  "notifyProjectManager": false
}


```
## output
```
{
  "statusCode": 201,
  "success": true,
  "message": "Manager created successfully",
  "data": {
    "id": "33b051d3-5838-4a1b-90ca-89e4d3f1e871",
    "email": "john-m1@example.com",
    "phoneNumber": "25464654651",
    "name": "John Doe",
    "role": "MANAGER",
    "profileImage": null,
    "language": "ENGLISH",
    "timezone": null,
    "verification2FA": false,
    "status": false,
    "lastActive": false,
    "createdAt": "2025-12-02T03:49:29.276Z",
    "updatedAt": "2025-12-02T03:49:29.276Z",
    "userStatus": "ACTIVE"
  }
}
```

## Create   Employees ->
## Endpoints
**POST** `/api/v1/users/employees/create-employee`

## Request body
```
{
  "name": "John Doe",
  "email": "john-e1@example.com",
  "phoneNumber": "25464654658",
  "password": "password123",
  "skills": [
    "Civil Eng",
    "Architect"
  ],
  "description": "Responsible for managing infrastructure projects",
  "joinedDate": "2025-10-11",
  "sendWelcomeEmail": true,
  "notifyProjectManager": false
}


```
## output
```
{
  "statusCode": 201,
  "success": true,
  "message": " Employee created successfully",
  "data": {
    "id": "7dddbeca-18bf-444e-ac6e-d9a73e4a5a71",
    "email": "john-e1@example.com",
    "phoneNumber": "25464654658",
    "name": "John Doe",
    "role": "EMPLOYEE",
    "profileImage": null,
    "language": "ENGLISH",
    "timezone": null,
    "verification2FA": false,
    "status": false,
    "lastActive": false,
    "createdAt": "2025-12-02T04:00:29.638Z",
    "updatedAt": "2025-12-02T04:00:29.638Z",
    "userStatus": "ACTIVE"
  }
}
```

<br>
<br>
<br>

# Create Program API

## Endpoint
**POST** `/api/v1/program`

---

## Description
Creates a new program with name, description, priority, start date, and deadline.  
Returns the created program object with metadata and timestamps.


---

### Roles  
✅ only client can crete program  
✅ need valid  token  
✅ if not use token -> error responses (403 unauthorized, etc.)

---

## Request Body

```json
{
  "programName": "New Website Development",
  "datetime": "2025-10-12T05:19:26.155Z",
  "programDescription": "This program is for developing a new company website.",
  "priority": "HIGH",
  "deadline": "2026-10-12T05:19:26.155Z"
}

```
## Fields

| Name                 | Type                           | Required | Description                |
| -------------------- | ------------------------------ | -------- | -------------------------- |
| `programName`        | string                         | ✔️       | Title of the program.      |
| `datetime`           | datetime (ISO 8601)            | ✔️       | Program start date/time.   |
| `programDescription` | string                         | ✔️       | Details about the program. |
| `priority`           | enum (`LOW`, `MEDIUM`, `HIGH`) | ✔️       | Priority level.            |
| `deadline`           | datetime (ISO 8601)            | ✔️       | Deadline for completion.   |

## Output
```
{
  "statusCode": 201,
  "success": true,
  "message": "Request successful",
  "data": {
    "id": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
    "userId": "2c762992-fac3-46b8-8b7e-ea42aee9af8d",
    "programName": "New Website Development",
    "datetime": "2025-10-12T05:19:26.155Z",
    "programDescription": "This program is for developing a new company website.",
    "priority": "HIGH",
    "deadline": "2026-10-12T05:19:26.155Z",
    "progress": 0,
    "createdAt": "2025-12-02T02:44:23.956Z",
    "updatedAt": "2025-12-02T02:44:23.956Z"
  }
}

```

<br>
<br>
<br>

# Program

## 📘 GEt Program API

## Endpoint
**GET** `/api/v1/program`

## Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | number | ❌ | Page number for pagination (default: 1). |
| `limit` | number | ❌ | Number of items per page (default: 10). |
| `programName` | string | ❌ | Filter programs by name (case-insensitive, partial match). |
| `priority` | string (`LOW`, `MEDIUM`, `HIGH`) | ❌ | Filter by program priority. |
| `deadline` | string (ISO 8601) | ❌ | Filter by exact deadline date. |
| `progress` | number | ❌ | Filter by progress value (0–100). |
| `datetime` | string (ISO 8601) | ❌ | Filter by exact start date/time. |
| `tags` | array of strings | ❌ | Filter programs that include specific tags (case-insensitive). |

### Example Request
```http
GET /api/v1/programs?page=1&limit=10&programName=Website&priority=HIGH&tags=UI&tags=Backend
Authorization: Bearer <your_access_token>
```

## Output [ without tags and project ]
```
{
    "statusCode": 200,
    "success": true,
    "message": "Programs fetched successfully",
    "data": {
        "data": [
            {
                "id": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
                "userId": "2c762992-fac3-46b8-8b7e-ea42aee9af8d",
                "programName": "New Website Development",
                "datetime": "2025-10-12T05:19:26.155Z",
                "programDescription": "This program is for developing a new company website.",
                "priority": "HIGH",
                "deadline": "2026-10-12T05:19:26.155Z",
                "progress": 0,
                "createdAt": "2025-12-02T02:44:23.956Z",
                "updatedAt": "2025-12-02T02:44:23.956Z"
            }
        ],
        "meta": {
            "total": 1,
            "page": 1,
            "limit": 10,
            "totalPages": 1
        }
    }
}
```

<br>
<br>
<br>



## 📘 GET Program by id

## Endpoint
**GET** `/api/v1/program/id`


### Example Request
```http
GET /api/v1/programs?page=1&limit=10&programName=Website&priority=HIGH&tags=UI&tags=Backend
Authorization: Bearer <your_access_token>
```

## Output [ without tags and project ]
```
{
    "statusCode": 200,
    "success": true,
    "message": "Program fetched successfully",
    "data": {
        "id": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
        "userId": "2c762992-fac3-46b8-8b7e-ea42aee9af8d",
        "programName": "New Website Development",
        "datetime": "2025-10-12T05:19:26.155Z",
        "programDescription": "This program is for developing a new company website.",
        "priority": "HIGH",
        "deadline": "2026-10-12T05:19:26.155Z",
        "progress": 0,
        "createdAt": "2025-12-02T02:44:23.956Z",
        "updatedAt": "2025-12-02T02:44:23.956Z"
    }
}
```

<br>
<br>
<br>

# Tags for program 


##  Create tags

## Endpoint
**POST** `/api/v1/tags`

### Example Request 
```
{
  "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
  "name": "Important"
}
```
## Output 
```
{
    "statusCode": 201,
    "success": true,
    "message": "Tag created successfully",
    "data": {
        "id": "cmio0md6b0003u0qsom3i4rlm",
        "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
        "name": "Important",
        "createdAt": "2025-12-02T03:25:23.892Z",
        "updatedAt": "2025-12-02T03:25:23.892Z"
    }
}
```
<br>
<br>

## Get tags by program id 

## Endpoint
**GET** `/api/v1/tags/program/{programId}`

## Output 
```
{
    "statusCode": 200,
    "success": true,
    "message": "Tags fetched successfully",
    "data": [
        {
            "id": "cmio0md6b0003u0qsom3i4rlm",
            "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
            "name": "Important",
            "createdAt": "2025-12-02T03:25:23.892Z",
            "updatedAt": "2025-12-02T03:25:23.892Z"
        },
        {
            "id": "cmio0krq50001u0qs4levec03",
            "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
            "name": "Important",
            "createdAt": "2025-12-02T03:24:09.436Z",
            "updatedAt": "2025-12-02T03:24:09.436Z"
        }
    ]
}
```
<br>
<br>
<br>

# Projects
## create project
<br>

##  Project Model

## Description
Represents a **Project** in the system. Each project belongs to a program and has a manager, employees, tasks, and related activities. Contains metadata like status, priority, progress, dates, budget, and location.

---

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✔️ | Unique identifier (UUID). |
| `programId` | String | ✔️ | ID of the parent program. |
| `name` | String | ✔️ | Name of the project. |
| `description` | String | ✔️ | Detailed description of the project. |
| `status` | `ProjectStatus` | ✔️ | Current project status (default: `PENDING`). |
| `priority` | `Priority` | ✔️ | Project priority (`LOW`, `MEDIUM`, `HIGH`). |
| `deadline` | DateTime | ✔️ | Project deadline date. |
| `managerId` | String | ✔️ | ID of the assigned manager. |
| `startDate` | DateTime | ❌ | Optional project start date. |
| `progress` | Int | ❌ | Current progress percentage (0–100). |
| `chartList` | String[] | ❌ | List of charts related to the project. |
| `estimatedCompletedDate` | DateTime | ❌ | Estimated completion date. |
| `projectCompleteDate` | DateTime | ❌ | Actual project completion date. |
| `currentRate` | String | ❌ | Current rate or performance metric. |
| `budget` | String | ❌ | Project budget. |
| `createdAt` | DateTime |❌ | Record creation timestamp. |
| `updatedAt` | DateTime |❌ | Record last updated timestamp. |
| `latitude` | Float | ❌ | Geographic latitude for the project location. |
| `longitude` | Float | ❌ | Geographic longitude for the project location. |

---

## Relations

| Relation | Type | Description |
|----------|------|-------------|
| `program` | Program | The parent program of the project. On delete cascade. |
| `manager` | Manager | The manager assigned to the project. On delete cascade. |
| `projectEmployees` | ProjectEmployee[] | Employees assigned to the project. |
| `tasks` | Task[] | Tasks under the project. |
| `activities` | Activity[] | Activities related to the project. |
| `reviews` | Review[] | Reviews associated with the project. |
| `requestsToAddProjectMember` | RequestToAddProjectMember[] | Requests to add new members. |
| `submitted` | Submitted[] | Submitted documents or data related to the project. |
| `reminders` | Reminder[] | Project reminders or notifications. |
| `sheets` | Sheet[] | Related sheets or spreadsheets. |

---

## Notes
- `status` defaults to `PENDING` on creation.  
- `chartList` can be seeded with default charts.  
- Dates (`startDate`, `deadline`, `estimatedCompletedDate`, `projectCompleteDate`) must follow **ISO-8601 format**.  
- Relations enforce **cascade delete** for `program` and `manager`.  



##  Create Project 

## Endpoint
**POST** `/api/v1/project`
- Authorization: Bearer `client token need `

### Example Request 
```
{
  "message": "Weekly project status meeting",
  "repeatEvery": "WEEKLY",
  "repeatOnDays": [
    "MONDAY",
    "FRIDAY"
  ],
  "repeatOnDates": [
    1,
    15,
    30
  ],
  "remindBefore": 30,
  "isActive": true,
  "name": "Project Alpha",
  "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
  "description": "This is a project to do something important.",
  "priority": "HIGH",
  "deadline": "2025-12-31T23:59:59.999Z",
  "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
  "employeeIds": [
    "f5eea02f-10de-4f80-b0b2-3ab6395ef7a9"
  ],
  "startDate": "2025-01-01T00:00:00.000Z",
  "progress": 0,
  "chartList": [
    "string"
  ],
  "estimatedCompletedDate": "2025-12-02T03:58:36.335Z",
  "currentRate": "string",
  "budget": "string",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

## output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
```
{
  "statusCode": 201,
  "success": true,
  "message": "Project created successfully",
  "data": {
    "message": "Project created successfully",
    "project": {
      "id": "2d6aa864-ce29-471c-ba74-5637934aca0b",
      "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
      "name": "Project Alpha",
      "description": "This is a project to do something important.",
      "status": "PENDING",
      "priority": "HIGH",
      "deadline": "2025-12-31T23:59:59.999Z",
      "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
      "startDate": "2025-01-01T00:00:00.000Z",
      "progress": 0,
      "chartList": [],
      "estimatedCompletedDate": "2025-12-02T03:58:36.335Z",
      "projectCompleteDate": null,
      "currentRate": "string",
      "budget": "string",
      "createdAt": "2025-12-02T04:04:45.370Z",
      "updatedAt": "2025-12-02T04:04:45.370Z",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "manager": {
        "id": "245fea64-35b6-4c02-bb53-c81375cb6886",
        "userId": "33b051d3-5838-4a1b-90ca-89e4d3f1e871",
        "skills": [
          "Civil Eng",
          "Architect"
        ],
        "createdAt": "2025-12-02T03:49:29.282Z",
        "updatedAt": "2025-12-02T03:49:29.282Z",
        "description": "Responsible for managing infrastructure projects",
        "joinedDate": "2025-10-11",
        "user": {
          "id": "33b051d3-5838-4a1b-90ca-89e4d3f1e871",
          "email": "john-m1@example.com",
          "phoneNumber": "25464654651",
          "password": "$2b$10$BfwkNWnEqctaqOlC0l2steusV8xM6zy.6ijxaXfReKcQKAvhNh8y.",
          "name": "John Doe",
          "role": "MANAGER",
          "profileImage": null,
          "language": "ENGLISH",
          "timezone": null,
          "verification2FA": false,
          "status": false,
          "lastActive": false,
          "createdAt": "2025-12-02T03:49:29.276Z",
          "updatedAt": "2025-12-02T03:49:29.276Z",
          "userStatus": "ACTIVE"
        }
      },
      "program": {
        "id": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
        "userId": "2c762992-fac3-46b8-8b7e-ea42aee9af8d",
        "programName": "New Website Development",
        "datetime": "2025-10-12T05:19:26.155Z",
        "programDescription": "This program is for developing a new company website.",
        "priority": "HIGH",
        "deadline": "2026-10-12T05:19:26.155Z",
        "progress": 0,
        "createdAt": "2025-12-02T02:44:23.956Z",
        "updatedAt": "2025-12-02T02:44:23.956Z"
      },
      "projectEmployees": [
        {
          "id": "f5941684-4c4c-4132-8010-569360f58467",
          "projectId": "2d6aa864-ce29-471c-ba74-5637934aca0b",
          "employeeId": "f5eea02f-10de-4f80-b0b2-3ab6395ef7a9",
          "assignedAt": "2025-12-02T04:04:45.370Z",
          "employee": {
            "id": "f5eea02f-10de-4f80-b0b2-3ab6395ef7a9",
            "userId": "7dddbeca-18bf-444e-ac6e-d9a73e4a5a71",
            "createdAt": "2025-12-02T04:00:29.641Z",
            "updatedAt": "2025-12-02T04:00:29.641Z",
            "description": "Responsible for managing infrastructure projects",
            "joinedDate": "2025-10-11",
            "skills": [
              "Civil Eng",
              "Architect"
            ],
            "user": {
              "id": "7dddbeca-18bf-444e-ac6e-d9a73e4a5a71",
              "email": "john-e1@example.com",
              "phoneNumber": "25464654658",
              "password": "$2b$10$jCdNqvCS8znoh/5HBPNEvu5DbQNVkiivvl/hGTnRtjSPBQkRC31Ye",
              "name": "John Doe",
              "role": "EMPLOYEE",
              "profileImage": null,
              "language": "ENGLISH",
              "timezone": null,
              "verification2FA": false,
              "status": false,
              "lastActive": false,
              "createdAt": "2025-12-02T04:00:29.638Z",
              "updatedAt": "2025-12-02T04:00:29.638Z",
              "userStatus": "ACTIVE"
            }
          }
        }
      ]
    }
  }
}
```
</div>
</details>
<br>
<br>
<br>
 
# 📘 Get All Projects API

## Endpoint
**GET** `/api/v1/project` <br>
- Authorization: Bearer `client_access_token `



## Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | number | ❌ | Page number for pagination (default: 1). |
| `limit` | number | ❌ | Number of items per page (default: 12). If not 12, returns **all projects**. |
| `status` | enum (`PENDING`, `IN_PROGRESS`, `COMPLETED`, etc.) | ❌ | Filter by project status. |
| `priority` | enum (`LOW`, `MEDIUM`, `HIGH`) | ❌ | Filter by project priority. |
| `managerId` | string | ❌ | Filter by manager ID. |
| `programId` | string | ❌ | Filter by program ID. |
| `name` | string | ❌ | Filter by project name (case-insensitive partial match). |
| `startDate` | string (ISO 8601) | ❌ | Filter by project start date. |
| `endDate` | string (ISO 8601) | ❌ | Filter by project end date. |
| `progress` | number | ❌ | Filter by project progress (0–100). |
| `employeeId` | string | ❌ | Filter by assigned employee ID. |

---

### Example Request
```http
GET /api/v1/projects?page=1&limit=12&status=IN_PROGRESS&priority=HIGH&managerId=123&employeeId=456
Authorization: Bearer <client_access_token>
```
## output 

<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
```
{
  "statusCode": 200,
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "message": "Projects retrieved successfully",
    "projects": {
      "data": [
        {
          "id": "2d6aa864-ce29-471c-ba74-5637934aca0b",
          "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
          "name": "Project Alpha",
          "description": "This is a project to do something important.",
          "status": "PENDING",
          "priority": "HIGH",
          "deadline": "2025-12-31T23:59:59.999Z",
          "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
          "startDate": "2025-01-01T00:00:00.000Z",
          "progress": 0,
          "chartList": [],
          "estimatedCompletedDate": "2025-12-02T03:58:36.335Z",
          "projectCompleteDate": null,
          "currentRate": "string",
          "budget": "string",
          "createdAt": "2025-12-02T04:04:45.370Z",
          "updatedAt": "2025-12-02T04:04:45.370Z",
          "latitude": 37.7749,
          "longitude": -122.4194
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 1
    }
  }
}
```
</div>
</details>

<br>
<br>
<br>



#  Search Projects by Name API
## Endpoint
**GET** `/api/v1/project/search`

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | ✔️ | Search query for the project name. Partial and case-insensitive match. |
| `employeeId` | string | ❌ | Optional filter to return only projects assigned to a specific employee. |
| `page` | number | ❌ | Page number for pagination (default: 1). |
| `limit` | number | ❌ | Number of items per page (default: 10). |

---

### Example Request
```http
GET /api/v1/project/search?name=Website&page=1&limit=10&employeeId=f5eea02f-10de-4f80-b0b2-3ab6395ef7a9
Authorization: Bearer <client_access_token>
```

## Output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
{
  "statusCode": 200,
  "success": true,
  "message": "Projects found successfully",
  "data": {
    "message": "Projects found successfully",
    "projects": {
      "data": [
        {
          "id": "2d6aa864-ce29-471c-ba74-5637934aca0b",
          "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
          "name": "Project Alpha",
          "description": "This is a project to do something important.",
          "status": "PENDING",
          "priority": "HIGH",
          "deadline": "2025-12-31T23:59:59.999Z",
          "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
          "startDate": "2025-01-01T00:00:00.000Z",
          "progress": 0,
          "chartList": [],
          "estimatedCompletedDate": "2025-12-02T03:58:36.335Z",
          "projectCompleteDate": null,
          "currentRate": "string",
          "budget": "string",
          "createdAt": "2025-12-02T04:04:45.370Z",
          "updatedAt": "2025-12-02T04:04:45.370Z",
          "latitude": 37.7749,
          "longitude": -122.4194
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
}
</div>
</details>


<br>
<br>
<br>

# Search Projects by Id
## Endpoint
**GET** `/api/v1/project/{projectId}`


## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `projectId` | string | ✔️ | Search query for the project name. Partial and case-insensitive 
---

### Example Request
```http
GET /api/v1/project/f5eea02f-10de-4f80-b0b2-3ab6395ef7a9
Authorization: Bearer <client_access_token>
```

## Output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
{
  "statusCode": 200,
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "message": "Project retrieved successfully",
    "project": {
      "id": "2d6aa864-ce29-471c-ba74-5637934aca0b",
      "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
      "name": "Project Alpha",
      "description": "This is a project to do something important.",
      "status": "PENDING",
      "priority": "HIGH",
      "deadline": "2025-12-31T23:59:59.999Z",
      "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
      "startDate": "2025-01-01T00:00:00.000Z",
      "progress": 0,
      "chartList": [],
      "estimatedCompletedDate": "2025-12-02T03:58:36.335Z",
      "projectCompleteDate": null,
      "currentRate": "string",
      "budget": "string",
      "createdAt": "2025-12-02T04:04:45.370Z",
      "updatedAt": "2025-12-02T04:04:45.370Z",
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  }
}
</div>
</details>

<br>
<br>
<br>
## ->Search Projects by Id for find sheets
## Endpoint
**GET** `/api/v1/project/{id}/sheets`

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `projectId` | string | ✔️ | Search query for the project name. Partial and case-insensitive 
---

### Example Request
```http
GET /api/v1/project/2d6aa864-ce29-471c-ba74-5637934aca0b/sheets
Authorization: Bearer <client_access_token>
```

## Output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
{
  "statusCode": 200,
  "success": true,
  "message": "Sheets retrieved successfully",
  "data": [
    {
      "id": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
      "name": "My Sheet",
      "createdAt": "2025-12-02T04:04:45.385Z",
      "updatedAt": "2025-12-02T04:04:45.385Z",
      "chartId": "string",
      "projectId": "2d6aa864-ce29-471c-ba74-5637934aca0b"
    }
  ]
}
</div>
</details>

<br>
<br>
<br>


# Update project status
## Endpoint
**PATCH** `/api/v1/project/status`

## Example Req
```
{
  "projectId": "2d6aa864-ce29-471c-ba74-5637934aca0b",
  "status": "LIVE"
}
```

## Output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
{
  "statusCode": 200,
  "success": true,
  "message": "Project status updated to LIVE successfully",
  "data": {
    "message": "Project status updated to LIVE successfully",
    "project": {
      "id": "2d6aa864-ce29-471c-ba74-5637934aca0b",
      "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
      "name": "Project Alpha",
      "description": "This is a project to do something important.",
      "status": "LIVE",
      "priority": "HIGH",
      "deadline": "2025-12-31T23:59:59.999Z",
      "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
      "startDate": "2025-01-01T00:00:00.000Z",
      "progress": 0,
      "chartList": [],
      "estimatedCompletedDate": "2025-12-02T03:58:36.335Z",
      "projectCompleteDate": null,
      "currentRate": "string",
      "budget": "string",
      "createdAt": "2025-12-02T04:04:45.370Z",
      "updatedAt": "2025-12-02T04:44:13.751Z",
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  }
}
</div>
</details>

<br>
<br>
<br>
<br>



# Sheet


## Create cell
## Endpoint
**POST** `/api/v1/sheet/submit-cell`
- Authorization: Bearer `employee_access_token`

## Example Req
```
{
  "row": 2,
  "col": 3,
  "value": "10",
  "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32"
}
```
## Output
```
{
  "statusCode": 201,
  "success": true,
  "message": "Request successful",
  "data": {
    "id": "13a6da9b-e28b-43a0-a664-bf587f249352",
    "row": 2,
    "col": 3,
    "value": "10",
    "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
    "employeeId": "f5eea02f-10de-4f80-b0b2-3ab6395ef7a9",
    "createdAt": "2025-12-02T05:02:25.031Z",
    "updatedAt": "2025-12-02T05:02:25.031Z"
  }
}
```
<br>
<br>

## update cell
## Endpoint
**POST** `/api/v1/sheet/update-cell`
- Authorization: Bearer `employee_access_token`

## Example Req
```
[
  {
    "row": 1,
    "col": 2,
    "value": "5",
    "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32"
  }
]
```
## Output
```
{
  "statusCode": 201,
  "success": true,
  "message": "Request successful"
}
```
<br>
<br>

## Sheet save history
## Endpoint
**POST** `/api/v1/sheet/save-history`
- Authorization: Bearer `employee_access_token`

## Example Req
```
{
  "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32"
}
```
## Output
```
{
  "statusCode": 201,
  "success": true,
  "message": "Request successful",
  "data": [
    {
      "col": 2,
      "row": 1,
      "value": "5"
    }
  ] 
}
```
<br>
<br>

## Sheet find history
## Endpoint
**GET** `/api/v1/sheet/history/{sheetId}`
- Authorization: Bearer `employee_access_token`

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sheetId` | string | ✔️ | Search query for the sheet id  

## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Request successful",
  "data": [
    {
      "id": "99c7fd6e-7b75-4907-8879-8a64550cc9e4",
      "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
      "data": [
        {
          "col": 2,
          "row": 1,
          "value": "5"
        }
      ],
      "createdAt": "2025-12-02T05:07:54.066Z"
    }
  ]
}
```
<br>
<br>

## Sheet find snapshot
## Endpoint
**GET** `/api/v1/sheet/snapshot/{snapshotId}`
- Authorization: Bearer `employee_access_token`

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `snapshotId` | string | ✔️ | Search query for the snapshot id  

## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Request successful",
  "data": [
    {
      "col": 2,
      "row": 1,
      "value": "5"
    }
  ]
}
```
<br>
<br>

## Sheet find by project id 
## Endpoint
**GET** `/api/v1/sheet/project/{projectId}`
- Authorization: Bearer `employee_access_token`

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `projectId` | string | ✔️ | Search query for the project id  

## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Request successful",
  "data": [
    {
      "id": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
      "name": "My Sheet",
      "createdAt": "2025-12-02T04:04:45.385Z",
      "updatedAt": "2025-12-02T04:04:45.385Z",
      "chartId": "string",
      "projectId": "2d6aa864-ce29-471c-ba74-5637934aca0b",
      "cells": [
        {
          "id": "178f209c-4866-4463-ace6-a6880cc0e883",
          "row": 1,
          "col": 2,
          "value": "5",
          "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
          "createdAt": "2025-12-02T05:05:40.465Z",
          "updatedAt": "2025-12-02T05:05:40.465Z"
        }
      ]
    }
  ]
}
```
<br>
<br>

## Sheet find by sheet id 
## Endpoint
**GET** `/api/v1/sheet/sheet/{sheetId}`
- Authorization: Bearer `employee_access_token`

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sheetId` | string | ✔️ | Search query for the sheet id  

## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Request successful",
  "data": {
    "id": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
    "name": "My Sheet",
    "createdAt": "2025-12-02T04:04:45.385Z",
    "updatedAt": "2025-12-02T04:04:45.385Z",
    "chartId": "string",
    "projectId": "2d6aa864-ce29-471c-ba74-5637934aca0b",
    "cells": [
      {
        "id": "178f209c-4866-4463-ace6-a6880cc0e883",
        "row": 1,
        "col": 2,
        "value": "5",
        "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
        "createdAt": "2025-12-02T05:05:40.465Z",
        "updatedAt": "2025-12-02T05:05:40.465Z"
      }
    ]
  }
}
```
<br>
<br>
<br>
<br>


# Submitted
##  Create Submission API

## Endpoint
**POST** `/api/v1/submitted`
- Authorization: Bearer `employee_access_token`



## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `projectId` | string | ✔️ | ID of the project for which submission is made. |
| `sheetId` | string | ✔️ | ID of the sheet being submitted. |
| `submiteCells` | string[] | ❌ | Array of cell IDs included in the submission. |
| `information` | string | ✔️ | Additional information about the submission. |
| `submission` | string | ✔️ | Submission data content. |

### Example Request
```json
{
  "information": "This is the information",
  "submission": "This is the submission",
  "projectId": "2d6aa864-ce29-471c-ba74-5637934aca0b",
  "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
  "submiteCells": [
    "13a6da9b-e28b-43a0-a664-bf587f249352"
]
}
```
## Output
```
{
  "statusCode": 201,
  "success": true,
  "message": "Submission created successfully",
  "data": {
    "message": "Submission created successfully",
    "submission": {
      "id": "c3a59fa7-0ac5-441f-9661-cf35b9ced39a",
      "information": "This is the information",
      "submission": "This is the submission",
      "status": "PENDING",
      "employeeId": "f5eea02f-10de-4f80-b0b2-3ab6395ef7a9",
      "projectId": "2d6aa864-ce29-471c-ba74-5637934aca0b",
      "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
      "submiteCells": [
        "13a6da9b-e28b-43a0-a664-bf587f249352"
      ],
      "createdAt": "2025-12-02T05:49:22.613Z",
      "updatedAt": "2025-12-02T05:49:22.613Z"
    }
  }
}
```
<br>
<br>
<br>
<br>

##  Submissions Get

## Endpoint
**GET** `/api/v1/submitted`
- Authorization: Bearer `employee_access_token`

## Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | number | ❌ | Page number for pagination (default: 1). |
| `limit` | number | ❌ | Number of items per page (default: 10). |
| `search` | string | ❌ | Case-insensitive partial search by project name. |
| `status` | string | ❌ | Filter submissions by status (`PENDING`, `APPROVED`, `REJECTED`, etc.). |
| `startDate` | string | ❌ | Start of date range (ISO-8601 format). |
| `endDate` | string | ❌ | End of date range (ISO-8601 format). |

---

### Example Request
```http
GET /api/v1/submitted?page=1&limit=10&search=Alpha&status=PENDING&startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer employee_access_token
```
## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Submissions retrieved successfully",
  "data": {
    "message": "Submissions retrieved successfully",
    "AllSubmissions": {
      "data": [
        {
          "id": "c3a59fa7-0ac5-441f-9661-cf35b9ced39a",
          "information": "This is the information",
          "submission": "This is the submission",
          "status": "PENDING",
          "employeeId": "f5eea02f-10de-4f80-b0b2-3ab6395ef7a9",
          "projectId": "2d6aa864-ce29-471c-ba74-5637934aca0b",
          "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
          "submiteCells": [
            "13a6da9b-e28b-43a0-a664-bf587f249352"
          ],
          "createdAt": "2025-12-02T05:49:22.613Z",
          "updatedAt": "2025-12-02T05:49:22.613Z"
        }
      ],
      "meta": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1
      }
    }
  }
}
```
<br>
<br>


## find submitted by id 
## Endpoint
**GET** `/api/v1/submitted/{id}`
- Authorization: Bearer `employee_access_token`

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `submittedId` | string | ✔️ | Search query for the submitted id  

## Output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
  {
  "statusCode": 200,
  "success": true,
  "message": "Submission retrieved successfully",
  "data": {
    "message": "Submission retrieved successfully",
    "singleSubmitions": {
      "id": "c3a59fa7-0ac5-441f-9661-cf35b9ced39a",
      "information": "This is the information",
      "submission": "This is the submission",
      "status": "PENDING",
      "employeeId": "f5eea02f-10de-4f80-b0b2-3ab6395ef7a9",
      "projectId": "2d6aa864-ce29-471c-ba74-5637934aca0b",
      "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
      "submiteCells": [
        "13a6da9b-e28b-43a0-a664-bf587f249352"
      ],
      "createdAt": "2025-12-02T05:49:22.613Z",
      "updatedAt": "2025-12-02T05:49:22.613Z",
      "employee": {
        "id": "f5eea02f-10de-4f80-b0b2-3ab6395ef7a9",
        "userId": "7dddbeca-18bf-444e-ac6e-d9a73e4a5a71",
        "createdAt": "2025-12-02T04:00:29.641Z",
        "updatedAt": "2025-12-02T04:00:29.641Z",
        "description": "Responsible for managing infrastructure projects",
        "joinedDate": "2025-10-11",
        "skills": [
          "Civil Eng",
          "Architect"
        ]
      },
      "project": {
        "id": "2d6aa864-ce29-471c-ba74-5637934aca0b",
        "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
        "name": "Project Alpha",
        "description": "This is a project to do something important.",
        "status": "LIVE",
        "priority": "HIGH",
        "deadline": "2025-12-31T23:59:59.999Z",
        "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
        "startDate": "2025-01-01T00:00:00.000Z",
        "progress": 0,
        "chartList": [],
        "estimatedCompletedDate": "2025-12-02T03:58:36.335Z",
        "projectCompleteDate": null,
        "currentRate": "string",
        "budget": "string",
        "createdAt": "2025-12-02T04:04:45.370Z",
        "updatedAt": "2025-12-02T04:44:13.751Z",
        "latitude": 37.7749,
        "longitude": -122.4194
      }
    }
  }
}
</div>
</details>

<br>
<br>

## DELETE submitted 
## Endpoint
**DELETE** `/api/v1/submitted/{id}`
- Authorization: Bearer `employee_access_token`

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `submittedId` | string | ✔️ | Search query for the submitted id  

## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Submission deleted successfully",
  "data": {
    "message": "Submission deleted successfully"
  }
}
```
<br>
<br>

## Update  submitted  status
## Endpoint
**DELETE** `/api/v1/submitted/{id}/status`
- Authorization: Bearer `manager_access_token`

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `submittedId` | string | ✔️ | Search query for the submitted id  

## Example Req
```
{
  "status": "APPROVED"
}
```

## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Submission deleted successfully",
  "data": {
    "message": "Submission deleted successfully"
  }
}
```
<br>
<br>
<br>
<br>

# Client Management 

## Get client 
## Endpoint
**GET** `/api/v1/clients`
<!-- - Authorization: Bearer `client_access_token` -->

## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Request successful",
  "data": [
    {
      "id": "2c762992-fac3-46b8-8b7e-ea42aee9af8d",
      "userId": "2c07f056-5a9e-4b23-846d-ea62bfab3372",
      "email": "sakibsoftvence@gmail.com",
      "contactPersonName": null,
      "clientLogo": null,
      "favicon": null,
      "primaryColor": null,
      "secondaryColor": null,
      "footerText": null,
      "supportMail": null,
      "subdomain": null,
      "serverLocation": null,
      "category": "REALESTATE",
      "onboarding": false,
      "welcomeDashboard": false,
      "chartList": [],
      "storage": null,
      "threshold": null,
      "archiveAfter": null,
      "userWarning": false,
      "adminNote": null,
      "trialPeriod": null,
      "createdAt": "2025-11-30T23:57:59.610Z",
      "updatedAt": "2025-11-30T23:57:59.610Z"
    }
  ]
}
```
<br>
<br>


## get client by id
## Endpoint
**GET** `/api/v1/clients/{clientId}`
<!-- - Authorization: Bearer `client_access_token` -->

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `clientId` | string | ✔️ | Search query for the client id  


## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Request successful",
  "data": {
    "id": "2c762992-fac3-46b8-8b7e-ea42aee9af8d",
    "userId": "2c07f056-5a9e-4b23-846d-ea62bfab3372",
    "email": "sakibsoftvence@gmail.com",
    "contactPersonName": null,
    "clientLogo": null,
    "favicon": null,
    "primaryColor": null,
    "secondaryColor": null,
    "footerText": null,
    "supportMail": null,
    "subdomain": null,
    "serverLocation": null,
    "category": "REALESTATE",
    "onboarding": false,
    "welcomeDashboard": false,
    "chartList": [],
    "storage": null,
    "threshold": null,
    "archiveAfter": null,
    "userWarning": false,
    "adminNote": null,
    "trialPeriod": null,
    "createdAt": "2025-11-30T23:57:59.610Z",
    "updatedAt": "2025-11-30T23:57:59.610Z"
  }
}
```
<br>
<br>

## get All client files
## Endpoint
**GET** `/api/v1/clients/files`
<!-- - Authorization: Bearer `client_access_token` -->

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | string | ❌ | Search query for the user id  
| `name` | string | ❌ | Search query need file name 


## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "All files fetched successfully",
  "data": {
    "total": 1,
    "files": [
      {
        "id": "cmio74hqk0001u0hcjxq61lgf",
        "filename": "Screenshot 2025-12-01 103623.png",
        "url": "/uploads-file/png/Screenshot 2025-12-01 103623-1764656847283-7449641.png",
        "filePath": "C:\\projectnew\\lawalxlmonorepobackend-main\\uploads-file\\png\\Screenshot 2025-12-01 103623-1764656847283-7449641.png",
        "fileType": "png",
        "size": "14.37 KB",
        "uploadAt": "2025-12-02T06:27:27.308Z",
        "userId": "2c07f056-5a9e-4b23-846d-ea62bfab3372",
        "createdAt": "2025-12-02T06:27:27.308Z",
        "updatedAt": "2025-12-02T06:27:27.308Z",
        "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
        "sheet": {
          "id": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32",
          "name": "My Sheet",
          "createdAt": "2025-12-02T04:04:45.385Z",
          "updatedAt": "2025-12-02T04:04:45.385Z",
          "chartId": "string",
          "projectId": "2d6aa864-ce29-471c-ba74-5637934aca0b"
        }
      }
    ]
  }
}
```
<br>
<br>


## Upload file by client
## Endpoint
**POST** `/api/v1/clients/upload-file`
<!-- - Authorization: Bearer `client_access_token` -->

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | string | ✔️ | need user id  
| `sheetId` | string | ✔️ |need sheet id
| `file` | string | ✔️ | file for upload   


## Output
```
{
  "statusCode": 201,
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "cmio74hqk0001u0hcjxq61lgf",
    "filename": "Screenshot 2025-12-01 103623.png",
    "url": "/uploads-file/png/Screenshot 2025-12-01 103623-1764656847283-7449641.png",
    "filePath": "C:\\projectnew\\lawalxlmonorepobackend-main\\uploads-file\\png\\Screenshot 2025-12-01 103623-1764656847283-7449641.png",
    "fileType": "png",
    "size": 14713,
    "uploadAt": "2025-12-02T06:27:27.308Z",
    "userId": "2c07f056-5a9e-4b23-846d-ea62bfab3372",
    "createdAt": "2025-12-02T06:27:27.308Z",
    "updatedAt": "2025-12-02T06:27:27.308Z",
    "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32"
  }
}
```
<br>
<br>


## update file by id 
## Endpoint
**POST** `/api/v1/clients/file/id`
<!-- - Authorization: Bearer `client_access_token` -->

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `fileId` | string | ✔️ | need file id  
| `file` | string | ✔️ | need which file replace  
  


## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "File updated successfully",
  "data": {
    "id": "cmio74hqk0001u0hcjxq61lgf",
    "filename": "Screenshot 2025-12-01 065528.png",
    "url": "/uploads-file/png/Screenshot 2025-12-01 065528-1764657217928-714967885.png",
    "filePath": "C:\\projectnew\\lawalxlmonorepobackend-main\\uploads-file\\png\\Screenshot 2025-12-01 065528-1764657217928-714967885.png",
    "fileType": "png",
    "size": 150064,
    "uploadAt": "2025-12-02T06:27:27.308Z",
    "userId": "2c07f056-5a9e-4b23-846d-ea62bfab3372",
    "createdAt": "2025-12-02T06:27:27.308Z",
    "updatedAt": "2025-12-02T06:33:37.936Z",
    "sheetId": "f2e1e300-e1ad-42dc-ab74-c9800ba59e32"
  }
}
```
<br>
<br>

## Delete file by id 
## Endpoint
**POST** `/api/v1/clients/file/id`
<!-- - Authorization: Bearer `client_access_token` -->

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `fileId` | string | ✔️ | need file id 
  

## Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Request successful",
  "data": {
    "message": "1 file(s) deleted successfully"
  }
}

```
<br>
<br>
<br>
<br>

# Client Dashboard
## Dashboard overview
## Endpoint
**GET** `/api/v1/client-dashboard/overview-stack`
<!-- - Authorization: Bearer `client_access_token` -->

| `fileId` | string | ✔️ | need file id 
  
## Output

## Output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
{
  "statusCode": 200,
  "success": true,
  "message": "client stack fetch successfully",
  "data": {
    "programs": {
      "total": 3,
      "lastMonth": 2,
      "thisMonth": 1,
      "growth": 50
    },
    "projects": {
      "total": 6,
      "lastMonth": 0,
      "thisMonth": 6,
      "growth": 100
    },
    "liveProjects": {
      "total": 1,
      "lastMonth": 0,
      "thisMonth": 1,
      "growth": 100
    },
    "draftProjects": {
      "total": 0,
      "lastMonth": 0,
      "thisMonth": 0,
      "growth": 100
    },
    "pendingReview": {
      "total": 0,
      "lastMonth": 2,
      "thisMonth": 0,
      "grow": 100
    },
    "submitOverdue": {
      "total": 2,
      "laseMonth": 2,
      "lastMonth": 0,
      "grow": 100
    }
  }
}

</div>
</details>

<br>
<br>

## Dashboard activity
## Endpoint
**GET** `/api/v1/client-dashboard/overview-stack`
<!-- - Authorization: Bearer `client_access_token` -->

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | string | ❌ | need file id 
| `start date` | string | ❌ | need start date
| `end date` | string | ❌ | need end date
| `limit` | string | ❌ | need limit page
| `page` | string | ❌✔️ | how many page skip

<br>
<br>
<br>

## Dashboard activity
## Endpoint
**GET** `/api/v1/client-dashboard/timeline`
<!-- - Authorization: Bearer `client_access_token` -->

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | ❌ | search 
| `maxDays` | string | ❌ | need start date

# Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Timeline fetched successfully",
  "data": {
    "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
    "totalProjects": 6,
    "ProjectData": [
      {
        "id": "9b8cc2bf-87f3-4450-a87d-dbc46b4db2eb",
        "name": "Project Alpha",
        "startDate": "2025-01-01T00:00:00.000Z",
        "estimatedCompletedDate": "2025-12-31T23:59:59.999Z",
        "project_end_Date": null,
        "completionTime": 0,
        "overdueTime": 0,
        "savedTime": 0
      },
      {
        "id": "36df7d2c-f580-4cb0-9ba6-280adafaae56",
        "name": "Project gama",
        "startDate": "2025-01-01T00:00:00.000Z",
        "estimatedCompletedDate": "2025-12-31T23:59:59.999Z",
        "project_end_Date": null,
        "completionTime": 0,
        "overdueTime": 0,
        "savedTime": 0
      },
      {
        "id": "aeda044e-c35a-4dea-a012-0fe6dc2cae25",
        "name": "Project Bita",
        "startDate": "2025-01-01T00:00:00.000Z",
        "estimatedCompletedDate": "2025-07-31T23:59:59.999Z",
        "project_end_Date": "2025-12-02T09:02:52.781Z",
        "completionTime": 336,
        "overdueTime": 124,
        "savedTime": 0
      },
      {
        "id": "e67af1ed-957d-4b69-b748-14a05a17571f",
        "name": "Project overdue",
        "startDate": "2025-01-01T00:00:00.000Z",
        "estimatedCompletedDate": "2025-08-31T23:59:59.999Z",
        "project_end_Date": "2025-12-02T09:02:52.781Z",
        "completionTime": 336,
        "overdueTime": 93,
        "savedTime": 0
      },
      {
        "id": "48a63989-c810-4543-8148-1783232bf058",
        "name": "Project overdues",
        "startDate": "2025-05-01T00:00:00.000Z",
        "estimatedCompletedDate": "2025-12-31T23:59:59.999Z",
        "project_end_Date": "2025-10-02T09:02:52.781Z",
        "completionTime": 155,
        "overdueTime": 0,
        "savedTime": 91
      },
      {
        "id": "2d6aa864-ce29-471c-ba74-5637934aca0b",
        "name": "Project Alpha",
        "startDate": "2025-01-01T00:00:00.000Z",
        "estimatedCompletedDate": "2025-12-31T23:59:59.999Z",
        "project_end_Date": "2025-08-02T09:02:52.781Z",
        "completionTime": 214,
        "overdueTime": 0,
        "savedTime": 152
      }
    ]
  }
}
```
<br>
<br>

## Dashboard client status
## Endpoint
**GET** `/api/v1/client-dashboard/status`
<!-- - Authorization: Bearer `client_access_token` -->

## Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `week/month/year` | string | ❌ | default: month user  can filter other 

# Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "Project stack graph fetched successfully",
  "data": {
    "period": "month",
    "totalProjects": 6,
    "stack": {
      "inProgress": {
        "count": 1,
        "percentage": 16.67
      },
      "completed": {
        "count": 1,
        "percentage": 16.67
      },
      "overdue": {
        "count": 2,
        "percentage": 33.33
      },
      "notStarted": {
        "count": 2,
        "percentage": 33.33
      },
      "problem": {
        "count": 0,
        "percentage": 0
      }
    }
  }
}
Response head
```
<br>
<br>


## Dashboard overdue project 
## Endpoint
**GET** `/api/v1/client-dashboard/overdue`
<!-- - Authorization: Bearer `client_access_token` -->
 

# Output
```
{
  "statusCode": 200,
  "success": true,
  "message": "projects overdue fetch successfully",
  "data": {
    "projects": [
      {
        "id": "aeda044e-c35a-4dea-a012-0fe6dc2cae25",
        "name": "Project Bita",
        "startDate": "2025-01-01T00:00:00.000Z",
        "deadline": "2025-07-31T23:59:59.999Z",
        "projectCompleteDate": "2025-12-02T09:02:52.781Z",
        "overdue": "123day"
      },
      {
        "id": "e67af1ed-957d-4b69-b748-14a05a17571f",
        "name": "Project overdue",
        "startDate": "2025-01-01T00:00:00.000Z",
        "deadline": "2025-08-31T23:59:59.999Z",
        "projectCompleteDate": "2025-12-02T09:02:52.781Z",
        "overdue": "92day"
      }
    ]
  }
}
```
<br>
<br>
<br>
<br>


# Employee dashboard

# Employee find all project overdue and live
## Endpoint
**GET** `/api/v1/employeeDashboard/dashboard`
- Authorization: Bearer `employee_access_token`

## Output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
{
  "statusCode": 200,
  "success": true,
  "message": "Employee dashboard fetched successfully",
  "data": {
    "totalProjectsAssigned": 6,
    "totalSubmissions": 1,
    "totalReturns": 0,
    "liveProjects": {
      "count": 1,
      "projects": [
        {
          "id": "2d6aa864-ce29-471c-ba74-5637934aca0b",
          "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
          "name": "Project Alpha",
          "description": "This is a project to do something important.",
          "status": "LIVE",
          "priority": "HIGH",
          "deadline": "2025-12-31T23:59:59.999Z",
          "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
          "startDate": "2025-01-01T00:00:00.000Z",
          "progress": 0,
          "chartList": [],
          "estimatedCompletedDate": "2025-12-02T03:58:36.335Z",
          "projectCompleteDate": "2025-08-02T09:02:52.781Z",
          "currentRate": "string",
          "budget": "string",
          "createdAt": "2025-12-02T04:04:45.370Z",
          "updatedAt": "2025-12-02T09:23:48.944Z",
          "latitude": 37.7749,
          "longitude": -122.4194
        }
      ]
    },
    "overdueProjects": {
      "count": 2,
      "projects": [
        {
          "id": "aeda044e-c35a-4dea-a012-0fe6dc2cae25",
          "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
          "name": "Project Bita",
          "description": "This is a project to do something important.",
          "status": "OVERDUE",
          "priority": "HIGH",
          "deadline": "2025-07-31T23:59:59.999Z",
          "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
          "startDate": "2025-01-01T00:00:00.000Z",
          "progress": 0,
          "chartList": [],
          "estimatedCompletedDate": "2025-12-02T09:02:52.781Z",
          "projectCompleteDate": "2025-12-02T09:02:52.781Z",
          "currentRate": "string",
          "budget": "string",
          "createdAt": "2025-12-02T09:04:09.774Z",
          "updatedAt": "2025-12-02T09:20:47.730Z",
          "latitude": 37.7749,
          "longitude": -122.4194
        },
        {
          "id": "e67af1ed-957d-4b69-b748-14a05a17571f",
          "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
          "name": "Project overdue",
          "description": "This is a project to do something important.",
          "status": "OVERDUE",
          "priority": "HIGH",
          "deadline": "2025-08-31T23:59:59.999Z",
          "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
          "startDate": "2025-01-01T00:00:00.000Z",
          "progress": 0,
          "chartList": [],
          "estimatedCompletedDate": "2025-09-02T09:02:52.781Z",
          "projectCompleteDate": "2025-12-02T09:02:52.781Z",
          "currentRate": "string",
          "budget": "string",
          "createdAt": "2025-12-02T09:11:36.530Z",
          "updatedAt": "2025-12-02T09:20:57.122Z",
          "latitude": 37.7749,
          "longitude": -122.4194
        }
      ]
    }
  }
}
Response headers
</div>
</details>

<br>
<br>


# Employee all live project
## Endpoint
**GET** `/api/v1/employeeDashboard/dashboard/project/live`
- Authorization: Bearer `employee_access_token`

## Output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
{
  "statusCode": 200,
  "success": true,
  "message": "Live projects fetched successfully",
  "data": [
    {
      "id": "2d6aa864-ce29-471c-ba74-5637934aca0b",
      "programId": "2adc7a20-e2c4-41af-bc21-51e90d6abe00",
      "name": "Project Alpha",
      "description": "This is a project to do something important.",
      "status": "LIVE",
      "priority": "HIGH",
      "deadline": "2025-12-31T23:59:59.999Z",
      "managerId": "245fea64-35b6-4c02-bb53-c81375cb6886",
      "startDate": "2025-01-01T00:00:00.000Z",
      "progress": 0,
      "chartList": [],
      "estimatedCompletedDate": "2025-12-02T03:58:36.335Z",
      "projectCompleteDate": "2025-08-02T09:02:52.781Z",
      "currentRate": "string",
      "budget": "string",
      "createdAt": "2025-12-02T04:04:45.370Z",
      "updatedAt": "2025-12-02T09:23:48.944Z",
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  ]
}
</div>
</details>

<br>
<br>

#  submission return
## Endpoint
**GET** `/api/v1/employeeDashboard/dashboard/submission/return`
- Authorization: Bearer `employee_access_token`

## Output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
{
  "statusCode": 200,
  "success": true,
  "message": "Submission returns fetched successfully",
  "data": []
}
</div>
</details>
<br>

#  performance 
## Endpoint
**GET** `/api/v1/employeeDashboard/dashboard/sperformance`
- Authorization: Bearer `employee_access_token`

## Output
<details>
<summary>📄 Output JSON (click to expand)</summary>
<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 20px; margin-top: 10px ">
{
  "statusCode": 200,
  "success": true,
  "message": "Employee performance fetched successfully",
  "data": {
    "projects": {
      "currentMonth": 6,
      "previousMonth": 0,
      "percentageChange": "100%"
    },
    "submissions": {
      "currentMonth": 1,
      "previousMonth": 0,
      "percentageChange": "100%"
    },
    "returns": {
      "currentMonth": 0,
      "previousMonth": 0,
      "percentageChange": "0%"
    }
  }
}
</div>
</details>
<br>
<br>
