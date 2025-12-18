# Infrastructure Project Progress Tree

## 📌 Problem Statement

In large infrastructure projects (e.g. building hospitals, schools, or facilities), progress is **not flat**. Each project is composed of multiple tasks and sub-tasks, often forming a **deep hierarchical structure (tree)**.

The core challenges were:

1. Projects contain **unlimited-depth nested nodes** (tasks → sub-tasks → sub-sub-tasks …).
2. Only the **leaf-level tasks** can have direct progress updates.
3. Parent task progress must be **automatically computed** from its children.
4. Project-level progress must be **calculated from root nodes**.
5. The system must support:
   - Adding nodes at any depth
   - Deleting nodes safely
   - Updating progress without breaking hierarchy
   - Visualizing the full tree structure

Traditional flat task models or fixed-depth queries were **not sufficient** for this requirement.

---

## 🎯 Goals

- Design a **scalable tree-based data model**
- Support **unlimited nesting** of nodes
- Ensure **data consistency** when progress updates occur
- Keep the architecture **clean and maintainable**
- Make the API **frontend-friendly** for visualization

---

## 🧩 Solution Overview

The problem was solved using a **tree-based architecture** with clear separation of concerns:

- **Database**: Stores nodes in a flat structure using `parentId`
- **Service Layer**: Builds the tree and handles all business logic
- **Repository Layer**: Handles raw database operations only
- **Frontend**: Renders the already-built tree recursively

---

## 🗄️ Data Model Design

Each project contains multiple nodes. Each node may reference another node as its parent.

**Key fields:**

- `id`
- `parentId` (nullable for root nodes)
- `isLeaf` (true if no children)
- `progress` (only for leaf nodes)
- `computedProgress` (auto-calculated)

This allows **unlimited depth** while keeping the database queries simple.

---

## ⚙️ Backend Architecture (NestJS + Prisma)

### 1️⃣ Flat Fetch from Database

All nodes are fetched in a single query:

- No recursive SQL
- No depth assumptions
- High performance

```ts
include: {
  nodes: true,
  _count: true,
}
```

---

### 2️⃣ Tree Construction in Service Layer

A recursive function converts flat nodes into a nested tree:

```ts
buildTree(nodes, parentId = null) {
  return nodes
    .filter(n => n.parentId === parentId)
    .map(n => ({
      ...n,
      children: this.buildTree(nodes, n.id),
    }));
}
```

This ensures:

- Unlimited depth support
- Backend remains the single source of truth

---

### 3️⃣ Progress Update Rules

- ✅ Only **leaf nodes** can be updated
- ❌ Parent nodes cannot be edited directly
- 🔁 Progress propagates upward automatically

When a leaf node is updated:

1. Its `computedProgress` is updated
2. Parent progress is recalculated (weighted average)
3. Propagation continues up to root
4. Project-level progress is updated

---

### 4️⃣ Safe Node Deletion

- Only leaf nodes can be deleted
- Parent nodes are converted back to leaf if no children remain
- Progress is recalculated after deletion

This prevents tree corruption.

---

## 🌐 API Design

### Update Node Progress

```http
PATCH /api/v1/infrastructure/nodes/:nodeId/progress
```

```json
{
  "progress": 80
}
```

The backend automatically handles all recalculations.

---

## 🖥️ Frontend Visualization

Since the backend already returns a **nested tree**, the frontend:

- Does NOT rebuild the tree
- Uses a recursive renderer
- Supports unlimited nesting

This keeps the frontend logic minimal and reliable.

---

## ✅ Key Benefits of This Approach

- 🚀 Scales to any depth
- 🧠 Business logic centralized in backend
- 🔒 Data integrity guaranteed
- 📊 Accurate real-time progress aggregation
- 🧩 Clean separation of concerns
- 🛠️ Easy to extend in future

---

## 🏁 Conclusion

This solution transforms a complex real-world problem—**hierarchical project progress tracking**—into a clean, scalable system.

By combining:

- Flat database storage
- Recursive service-layer logic
- Strict update rules

The system remains **robust, flexible, and production-ready**, while being easy to visualize and maintain.

---

✍️ _This README documents a real problem and a practical, scalable solution implemented using NestJS, Prisma, and a recursive tree architecture._
