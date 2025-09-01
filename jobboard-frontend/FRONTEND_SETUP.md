# Frontend Setup Guide

## Environment Configuration

Create a `.env` file in the `jobboard-frontend/` directory with the following content:

```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_USE_REAL_API=true

# Development settings
VITE_DEBUG=true
```

## How to Switch Between Mock and Real API

### Using Real Backend API (Recommended)
```env
VITE_USE_REAL_API=true
VITE_API_URL=http://localhost:8000
```

### Using Mock API (Fallback)
```env
VITE_USE_REAL_API=false
```

## Backend Requirements

Make sure your Django backend is running:
```bash
cd jobboard-backend
python manage.py runserver
```

The backend should be accessible at `http://localhost:8000`

## Testing the Connection

1. Start the backend: `python manage.py runserver`
2. Start the frontend: `npm run dev`
3. Try logging in with the sample users you created
4. Check browser network tab to see API calls to `localhost:8000`

## Troubleshooting

- **CORS errors**: Make sure your backend CORS settings allow `http://localhost:5173`
- **401 errors**: Check if you have valid users in your backend database
- **404 errors**: Verify the backend is running and accessible
- **Network errors**: Check if both frontend and backend are running on correct ports
