# Activity Module Documentation

## Overview

Activity module ta system er sob activity/action track korar jonno. User kono action korle (project create, task update, etc.) sei activity log hoy ei module e.

---

## Module Structure

```
activity/
├── controller/
│   └── activity.controller.ts       # REST API endpoints
├── service/
│   └── activity.service.ts          # Business logic
├── dto/
│   ├── query-activity.dto.ts        # Query filtering
│   ├── create-activity.dto.ts       # Activity creation
│   ├── activity-response.dto.ts     # Response format
│   └── param-validation.dto.ts      # Param validation
├── utils/
│   ├── query-builder.helper.ts      # Dynamic query builder
│   ├── csv.helper.ts                # CSV export
│   ├── date-range.helper.ts         # Date range presets
│   ├── activity-mapper.helper.ts    # Data mapping
│   └── activity-validator.helper.ts # Validation logic
└── activity.module.ts               # Module configuration
```

---

## ✅ Completed Features

### 1. **Activity Listing**

#### GET `/activities` - All Activities

- Pagination (page, limit: max 100)
- Search by description, project name, IP, user name
- Filter by userId, projectId
- Date range filtering (preset + custom)
- Sorted by timestamp (newest first)
- Returns user info + project name

### 2. **Single Activity**

#### GET `/activities/:id` - Activity Details

- UUID validation
- Full activity details with user + project
- 404 if not found

### 3. **User Activities**

#### GET `/activities/user/:userId` - User Specific Activities

- Specific user er sob activities
- Same filtering options
- User info in meta response
- Optional IP address inclusion

### 4. **Export Feature**

#### GET `/activities/export` - CSV Export

- Activities export as CSV
- Max 10,000 records
- Filtered data export
- Headers: Timestamp, User, Description, Project, IP
- Error if too many records

### 5. **Activity Creation**

#### createActivity() - Internal Method

- User + Project validation
- Activity log creation
- Metadata support
- IP address tracking

---

## DTOs (Data Transfer Objects)

### QueryActivityDto

```typescript
{
  page?: number;              // Default: 1, Min: 1
  limit?: number;             // Default: 20, Max: 100
  userId?: string;            // UUID format
  projectId?: string;         // UUID format
  search?: string;            // Search in description/project/IP/user
  dateRange?: DateRangePreset; // Preset ranges
  startDate?: string;         // ISO date format
  endDate?: string;           // ISO date (must be >= startDate)
  includeIp?: boolean;        // Include IP in response
}
```

### DateRangePreset Options

```typescript
-TODAY -
  YESTERDAY -
  LAST_7_DAYS -
  LAST_30_DAYS -
  THIS_MONTH -
  LAST_MONTH -
  LAST_WEEK;
```

### CreateActivityDto

```typescript
{
  userId: string;             // UUID (required)
  projectId: string;          // UUID (required)
  description: string;        // Activity description
  actionType: ActivityActionType; // Enum
  ipAddress?: string;         // Optional
  metadata?: any;             // Optional JSON
}
```

### ActivityResponseDto

```typescript
{
  data: [
    {
      id: string;
      timestamp: Date;
      user?: {
        id: string;
        name: string;
        avatar?: string;
        role?: string;
      };
      description: string;
      projectName: string;
      ipAddress?: string;
      actionType: ActivityActionType;
      metadata?: any;
    }
  ],
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    user?: {...};             // Only in user-specific endpoint
  }
}
```

---

## Helper Utilities

### 1. **QueryBuilder**

- Dynamic WHERE clause generation
- Date range handling
- Search across multiple fields
- User search toggle

### 2. **CSV Helper**

- CSV format generation
- Proper escaping
- Header row included

### 3. **Date Range Helper**

- Preset date ranges
- Custom date validation
- Date range calculation

### 4. **Activity Mapper**

- DTO mapping
- User activity mapping
- IP inclusion logic

### 5. **Activity Validator**

- User existence check
- Project existence check
- Pre-creation validation

---

## Security Features

- JWT Authentication required (JwtAuthGuard)
- UUID validation for IDs
- Date validation (endDate >= startDate)
- Limit max 100 per page
- Export limit 10,000 records
- IP address optional inclusion

---

## API Response Examples

### Success Response

