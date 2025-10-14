# FarmShield Setup Instructions

## Supabase Configuration

To complete the setup, you need to configure Supabase for the farm records functionality:

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2. Set up Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Database Schema

Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL to create the `farm_records` table

### 4. Configure Row Level Security (RLS)

The schema includes RLS policies. For development, you can:

1. **Option A**: Enable authentication and use the authenticated user policy
2. **Option B**: Temporarily disable RLS for testing by running:
   ```sql
   ALTER TABLE farm_records DISABLE ROW LEVEL SECURITY;
   ```

### 5. Test the Application

1. Run `npm run dev`
2. Navigate to `/FarmRecords`
3. Try adding, editing, and deleting farm records

## Features Implemented

- ✅ **Supabase Integration**: Complete CRUD operations for farm records
- ✅ **Database Schema**: Proper table structure with constraints and indexes
- ✅ **Type Safety**: Full TypeScript support with proper interfaces
- ✅ **Error Handling**: Comprehensive error handling with user feedback
- ✅ **Loading States**: Proper loading indicators for better UX
- ✅ **Responsive Design**: Works on all device sizes
- ✅ **Clean UI**: Removed dark theme, focused on light theme only

## Database Schema

The `farm_records` table includes:

- `id`: UUID primary key
- `animal_type`: Type of animal (Pig, Poultry, Fisheries, Other)
- `quantity`: Number of animals
- `fodder_consumed`: Amount of fodder consumed in kg
- `deaths`: Number of deaths
- `symptoms`: Observations and symptoms
- `vaccinations`: Vaccination or treatment given
- `record_date`: Date of the record
- `notes`: Optional additional notes
- `created_at`: Timestamp when record was created
- `updated_at`: Timestamp when record was last updated

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Supabase project allows requests from your domain
2. **RLS Errors**: Check your RLS policies or temporarily disable them for testing
3. **Environment Variables**: Ensure your `.env.local` file is properly configured
4. **Database Connection**: Verify your Supabase URL and key are correct

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Supabase project is active
3. Ensure the database schema was created correctly
4. Check that your environment variables are loaded properly


