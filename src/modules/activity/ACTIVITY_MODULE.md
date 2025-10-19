# Activity Module Documentation

## 📋 সূচিপত্র (Table of Contents)

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [How to Use](#how-to-use)
6. [Activity Creation Flow](#activity-creation-flow)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## 🎯 Overview

Activity Module হলো একটি সম্পূর্ণ Activity Logging System যা NestJS backend এ তৈরি করা হয়েছে। এটি ব্যবহারকারীদের সকল কার্যক্রম ট্র্যাক করে এবং বিভিন্ন ফিল্টার, সার্চ, পেজিনেশন এবং এক্সপোর্ট সুবিধা প্রদান করে।

### ✨ Key Features

- ✅ Complete activity logging with 18 action types
- ✅ Advanced filtering (user, project, date range, search)
- ✅ Pagination with customizable limits
- ✅ Multi-field search functionality
- ✅ Date range presets (today, yesterday, last 7/30/90 days)
- ✅ Export functionality (CSV/JSON ready)
- ✅ IP address tracking (optional)
- ✅ Metadata support for additional context
- ✅ Comprehensive error handling
- ✅ JWT authentication protected

---

## 🏗️ Architecture

### Module Structure

```
src/modules/activity/
├── controller/
│   └── activity.controller.ts      # API endpoints
├── service/
│   └── activity.service.ts         # Business logic
├── dto/
│   ├── query-activity.dto.ts       # Query parameters validation
│   ├── activity-response.dto.ts    # Response structure
│   └── param-validation.dto.ts     # Route params validation
├── helpers/
│   └── date-range.helper.ts        # Date range utilities
└── activity.module.ts              # Module definition
```

### Dependencies

- **PrismaService**: Database operations
- **JWT Guard**: Authentication
- **Global Exception Filter**: Error handling
- **Transform Interceptor**: Response formatting

---

## 🗄️ Database Schema

### Activity Model

```prisma
model Activity {
  id          String              @id @default(uuid())
  userId      String
  timestamp   DateTime            @default(now())
  description String
  projectId   String
  ipAddress   String?
  actionType  ActivityActionType
  metadata    Json?

  user        User                @relation(fields: [userId], references: [id])
  project     Project             @relation(fields: [projectId], references: [id])
}
```

### ActivityActionType Enum (18 Types)

```typescript
enum ActivityActionType {
  ASSIGNEE_ADDED          // কাউকে assign করা হয়েছে
  ASSIGNEE_REMOVED        // Assignee সরানো হয়েছে
  FILE_ADDED              // ফাইল যুক্ত করা হয়েছে
  FILE_REMOVED            // ফাইল মুছে ফেলা হয়েছে
  LINK_ADDED              // লিংক যুক্ত করা হয়েছে
  LINK_REMOVED            // লিংক মুছে ফেলা হয়েছে
  DUE_DATE_CHANGED        // Due date পরিবর্তন করা হয়েছে
  PROGRESS_CHANGED        // Progress আপডেট করা হয়েছে
  PRIORITY_CHANGED        // Priority পরিবর্তন করা হয়েছে
  STATUS_CHANGED          // Status পরিবর্তন করা হয়েছে
  TASK_CREATED            // নতুন task তৈরি করা হয়েছে
  TASK_UPDATED            // Task আপডেট করা হয়েছে
  TASK_DELETED            // Task মুছে ফেলা হয়েছে
  COMMENT_ADDED           // Comment যুক্ত করা হয়েছে
  COMMENT_UPDATED         // Comment আপডেট করা হয়েছে
  COMMENT_DELETED         // Comment মুছে ফেলা হয়েছে
  PROJECT_CREATED         // নতুন project তৈরি করা হয়েছে
  PROJECT_UPDATED         // Project আপডেট করা হয়েছে
}
```

---

## 🔌 API Endpoints

### 1. Get All Activities (Paginated)

**Endpoint**: `GET /activities`

**Authentication**: Required (JWT)

**Query Parameters**:

| Parameter | Type   | Required | Default | Description                                     |
| --------- | ------ | -------- | ------- | ----------------------------------------------- |
| page      | number | No       | 1       | Page number                                     |
| limit     | number | No       | 20      | Items per page (max 100)                        |
| userId    | string | No       | -       | Filter by user ID (UUID)                        |
| projectId | string | No       | -       | Filter by project ID (UUID)                     |
| search    | string | No       | -       | Search in description, user, project, IP        |
| dateRange | enum   | No       | -       | Preset: today, yesterday, last7, last30, last90 |
| startDate | string | No       | -       | Custom start date (ISO 8601)                    |
| endDate   | string | No       | -       | Custom end date (ISO 8601)                      |

**Example Request**:

```bash
GET /activities?page=1&limit=20&projectId=abc-123&dateRange=last7&search=file
```

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "user": {
        "id": "user-123",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "description": "Added a new file to the project",
      "projectName": "Website Redesign",
      "ipAddress": "192.168.1.1",
      "actionType": "FILE_ADDED",
      "metadata": {
        "fileName": "design.pdf",
        "fileSize": 2048576
      }
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

### 2. Get Activity by ID

**Endpoint**: `GET /activities/:id`

**Authentication**: Required (JWT)

**Path Parameters**:

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| id        | string | Yes      | Activity UUID |

**Example Request**:

```bash
GET /activities/550e8400-e29b-41d4-a716-446655440000
```

**Response** (200 OK):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg"
  },
  "description": "Added a new file to the project",
  "projectName": "Website Redesign",
  "ipAddress": "192.168.1.1",
  "actionType": "FILE_ADDED",
  "metadata": {
    "fileName": "design.pdf",
    "fileSize": 2048576
  }
}
```

**Error Response** (404):

```json
{
  "statusCode": 404,
  "message": "Activity not found",
  "error": "Not Found"
}
```

---

### 3. Get User Activities

**Endpoint**: `GET /activities/user/:userId`

**Authentication**: Required (JWT)

**Path Parameters**:

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| userId    | string | Yes      | User UUID   |

**Query Parameters**:

| Parameter | Type    | Required | Default | Description                    |
| --------- | ------- | -------- | ------- | ------------------------------ |
| page      | number  | No       | 1       | Page number                    |
| limit     | number  | No       | 20      | Items per page (max 100)       |
| search    | string  | No       | -       | Search in description, project |
| dateRange | enum    | No       | -       | Preset date range              |
| startDate | string  | No       | -       | Custom start date              |
| endDate   | string  | No       | -       | Custom end date                |
| includeIp | boolean | No       | false   | Include IP address in response |

**Example Request**:

```bash
GET /activities/user/user-123?page=1&limit=10&includeIp=true&dateRange=last30
```

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "activity-1",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "description": "Created a new task",
      "projectName": "Website Redesign",
      "actionType": "TASK_CREATED",
      "ipAddress": "192.168.1.1",
      "metadata": {
        "taskId": "task-456",
        "taskTitle": "Design homepage"
      }
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "role": "ADMIN"
    }
  }
}
```

**Note**:

- User info শুধুমাত্র `meta.user` তে একবার আসে, প্রতিটি activity item এ আসে না
- `includeIp=true` না দিলে IP address response এ আসবে না

---

### 4. Export Activities

**Endpoint**: `GET /activities/export`

**Authentication**: Required (JWT)

**Query Parameters**: Same as "Get All Activities" (except page & limit)

**Limits**:

- Maximum 10,000 records
- Throws error if no data found
- Throws error if result exceeds 10,000 records

**Example Request**:

```bash
GET /activities/export?projectId=abc-123&dateRange=last30
```

**Response** (200 OK):

```json
[
  {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "user": "John Doe",
    "description": "Added a new file to the project",
    "projectName": "Website Redesign",
    "ipAddress": "192.168.1.1"
  },
  {
    "timestamp": "2024-01-14T15:20:00.000Z",
    "user": "Jane Smith",
    "description": "Changed task priority to High",
    "projectName": "Website Redesign",
    "ipAddress": "192.168.1.2"
  }
]
```

**Error Responses**:

```json
// No data found
{
  "statusCode": 404,
  "message": "No activities found to export",
  "error": "Not Found"
}

// Too many records
{
  "statusCode": 400,
  "message": "Too many records to export. Please apply more specific filters.",
  "error": "Bad Request"
}
```

---

## 🚀 How to Use

### Frontend Integration Example

#### 1. Fetch Activities with Filters

```typescript
// React/Next.js Example
const fetchActivities = async (filters: {
  page?: number;
  limit?: number;
  projectId?: string;
  dateRange?: string;
  search?: string;
}) => {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.projectId) params.append('projectId', filters.projectId);
  if (filters.dateRange) params.append('dateRange', filters.dateRange);
  if (filters.search) params.append('search', filters.search);

  const response = await fetch(`/api/activities?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

// Usage
const data = await fetchActivities({
  page: 1,
  limit: 20,
  projectId: 'project-123',
  dateRange: 'last7',
  search: 'file',
});
```

#### 2. Export Activities

```typescript
const exportActivities = async (filters: any) => {
  const params = new URLSearchParams(filters);

  const response = await fetch(`/api/activities/export?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  // Convert to CSV
  const csv = convertToCSV(data);
  downloadFile(csv, 'activities.csv');
};
```

#### 3. Get User Activities

```typescript
const getUserActivities = async (userId: string, includeIp = false) => {
  const response = await fetch(
    `/api/activities/user/${userId}?includeIp=${includeIp}&dateRange=last30`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.json();
};
```

---

## 🔄 Activity Creation Flow

### কিভাবে Activity তৈরি হয়?

Activity সরাসরি frontend থেকে তৈরি হয় না। অন্যান্য service (ProjectService, TaskService, FileService) থেকে `createActivity()` method call করে activity তৈরি করা হয়।

### Method Signature

```typescript
async createActivity(data: {
  userId: string;
  projectId: string;
  description: string;
  actionType: ActivityActionType;
  ipAddress?: string;
  metadata?: any;
})
```

### Example Usage in Other Services

#### 1. TaskService - Task Creation

```typescript
// src/modules/task/service/task.service.ts
import { ActivityService } from '../../activity/service/activity.service';
import { ActivityActionType } from 'generated/prisma';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async createTask(
    userId: string,
    projectId: string,
    data: CreateTaskDto,
    ipAddress?: string,
  ) {
    // Create task
    const task = await this.prisma.task.create({
      data: {
        ...data,
        userId,
        projectId,
      },
    });

    // Log activity
    await this.activityService.createActivity({
      userId,
      projectId,
      description: `Created task: ${task.title}`,
      actionType: ActivityActionType.TASK_CREATED,
      ipAddress,
      metadata: {
        taskId: task.id,
        taskTitle: task.title,
        priority: task.priority,
      },
    });

    return task;
  }
}
```

#### 2. FileService - File Upload

```typescript
// src/modules/file/service/file.service.ts
async uploadFile(userId: string, projectId: string, file: Express.Multer.File, ipAddress?: string) {
  // Upload file logic
  const uploadedFile = await this.storageService.upload(file);

  // Log activity
  await this.activityService.createActivity({
    userId,
    projectId,
    description: `Added file: ${file.originalname}`,
    actionType: ActivityActionType.FILE_ADDED,
    ipAddress,
    metadata: {
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      fileUrl: uploadedFile.url,
    },
  });

  return uploadedFile;
}
```

#### 3. TaskService - Status Change

```typescript
async updateTaskStatus(taskId: string, userId: string, newStatus: string, ipAddress?: string) {
  const task = await this.prisma.task.findUnique({ where: { id: taskId } });

  const updatedTask = await this.prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  // Log activity
  await this.activityService.createActivity({
    userId,
    projectId: task.projectId,
    description: `Changed task status from ${task.status} to ${newStatus}`,
    actionType: ActivityActionType.STATUS_CHANGED,
    ipAddress,
    metadata: {
      taskId: task.id,
      taskTitle: task.title,
      oldStatus: task.status,
      newStatus: newStatus,
    },
  });

  return updatedTask;
}
```

#### 4. ProjectService - Assignee Added

```typescript
async addAssignee(projectId: string, userId: string, assigneeId: string, ipAddress?: string) {
  // Add assignee logic
  await this.prisma.projectMember.create({
    data: { projectId, userId: assigneeId },
  });

  const assignee = await this.prisma.user.findUnique({ where: { id: assigneeId } });

  // Log activity
  await this.activityService.createActivity({
    userId,
    projectId,
    description: `Added ${assignee.name} as assignee`,
    actionType: ActivityActionType.ASSIGNEE_ADDED,
    ipAddress,
    metadata: {
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      assigneeEmail: assignee.email,
    },
  });
}
```

### IP Address Collection

Controller থেকে IP address collect করে service এ pass করতে হবে:

```typescript
// In any controller
import { Req } from '@nestjs/common';
import { Request } from 'express';

@Post('tasks')
async createTask(
  @Body() dto: CreateTaskDto,
  @Req() req: Request,
) {
  const ipAddress = req.ip || req.connection.remoteAddress;
  return this.taskService.createTask(userId, projectId, dto, ipAddress);
}
```

---

## ⚠️ Error Handling

### Validation Errors

#### Invalid UUID

```json
{
  "statusCode": 400,
  "message": "Invalid UUID format for id",
  "error": "Bad Request"
}
```

#### Invalid Date Range

```json
{
  "statusCode": 400,
  "message": "Date range cannot exceed 365 days",
  "error": "Bad Request"
}
```

#### Pagination Limit Exceeded

```json
{
  "statusCode": 400,
  "message": "limit must not be greater than 100",
  "error": "Bad Request"
}
```

### Not Found Errors

```json
{
  "statusCode": 404,
  "message": "Activity not found",
  "error": "Not Found"
}
```

### Authentication Errors

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## 📚 Best Practices

### 1. Activity Creation Guidelines

✅ **DO**:

- সবসময় meaningful description দিন
- Appropriate actionType ব্যবহার করুন
- Important context metadata তে রাখুন
- IP address track করুন (optional but recommended)

❌ **DON'T**:

- Generic description ব্যবহার করবেন না ("Updated something")
- Sensitive data metadata তে রাখবেন না (passwords, tokens)
- অপ্রয়োজনীয় activity log করবেন না

### 2. Query Optimization

```typescript
// ✅ Good: Specific filters
GET /activities?projectId=abc-123&dateRange=last7&limit=20

// ❌ Bad: No filters, large limit
GET /activities?limit=100
```

### 3. Date Range Usage

```typescript
// ✅ Good: Use presets when possible
dateRange: 'last7';

// ✅ Good: Custom range with validation
startDate: '2024-01-01';
endDate: '2024-01-31';

// ❌ Bad: Range > 365 days
startDate: '2020-01-01';
endDate: '2024-01-31';
```

### 4. Search Best Practices

```typescript
// ✅ Good: Specific search terms
search: 'file upload';

// ✅ Good: User name search
search: 'John Doe';

// ❌ Bad: Too generic
search: 'a';
```

### 5. Export Guidelines

- সবসময় filter apply করুন export করার আগে
- Large dataset এর জন্য date range ব্যবহার করুন
- 10,000 records এর বেশি হলে multiple exports করুন

---

## 🔍 Advanced Features

### 1. Metadata Usage Examples

```typescript
// File operations
metadata: {
  fileName: 'document.pdf',
  fileSize: 2048576,
  fileType: 'application/pdf',
  fileUrl: 'https://storage.example.com/files/document.pdf'
}

// Task operations
metadata: {
  taskId: 'task-123',
  taskTitle: 'Design homepage',
  oldValue: 'In Progress',
  newValue: 'Completed',
  priority: 'HIGH'
}

// Assignee operations
metadata: {
  assigneeId: 'user-456',
  assigneeName: 'Jane Smith',
  assigneeEmail: 'jane@example.com',
  role: 'DEVELOPER'
}
```

### 2. Multi-field Search

Search করলে এই fields এ খুঁজবে:

- Activity description
- User name
- Project name
- IP address (if includeIp=true)

### 3. Date Range Presets

| Preset    | Description             |
| --------- | ----------------------- |
| today     | আজকের activities        |
| yesterday | গতকালের activities      |
| last7     | শেষ ৭ দিনের activities  |
| last30    | শেষ ৩০ দিনের activities |
| last90    | শেষ ৯০ দিনের activities |

---

## 📊 Response Patterns

### Empty Results

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "totalPages": 0
  }
}
```

**Note**: Empty results এ 404 error throw হয় না, 200 OK status code সহ empty array return করে।

### Paginated Response Structure

```typescript
interface ActivityResponse {
  data: Activity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    user?: UserInfo; // Only in getUserActivities
  };
}
```

---

## 🎓 Summary

এই Activity Module একটি production-ready, scalable এবং maintainable solution যা:

1. ✅ সম্পূর্ণ activity tracking প্রদান করে
2. ✅ Advanced filtering এবং search support করে
3. ✅ Proper validation এবং error handling আছে
4. ✅ Export functionality সহ আসে
5. ✅ JWT authentication protected
6. ✅ Optimized database queries ব্যবহার করে
7. ✅ Clean architecture follow করে
8. ✅ Well-documented এবং maintainable

---

## 📞 Support

কোন সমস্যা বা প্রশ্ন থাকলে:

- GitHub Issues: [Create an issue]
- Documentation: [NestJS Docs](https://docs.nestjs.com)
- Prisma Docs: [Prisma Documentation](https://www.prisma.io/docs)

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Author**: Development Team