```json
{
  "data": [
    {
      "id": "uuid",
      "timestamp": "2025-01-15T10:30:00Z",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "avatar": "url"
      },
      "description": "Created new project",
      "projectName": "Project Alpha",
      "actionType": "CREATE",
      "metadata": {}
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

### CSV Export Format

```csv
Timestamp,User,Description,Project Name,IP Address
2025-01-15T10:30:00Z,"John Doe","Created project","Project Alpha","192.168.1.1"
```

---

## 🔄 Future Improvements (To-Do)

### 1. **Advanced Filtering**

- [ ] Filter by actionType
- [ ] Filter by date created vs modified
- [ ] Multiple project IDs support
- [ ] Multiple user IDs support
- [ ] Activity type grouping

### 2. **Analytics & Insights**

- [ ] Activity heatmap (by hour/day)
- [ ] Most active users
- [ ] Most active projects
- [ ] Activity trends over time
- [ ] User activity patterns

### 3. **Real-time Features**

- [ ] WebSocket for live activity feed
- [ ] Real-time notifications
- [ ] Activity streaming

### 4. **Export Enhancements**

- [ ] Excel export (.xlsx)
- [ ] JSON export
- [ ] PDF report generation
- [ ] Scheduled exports
- [ ] Email export results

### 5. **Performance**

- [ ] Activity archiving (old data)
- [ ] Database indexing optimization
- [ ] Caching for frequent queries
- [ ] Pagination cursor-based

### 6. **Activity Types**

- [ ] More granular action types
- [ ] Custom activity types
- [ ] Activity categories
- [ ] Activity severity levels

### 7. **Audit Trail**

- [ ] Before/after data comparison
- [ ] Rollback capability
- [ ] Change history tracking
- [ ] Compliance reporting

### 8. **UI Enhancements**

- [ ] Activity timeline view
- [ ] Activity grouping by date
- [ ] Activity filtering UI
- [ ] Activity search suggestions

### 9. **Bulk Operations**

- [ ] Bulk delete activities
- [ ] Bulk export by IDs
- [ ] Bulk activity creation

### 10. **Additional Endpoints**

- [ ] GET `/activities/stats` - Activity statistics
- [ ] GET `/activities/recent` - Recent activities (last 24h)
- [ ] GET `/activities/project/:projectId` - Project activities
- [ ] DELETE `/activities/:id` - Delete activity (admin only)
- [ ] GET `/activities/timeline` - Timeline view

### 11. **Validation & Security**

- [ ] Rate limiting on export
- [ ] Activity retention policy
- [ ] GDPR compliance (data deletion)
- [ ] Role-based activity visibility
- [ ] Sensitive data masking

### 12. **Testing**

- [ ] Unit tests for service methods
- [ ] Integration tests for endpoints
- [ ] E2E tests for workflows
- [ ] Performance tests for large datasets

---

## Database Relations

Activity module relations:

1. **Activity → User** (Many-to-One)
   - Activity belongs to a user

2. **Activity → Project** (Many-to-One)
   - Activity belongs to a project

---

## Error Handling

- `NotFoundException`: Activity/User not found
- `BadRequestException`: Too many records to export, invalid date range
- Validation errors: Invalid UUID, date format, limit exceeded

---

## Usage Examples

### Get All Activities with Filters

```typescript
GET /activities?page=1&limit=20&search=created&dateRange=last7days
```

### Get User Activities

```typescript
GET /activities/user/:userId?page=1&limit=20&includeIp=true
```

### Export Activities

```typescript
GET /activities/export?startDate=2025-01-01&endDate=2025-01-31&projectId=xxx
```

### Date Range Presets

```typescript
GET /activities?dateRange=today
GET /activities?dateRange=last30days
GET /activities?dateRange=thisMonth
```

### Custom Date Range

```typescript
GET /activities?startDate=2025-01-01&endDate=2025-01-31
```

---

## Dependencies

- **PrismaModule**: Database operations
- **JwtAuthGuard**: Authentication
- **class-validator**: DTO validation
- **class-transformer**: Data transformation
- **Swagger**: API documentation

---

## Notes

- Sob endpoints JWT protected
- Default limit: 20, max: 100
- Export max: 10,000 records
- Activities sorted by timestamp DESC
- IP address optional (privacy)
- Metadata field flexible (JSON)
- Date validation automatic
- Search case-insensitive

---

**Last Updated**: January 2025
