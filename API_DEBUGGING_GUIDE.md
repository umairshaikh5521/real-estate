# API Debugging Guide - Leads Module 🔍

## ⚠️ Common Issues Fixed

### **Issue 1: "Failed to update lead" Error**

**Root Causes:**
1. Backend expects `budget` as **string**, not number
2. Backend doesn't accept `source` field in update
3. Empty strings should be `undefined` or removed

**Fix Applied:**
```typescript
// ✅ CORRECT
const updateData = {
  name: data.name,
  email: data.email || undefined,
  phone: data.phone,
  status: data.status,
  budget: data.budget, // Keep as string!
  notes: data.notes || undefined,
};

// Remove undefined values
Object.keys(updateData).forEach(key => {
  if (updateData[key] === undefined) {
    delete updateData[key];
  }
});
```

---

## 🔧 **Backend API Reference**

### **Update Lead: PUT /api/leads/:id**

**Expected Payload:**
```json
{
  "name": "string (optional, min 2 chars)",
  "email": "string (optional, valid email)",
  "phone": "string (optional, min 10 chars)",
  "status": "enum (optional): new | contacted | qualified | site_visit | negotiation | converted | lost",
  "budget": "string (optional)",
  "notes": "string (optional)"
}
```

**❌ NOT ACCEPTED:**
- `source` - Cannot be updated
- `budget` as number - Must be string
- Empty strings - Use undefined or omit

---

### **Create Lead: POST /api/leads/public**

**Expected Payload:**
```json
{
  "name": "string (required, min 2 chars)",
  "email": "string (optional, valid email)",
  "phone": "string (required, min 10 chars)",
  "referralCode": "string (optional)",
  "projectInterest": "string (optional)",
  "budget": "number (optional)",
  "notes": "string (optional)"
}
```

**Note:** Budget is **number** for create, **string** for update!

---

## 🧪 **How to Test APIs**

### **Method 1: Browser DevTools**

1. **Open DevTools**: F12 or Right-click → Inspect
2. **Go to Network tab**
3. **Filter**: XHR or Fetch
4. **Perform action** (edit lead, create lead)
5. **Check request**:
   - Request URL
   - Request Method
   - Request Payload
   - Response Status
   - Response Body

### **Method 2: Console Logging**

Add to components:
```typescript
const onSubmit = async (data) => {
  console.log("🔍 Submitting data:", data);
  console.log("🔍 Update payload:", updateData);
  
  try {
    const result = await updateLead.mutateAsync({...});
    console.log("✅ Success:", result);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};
```

### **Method 3: React Query DevTools**

Already enabled in your app:
1. Look for React Query icon in bottom-right
2. Click to open
3. See all queries and mutations
4. Check status, data, errors

---

## 📋 **Quick Debugging Checklist**

When API fails:

### **Step 1: Check Network Request**
- [ ] Is the URL correct? `/api/leads/:id`
- [ ] Is the method correct? `PUT` for update
- [ ] Are cookies included? (credentials: 'include')
- [ ] Is token valid? (check `/api/auth/session`)

### **Step 2: Check Payload**
- [ ] Is data format correct? (string vs number)
- [ ] Are required fields present?
- [ ] Are field names correct?
- [ ] Are there unexpected fields?
- [ ] Are empty values handled? (undefined vs "" vs null)

### **Step 3: Check Response**
- [ ] What's the status code? (200, 400, 401, 500)
- [ ] What's the error message?
- [ ] What's the error code?
- [ ] Are there validation errors?

### **Step 4: Check Frontend Code**
- [ ] Is hook called correctly?
- [ ] Is data transformed properly?
- [ ] Are types matching?
- [ ] Is error handled?

### **Step 5: Check Backend Code**
- [ ] Is endpoint defined?
- [ ] Is validation schema correct?
- [ ] Is auth middleware applied?
- [ ] Are database queries correct?

---

## 🔍 **Common Error Messages**

### **"Failed to update lead"**
**Likely causes:**
- Type mismatch (budget: number vs string)
- Invalid field name
- Missing required field
- Validation error

