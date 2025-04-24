# 📘 StudyBuddy - Frontend

This is the frontend for the StudyBuddy AI-powered study app. It is built with Create React App and ready for deployment on Vercel.

## 🔧 Setup Locally (Optional)
```bash
npm install
npm start
```

## 🛠 Build & Deploy
This project uses `react-scripts` (Create React App).

### Deploying on Vercel
1. Upload all files (including `package.json`, `public`, `src`) to GitHub
2. Connect to Vercel
3. On Vercel, use:
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. If you're seeing build failures:
   - Make sure `react-scripts` is listed in dependencies
   - Ensure you are not missing `public/index.html`

## ⚠️ Common Fixes
- If you see `react-scripts not found`, run `npm install`
- If build fails, confirm `index.html` exists in `public/` folder
