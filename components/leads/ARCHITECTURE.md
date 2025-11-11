# Leads Module Architecture - Apple-Style Organization 🍎

## 📁 Directory Structure

```
components/leads/
├── channel-partner/          # Channel Partner specific views
│   ├── channel-partner-view.tsx
│   ├── my-leads-stats.tsx
│   ├── my-leads-table.tsx
│   └── my-leads-card.tsx
│
├── builder/                  # Builder/Admin specific views
│   ├── builder-view.tsx
│   ├── all-leads-stats.tsx
│   ├── all-leads-table.tsx
│   ├── lead-assignment-dialog.tsx
│   └── team-performance.tsx
│
├── shared/                   # Shared components (both roles)
│   ├── lead-card.tsx
│   ├── lead-filters.tsx
│   ├── lead-status-badge.tsx
│   ├── lead-actions.tsx
│   └── view-toggle.tsx
│
├── dialogs/                  # All dialogs
│   ├── add-lead-dialog.tsx
│   ├── edit-lead-dialog.tsx
│   ├── follow-ups-dialog.tsx
│   └── view-details-dialog.tsx
│
├── utils/                    # Utility functions
│   ├── formatters.ts
│   ├── calculators.ts
│   └── validators.ts
│
└── types.ts                  # TypeScript types

app/(dashboard)/leads/
├── page.tsx                  # Router component (role detection)
├── columns.tsx               # Table column definitions
└── data.ts                   # Mock/test data
```

## 🎯 Design Principles (Apple-Style)

### 1. **Separation of Concerns**
- App folder: Routing only
- Components folder: All UI components
- Clear role-based separation

### 2. **Component Organization**
- **Role-specific**: Components used by specific roles
- **Shared**: Components used by multiple roles
- **Dialogs**: All modal/dialog components together
- **Utils**: Pure functions, no UI

### 3. **Naming Conventions**
- Files: kebab-case (`my-leads-view.tsx`)
- Components: PascalCase (`MyLeadsView`)
- Utils: camelCase (`formatBudget`)
- Types: PascalCase (`LeadStats`)

### 4. **Import Strategy**
```typescript
// From app/leads/page.tsx
import { ChannelPartnerView } from "@/components/leads/channel-partner/channel-partner-view";
import { BuilderView } from "@/components/leads/builder/builder-view";

// From view components
import { LeadCard } from "@/components/leads/shared/lead-card";
import { AddLeadDialog } from "@/components/leads/dialogs/add-lead-dialog";
import { formatBudget } from "@/components/leads/utils/formatters";
```

## 🏗️ Component Hierarchy

```
page.tsx (Router)
├── ChannelPartnerView
│   ├── MyLeadsStats
│   ├── LeadFilters (shared)
│   ├── ViewToggle (shared)
│   ├── MyLeadsTable
│   │   └── LeadCard (shared)
│   ├── AddLeadDialog
│   ├── EditLeadDialog
│   └── FollowUpsDialog
│
└── BuilderView
    ├── AllLeadsStats
    ├── LeadFilters (shared)
    ├── ViewToggle (shared)
    ├── AllLeadsTable
    │   └── LeadCard (shared)
    ├── LeadAssignmentDialog
    ├── AddLeadDialog
    ├── EditLeadDialog
    └── TeamPerformance
```

## 📝 File Responsibilities

### **page.tsx** (Router)
- Role detection
- Route to appropriate view
- Loading states
- Error boundaries

### **channel-partner-view.tsx**
- Layout for channel partners
- Stats calculation (personal)
- View state management
- Filter state management

### **builder-view.tsx**
- Layout for builders/admins
- Stats calculation (team-wide)
- Assignment features
- Team analytics

### **Shared Components**
- Reusable across both views
- No role-specific logic
- Pure presentation components

### **Dialogs**
- Self-contained modal components
- Form handling
- API integration
- Validation logic

### **Utils**
- Pure functions
- No React hooks
- Easily testable
- Type-safe

## 🔄 Data Flow

```
User → page.tsx
         ↓ (role check)
         ├→ ChannelPartnerView
         │    ↓
         │    useChannelPartnerLeads(userId)
         │    ↓
         │    API: /api/leads?userId=xxx
         │
         └→ BuilderView
              ↓
              useBuilderLeads()
              ↓
              API: /api/leads (all leads)
```

## 🎨 Apple Design Principles Applied

### 1. **Clarity**
- Clear component names
- Obvious file locations
- Self-documenting structure

### 2. **Consistency**
- All dialogs in one place
- All utils in one place
- Predictable import paths

### 3. **Simplicity**
- No deep nesting
- Maximum 2-level folders
- Easy to navigate

### 4. **Discoverability**
- Folder names explain content
- No abbreviated names
- Logical grouping

## 🚀 Migration Plan

### Phase 1: Setup Structure ✅
- Create folder structure
- Move existing components
- Update imports

### Phase 2: Create Views
- Build ChannelPartnerView
- Build BuilderView
- Update page.tsx router

### Phase 3: Shared Components
- Extract common components
- Create reusable pieces
- Optimize for both views

### Phase 4: Polish
- Add documentation
- Optimize performance
- Add tests

## ✅ Benefits

1. **Scalability**: Easy to add new roles
2. **Maintainability**: Clear organization
3. **Reusability**: Shared components
4. **Testability**: Isolated units
5. **Collaboration**: Easy for team to understand
6. **Performance**: Code splitting by role

## 📚 References

- Apple Human Interface Guidelines
- Next.js App Router Best Practices
- React Component Patterns
- Clean Code Architecture

---

*Last Updated: January 10, 2025*
*Architecture: Apple-Style Component Organization*