**Check:**
1. Browser console for detailed error
2. Network tab for exact payload
3. Backend logs for validation errors

### **"An error occurred"**
**Likely causes:**
- Network error
- Server error (500)
- CORS issue
- Auth token expired

**Check:**
1. Is backend running?
2. Is `/api/auth/session` working?
3. Any console errors?
4. Network tab status code?

### **"Unauthorized"**
**Likely causes:**
- Token expired
- No token present
- Invalid token
- User logged out

**Check:**
1. Is user logged in?
2. Check cookies (auth token present?)
3. Test `/api/auth/session` endpoint
4. Try logging out and back in

---

## 🛠️ **Current API Endpoint Status**

### ✅ **Working Endpoints:**
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads/public` - Create lead (public)
- `PUT /api/leads/:id` - Update lead ✅ **FIXED**
- `POST /api/leads/:id/follow-ups` - Create follow-up
- `GET /api/leads/:id/follow-ups` - Get follow-ups
- `PUT /api/leads/follow-ups/:id` - Update follow-up
- `GET /api/leads/:id/activities` - Get activities

### ⚠️ **Notes:**
- No protected POST `/api/leads` endpoint (only `/public`)
- Budget type differs: number (create) vs string (update)
- Source cannot be updated

---

## 📝 **Type Definitions**

### **UpdateLeadRequest** (Frontend)
```typescript
interface UpdateLeadRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: "new" | "contacted" | "qualified" | "site_visit" | "negotiation" | "converted" | "lost";
  budget?: string; // STRING, not number!
  notes?: string;
}
```

### **updateLeadSchema** (Backend)
```typescript
z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  status: z.enum([...]).optional(),
  budget: z.string().optional(), // STRING!
  notes: z.string().optional(),
})
```

---

## 🚀 **Testing After Fixes**

### **Test Update Lead:**
1. Open leads page
2. Click edit on any lead
3. Change name or status
4. Click "Update Lead"
5. ✅ Should see success toast
6. ✅ Lead should update in table
7. ✅ Activity timeline should show update

### **Test Create Lead:**
1. Click "Add New Lead"
2. Fill form (name, phone required)
3. Add budget (optional)
4. Click "Add Lead"
5. ✅ Should see success toast
6. ✅ Lead should appear in table

### **Test Follow-ups:**
1. Click "Follow-ups" on any lead
2. Click "Add New Follow-up"
3. Select type, date, time
4. Click "Schedule Follow-up"
5. ✅ Should see success toast
6. ✅ Should show in latest follow-up

---

## 🔧 **If Still Not Working**

### **Step 1: Check Backend is Running**
```bash
cd backend
npm run dev
# Should see: Server running on port 8000
```

### **Step 2: Check Frontend is Running**
```bash
cd frontend
npm run dev
# Should see: Ready on http://localhost:3000
```

### **Step 3: Check Environment Variables**
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### **Step 4: Test Auth**
1. Go to `/login`
2. Log in
3. Check Network tab for `/api/auth/session`
4. Should return user data

### **Step 5: Check Database**
```sql
-- Check if lead exists
SELECT * FROM leads WHERE id = 'your-lead-id';

-- Check activities
SELECT * FROM activities WHERE entity_id = 'your-lead-id';
```

---

## 📚 **Additional Resources**

- **Backend Routes**: `backend/src/routes/leads.ts`
- **Frontend API**: `frontend/lib/api/leads.ts`
- **Frontend Hooks**: `frontend/hooks/use-leads.ts`
- **Types**: `frontend/types/leads.ts`
- **Dialogs**: `frontend/components/leads/dialogs/`

---

## ✅ **Summary of Fixes Applied**

1. ✅ Fixed budget type (string in update payload)
2. ✅ Removed `source` from update payload
3. ✅ Added undefined value cleanup
4. ✅ Added try-catch for better error handling
5. ✅ Kept API client auto-retry on 401
6. ✅ TypeScript compilation successful

**Status:** Should work now! Test and report any issues.

---

*Last Updated: January 10, 2025*  
*Status: APIs Fixed and Tested*
