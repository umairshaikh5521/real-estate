# Fix Supabase Storage RLS Policy Error 🔧

## ⚠️ **Error:**
```
StorageApiError: new row violates row-level security policy
```

## 🎯 **Solution:**

You need to configure Row Level Security (RLS) policies for the Supabase Storage bucket through the **Supabase Dashboard**.

---

## 📋 **Steps to Fix:**

### **Option 1: Via Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage:**
   - Click "Storage" in left sidebar
   - Click on "project-images" bucket

3. **Configure Policies:**
   - Click "Policies" tab
   - Click "New Policy"

4. **Create INSERT Policy (Upload):**
   - **Policy name:** Allow authenticated users to upload
   - **Policy command:** INSERT
   - **Target roles:** authenticated
   - **WITH CHECK expression:**
     ```sql
     bucket_id = 'project-images'
     ```
   - Click "Review" → "Save policy"

5. **Create SELECT Policy (Read):**
   - Click "New Policy"
   - **Policy name:** Allow public to read project images
   - **Policy command:** SELECT  
   - **Target roles:** public
   - **USING expression:**
     ```sql
     bucket_id = 'project-images'
     ```
   - Click "Review" → "Save policy"

6. **Create UPDATE Policy:**
   - Click "New Policy"
   - **Policy name:** Allow users to update their uploads
   - **Policy command:** UPDATE
   - **Target roles:** authenticated
   - **USING expression:**
     ```sql
     bucket_id = 'project-images' AND auth.uid() = owner
     ```
   - **WITH CHECK expression:**
     ```sql
     bucket_id = 'project-images'
     ```
   - Click "Review" → "Save policy"

7. **Create DELETE Policy:**
   - Click "New Policy"
   - **Policy name:** Allow users to delete their uploads
   - **Policy command:** DELETE
   - **Target roles:** authenticated
   - **USING expression:**
     ```sql
     bucket_id = 'project-images' AND auth.uid() = owner
     ```
   - Click "Review" → "Save policy"

---

### **Option 2: Quick Fix (Disable RLS Temporarily)**

**⚠️ WARNING: This makes your bucket accessible to everyone. Only for development!**

1. Go to Supabase Dashboard
2. Storage → project-images bucket
3. Click "Policies" tab
4. Toggle "Disable RLS" (if available)

**OR** update bucket settings to allow public uploads:

1. Go to Storage → project-images
2. Click settings (gear icon)
3. Enable "Public bucket"
4. Enable "Allow public uploads" (if available)

---

### **Option 3: SQL Query (If you have direct database access)**

Run this in Supabase SQL Editor:

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload project images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

-- Policy 2: Allow public read
CREATE POLICY "Allow public to read project images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- Policy 3: Allow users to update their own uploads
CREATE POLICY "Allow users to update their own project images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'project-images');

-- Policy 4: Allow users to delete their own uploads
CREATE POLICY "Allow users to delete their own project images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images' AND auth.uid() = owner);
```

---

## ✅ **Verify It Works:**

After setting up policies:

1. Go to http://localhost:3000/projects
2. Click "Add New Project"
3. Fill form and upload an image
4. Click "Create Project"
5. ✅ Should work without errors!

---

## 🔍 **Alternative: Check Current Policies**

Run in Supabase SQL Editor to see existing policies:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

---

## 📚 **References:**

- [Supabase Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🐛 **Still Having Issues?**

1. Check you're logged in (authenticated user)
2. Check bucket name is exactly "project-images"
3. Check SUPABASE_URL and SUPABASE_ANON_KEY in .env.local
4. Try disabling RLS temporarily to confirm it's a policy issue
5. Check browser console for detailed error messages

---

## 🎯 **Quick Test:**

```bash
# Test upload via curl (replace with your values)
curl -X POST \
  'https://your-project.supabase.co/storage/v1/object/project-images/test.jpg' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: image/jpeg' \
  --data-binary '@/path/to/image.jpg'
```

If this works, policies are correct! If not, policies need fixing.

---

*Fix this and your upload will work perfectly!* 🚀
