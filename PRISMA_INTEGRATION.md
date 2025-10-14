# Prisma Integration Guide

## What Was Done

### 1. Updated Prisma Schema
- Extended the schema to include all required models:
  - `User` - User accounts
  - `FarmRecord` - Farm activity records (updated to match frontend)
  - `RiskAssessment` - Risk assessment results
  - `Activity` - Activity tracking for dashboard
  - `Alert` - Disease alerts
  - `AlertRead` - Tracks which users have read which alerts

### 2. Created Server Actions
All server actions are in the `app/actions/` directory:
- `farm-records.ts` - CRUD operations for farm records
- `risk-assessments.ts` - Risk assessment operations
- `activities.ts` - Activity tracking operations
- `alerts.ts` - Alert management operations
- `dashboard.ts` - Dashboard statistics and aggregations

### 3. Created Prisma Client
- Created `app/lib/prisma.ts` - Prisma client initialization
- Created `app/lib/auth.ts` - Authentication helper (for server-side auth)

### 4. Updated Frontend Components
- Updated `farm-records-form.tsx` to use new server actions
- Updated field names to match new schema (camelCase)
- **Enabled guest mode**: Users can now add records without logging in
  - Guest records are stored under a "Guest User" account
  - Authenticated users see their own records
  - Unauthenticated users see guest records

## What Still Needs to Be Done

### 1. Database Migration
You need to run Prisma migrations to create the database tables:

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Or if you want to push the schema directly (for development)
npx prisma db push
```

### 2. Environment Variables
Make sure you have a `.env` file with:

```env
DATABASE_URL="postgresql://neondb_owner:npg_qJ7Of6VWHtdU@ep-little-block-a11rvm4v-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Update Remaining Components
- [ ] Update `Dashboard/page.tsx` to use server actions
- [ ] Update `risk-assessment-form.tsx` to use server actions
- [ ] Update `disease-alerts.tsx` to use server actions
- [ ] Update chart components to fetch real data

### 4. Guest User Support
The application now supports adding records without login:
- A "Guest User" is automatically created if it doesn't exist
- Guest User ID: `00000000-0000-0000-0000-000000000000`
- Guest User Email: `guest@farm.local`
- All unauthenticated users share the same guest account
- Authenticated users see their own records, unauthenticated users see guest records

### 5. Sync User IDs (for authenticated users)
For authenticated users, make sure:
- Users are created in your Prisma database when they sign up
- User IDs from Supabase match the IDs in your Prisma database

### 6. Create Initial Data
You may want to create some sample alerts in the database:

```typescript
// You can use Prisma Studio or create a seed script
npx prisma studio
```

**Note**: The guest user will be automatically created when the first record is added without login.

## Usage Example

### Farm Records
```typescript
import { getFarmRecords, createFarmRecord } from '@/app/actions/farm-records'
import { supabase } from '@/app/lib/supabase-client'

// Get current user (optional - works without login)
const { data: { user } } = await supabase.auth.getUser()

// Get records (userId is optional - uses guest user if not provided)
const records = await getFarmRecords(user?.id || undefined)

// Create record (userId is optional - uses guest user if not provided)
const newRecord = await createFarmRecord({
  animalType: 'Poultry',
  quantity: 100,
  fodder: 50.5,
  deaths: 2,
  symptoms: 'Healthy',
  vaccinations: 'Newcastle Disease',
  date: new Date(),
  userId: user?.id || undefined // Optional - will use guest user if not provided
})
```

### Dashboard Stats
```typescript
import { getDashboardStats } from '@/app/actions/dashboard'
import { supabase } from '@/app/lib/supabase-client'

const { data: { user } } = await supabase.auth.getUser()
const stats = await getDashboardStats(user.id)
```

## Notes

1. **Authentication**: 
   - **Guest Mode**: Users can add records without logging in. Records are stored under a guest user account.
   - **Authenticated Users**: Logged-in users see their own records.
   - For production with authenticated users, you should implement proper server-side authentication.

2. **Error Handling**: All server actions include error handling, but you may want to add more specific error messages.

3. **Data Validation**: Consider adding Zod schemas for input validation in server actions.

4. **Caching**: Server actions use `revalidatePath` for cache invalidation. You may want to adjust caching strategies based on your needs.

5. **Performance**: For large datasets, consider adding pagination to the server actions.

## Next Steps

1. Run Prisma migrations
2. Test the farm records form
3. Update dashboard to use server actions
4. Update risk assessment form
5. Update alert center
6. Test all functionality
7. Add error handling and validation
8. Optimize queries and add indexes if needed

