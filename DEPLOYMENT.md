# ☁️ How to Deploy Smart Expense Tracker

To make your website live on the internet, we'll use **Render** (for the server) and **TiDB Cloud** (for the free MySQL database).

## Step 1: Push Changes to GitHub
1.  Open your terminal in VS Code.
2.  Run these commands to save the latest deployment-ready changes:
    ```powershell
    git add .
    git commit -m "Prepare for deployment: relative paths and static files"
    git push origin main
    ```

## Step 2: Create a Free MySQL Database (TiDB Cloud)
1.  Go to [TiDB Cloud](https://tidbcloud.com/) and sign up (it's free).
2.  Create a new **Serverless Tier** cluster (Free forever).
3.  Once created, click **"Connect"**.
4.  Copy the connection details. You will need:
    - Host (e.g., `gateway01.us-west-2.prod.aws.tidbcloud.com`)
    - Port (e.g., `4000`)
    - User (e.g., `2.root`)
    - Password (you set this)
    - Database Name: Create a new database named `expense_tracker` in their SQL editor or use the default `test` one (and rename your .env variable).

## Step 3: Deploy Backend on Render
1.  Go to [Render.com](https://render.com/) and sign up.
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository (`ResearchRat`).
4.  **Settings**:
    - **Name**: `smart-expense-tracker`
    - **Root Directory**: `backend` (Important!)
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
5.  **Environment Variables** (Add these):
    - `PORT`: `5000`
    - `DB_HOST`: *(Your TiDB Host)*
    - `DB_USER`: *(Your TiDB User)*
    - `DB_PASSWORD`: *(Your TiDB Password)*
    - `DB_NAME`: `expense_tracker`
    - `DB_PORT`: `4000` (or whatever TiDB gives you)
    - `JWT_SECRET`: `something_very_secret_and_long`
6.  Click **"Create Web Service"**.

## Step 4: Initialize the Cloud Database
Since the cloud database is empty, you need to creating the tables.
1.  Connect to your TiDB database using MySQL Workbench (using the same credentials).
2.  Run the code from your `schema.sql` (fresh version) AND `auth_schema.sql` to create the tables.

## Step 5: Access Your Website
Once Render finishes building, it will give you a URL (e.g., `https://smart-expense-tracker.onrender.com`).
Click it, and your live app should appear! 🚀
