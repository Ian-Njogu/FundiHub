# Frontend-Backend Integration Test Guide

## Prerequisites

1. **Backend Running**: Make sure your Django backend is running on `http://localhost:8000`
2. **Frontend Environment**: Create a `.env` file in the frontend directory with:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_USE_REAL_API=true
   ```

## Step-by-Step Testing

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd jobboard-backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd jobboard-frontend
npm run dev
```

### 2. Test Authentication

1. Open `http://localhost:5173` in your browser
2. Click "Login" 
3. Try logging in with the sample users you created:
   - **Client**: `john.client@example.com` / `password123`
   - **Worker**: `jane.worker@example.com` / `password123`

**Expected Result**: Should redirect to dashboard and show user info

### 3. Test Workers List

1. Navigate to `/workers`
2. Check browser Network tab - should see calls to `localhost:8000/api/v1/workers`
3. Try filtering by category or location

**Expected Result**: Should load workers from your backend database

### 4. Test Worker Detail

1. Click on any worker from the list
2. Should load detailed worker profile

**Expected Result**: Should show worker details from backend

### 5. Test Job Creation (Client)

1. Login as a client
2. Go to `/create-job`
3. Fill out the form and submit

**Expected Result**: Should create job in backend and redirect to dashboard

### 6. Test Job Feed (Worker)

1. Login as a worker
2. Go to `/job-feed`
3. Should see available jobs

**Expected Result**: Should show jobs from backend that match worker's category

### 7. Test Job Application (Worker)

1. From job feed, click "Apply" on a job
2. Check dashboard for applications

**Expected Result**: Should create application in backend

### 8. Test Application Management (Client)

1. Login as client who has jobs with applications
2. Go to dashboard
3. Accept/reject applications

**Expected Result**: Should update application and job status in backend

## Troubleshooting

### CORS Errors
- Check that your backend CORS settings allow `http://localhost:5173`
- Verify `CORS_ALLOWED_ORIGINS` in backend settings

### 401 Unauthorized
- Check if you have valid users in your backend database
- Run the sample data script: `python scripts/sample_data.py`

### 404 Not Found
- Verify backend is running on correct port
- Check API endpoints match between frontend and backend

### Network Errors
- Check both servers are running
- Verify no firewall blocking connections
- Check browser console for detailed error messages

## Success Indicators

✅ Login works and redirects to dashboard  
✅ Workers list loads from backend  
✅ Job creation works  
✅ Job feed shows real data  
✅ Applications can be created and managed  
✅ All API calls go to `localhost:8000` (check Network tab)  
✅ No CORS errors in browser console  

## Fallback to Mocks

If you need to switch back to mocks temporarily:
```env
VITE_USE_REAL_API=false
```

Then restart the frontend server.
