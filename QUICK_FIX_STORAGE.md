# Quick Fix for Storage Upload Error 🔧

## The Problem:
- INSERT policy requires "authenticated" users
- Supabase client uses "anon" key (public)
- Mismatch → Upload fails

## ✅ Solution: Change INSERT Policy

### **In Supabase Dashboard:**

1. Go to Storage → project-images → Policies
2. Find "Allow Upload 1mnl3fw_0" policy
3. Click the 3 dots ⋮ → Edit
4. Change:
   - **Target roles:** From `authenticated` → `public` or `anon`
   - Keep the same CHECK expression: `bucket_id = 'project-images'`
5. Save

### **OR Delete and Recreate:**

1. Delete the "Allow Upload" policy
2. Click "New Policy"
3. Create with these settings:
   - **Policy name:** Allow public uploads
   - **Policy command:** INSERT
   - **Target roles:** public (or anon)
   - **WITH CHECK expression:**
     ```sql
     bucket_id = 'project-images'
     ```
4. Save

## That's it! Try uploading again.
