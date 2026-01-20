# ☁️ How to Deploy on Vercel

We will deploy the frontend and backend together on **Vercel**, using a free **TiDB Cloud** database.

## Step 1: Push to GitHub
Make sure your latest code (including `vercel.json`) is pushed to GitHub:
```powershell
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

## Step 2: Create Free Database (TiDB Cloud)
*(If you already did this, skip to Step 3)*
1.  Go to [TiDB Cloud](https://tidbcloud.com/) and create a free Serverless Cluster.
2.  Get your **Connect** details: Host, User, Password, Port.
3.  **Important**: Run your SQL scripts (`schema.sql` + `auth_schema.sql`) in MySQL Workbench to create the tables in this new cloud database.

## Step 3: Deploy to Vercel
1.  Go to [Vercel](https://vercel.com/) and "Add New Project".
2.  Import your GitHub repository `ResearchRat`.
3.  **Configure Project**:
    - **Framework Preset**: select `Other`.
    - **Root Directory**: Leave it as `./` (Root).
    - **Environment Variables** (Expand section and add these):
        - `DB_HOST`: *(Your TiDB Host)*
        - `DB_USER`: *(Your TiDB User)*
        - `DB_PASSWORD`: *(Your TiDB Password)*
        - `DB_NAME`: `expense_tracker`
        - `DB_PORT`: `4000`
        - `JWT_SECRET`: `mysecretkey`
4.  Click **Deploy**.

## 🚀 Troubleshooting
- If Vercel complains about missing modules, ensure you run `npm install` in the `backend` folder locally before pushing, OR add a root `package.json` to help Vercel install them.
- **Root package.json approach** (Recommended if build fails):
  Create a `package.json` in the main folder with:
  ```json
  {
    "scripts": {
      "postinstall": "cd backend && npm install"
    }
  }
  ```
