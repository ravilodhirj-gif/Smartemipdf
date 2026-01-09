# SmartEMI - Advanced Financial Calculator & Strategist

SmartEMI is a premium, high-fidelity loan calculation engine built with React and powered by Google Gemini AI.

## 🛠️ Tech Stack
- **Framework**: React 19 (Native ES Modules)
- **AI**: Google Gemini 3 Flash (AI Strategist)
- **Charts**: Recharts (Interactive Viz)
- **PDF**: jsPDF (Exporting)

## 🚨 Fixing "Authentication Error" on Save
If the environment shows an "Authentication error" when you try to save to GitHub:

### Option A: The Failsafe Script (Recommended)
1. Download this project as a ZIP.
2. Extract it locally.
3. Open a terminal in the folder.
4. Run: `bash deploy.sh`
5. Follow the on-screen prompts to link and push to your GitHub.

### Option B: Manual Command Line
1. Create a new repository on [GitHub](https://github.com/new).
2. Run these commands in your project root:
   ```bash
   git init
   git add .
   git commit -m "Manual push fix"
   git branch -M main
   git remote add origin <YOUR_REPO_URL>
   git push -u origin main
   ```

## 🔑 Configuration
The app requires a Google Gemini API Key. In local development, ensure your environment provides `process.env.API_KEY`.

## 📝 License
MIT License. See [LICENSE](./LICENSE) for the full text.

---
*Built for financial clarity.*