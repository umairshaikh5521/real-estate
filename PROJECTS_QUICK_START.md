# Projects Page - Quick Start Guide 🚀

## ⚡ **TL;DR**

Projects page is now dynamic with Supabase Storage for images. Add projects with images, they appear instantly with optimistic UI!

---

## 🎯 **What Changed**

**Before:** Static mock data only  
**After:** Real database + image upload + optimistic UI

---

## 🧪 **Quick Test (30 seconds)**

1. **Start servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

2. **Test:**
   - Go to http://localhost:3000/projects
   - Click "Add New Project"
   - Fill: Name, Location, Type, Status, Units
   - Upload 1-2 images
   - Click "Create Project"
   - ✅ **Should appear instantly at top!**

---

## 📋 **Key Features**

| Feature | Status |
|---------|--------|
| Create projects | ✅ Working |
| Upload images (max 5) | ✅ Working |
| Optimistic UI | ✅ Working |
| Dynamic + Static merge | ✅ Working |
| Image preview | ✅ Working |
| Form validation | ✅ Working |
| Error handling | ✅ Working |
| Loading states | ✅ Working |

---

## 🔧 **Environment Check**

Make sure these are in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://nulddnfkwqdgckditijz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## 📝 **Form Fields**

**Required:**
- Project Name (min 2 chars)
- Location (min 2 chars)
- Type (dropdown)
- Status (dropdown)
- Total Units (number)
- Available Units (number)

**Optional:**
- Description
- Min Price (₹)
- Max Price (₹)
- Amenities (comma-separated)
- Images (up to 5, max 5MB each)

---

## 🎨 **Image Upload**

1. Click "Upload Images" button
2. Select 1-5 images (JPEG, PNG, WebP)
3. See previews in grid
4. Hover to remove (X button appears)
5. Submit form
6. Images auto-upload to Supabase Storage

**Limits:**
- Max 5 images per project
- Max 5MB per image
- Types: JPEG, JPG, PNG, WebP

---

## 🔄 **Data Flow**

```
User fills form
    ↓
Upload images to Supabase Storage
    ↓
Get public URLs
    ↓
Send to backend API
    ↓
Optimistic UI update (instant!) ⚡
    ↓
Real data from API
    ↓
Project appears at top of list
```

---

## ✅ **Verification Steps**

1. **Check Storage Bucket:**
   - Go to Supabase Dashboard
   - Storage → Buckets
   - Should see `project-images` bucket

2. **Check Backend:**
   ```bash
   curl http://localhost:8000/api/projects -H "Cookie: your-auth-cookie"
   ```
   Should return projects array

3. **Check Frontend:**
   - Open http://localhost:3000/projects
   - Should see loading indicator briefly
   - Should see projects list

---

## 🐛 **Common Issues**

### **Images not uploading:**
```bash
# Check env vars
cat frontend/.env.local | grep SUPABASE

# Should show URL and key
```

### **Projects not saving:**
```bash
# Check backend is running
curl http://localhost:8000/health

# Check authentication
# Make sure you're logged in
```

### **TypeScript errors:**
```bash
cd frontend
npx tsc --noEmit

# Should show no errors
```

---

## 📚 **Files to Know**

1. **`app/(dashboard)/projects/components/add-project-dialog.tsx`**  
   → Form with image upload

2. **`app/(dashboard)/projects/page.tsx`**  
   → Main page with data fetching

3. **`hooks/use-projects.ts`**  
   → React Query hooks

4. **`lib/api/projects.ts`**  
   → API service

5. **`lib/supabase/client.ts`**  
   → Storage utilities

---

## 🎯 **What's Next?**

Check the full documentation: `PROJECTS_DYNAMIC_IMPLEMENTATION.md`

---

## 🚀 **Ready to Use!**

Everything is set up and working. Just test and enjoy!

**Status:** ✅ Production Ready

---

*Quick Start Guide*  
*Last Updated: January 10, 2025*
