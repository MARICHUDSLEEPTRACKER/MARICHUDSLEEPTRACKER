# MARIJAN SLEEP TRACKER

A mobile-friendly shared status board for GitHub Pages. The current status starts as **sleeping**. The supplied images are used for awake/asleep states.

## Important
This bundle is the website source, not a hosted website. To make status changes work for everyone, deploy the backend and connect its URL below. Do not put the secret codes into `app.js` or any public GitHub file.

## 1. Create Firebase project
1. Create a project at https://console.firebase.google.com/
2. Add a Realtime Database. Choose a region and start in locked/production mode.
3. In Project Settings > Service accounts, enable the Admin SDK when prompted. The Cloud Function uses its service identity.
4. Install Node.js 20 and Firebase CLI (`npm install -g firebase-tools`), then run `firebase login`.

## 2. Configure the backend
1. In this folder, run `firebase init functions database` and select the existing project. Choose JavaScript. If prompted about existing files, preserve this bundle's `functions/index.js` and `functions/package.json`.
2. In `database.rules.json`, use the rules below and deploy them.
3. From the `functions` directory, install dependencies with `npm install`.
4. Set the two codes as SHA-256 hashes, so the plain codes are not stored as secrets in the deployed function configuration. From the project root, use a local terminal to calculate them:
   - macOS/Linux: `printf 'CHUD' | shasum -a 256`
   - macOS/Linux: `printf 'SLEEPCHUD' | shasum -a 256`
   - Windows PowerShell: `([Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes('CHUD')))).ToLower()`
   - Repeat the PowerShell command with `SLEEPCHUD`.
5. Set each hash as a Firebase secret (use the exact hash output, not the original code):
   `firebase functions:secrets:set AWAKE_CODE_HASH`
   `firebase functions:secrets:set SLEEP_CODE_HASH`
6. Deploy the function: `firebase deploy --only functions:status,database`.
7. Copy the HTTPS URL shown for the `status` function.

## 3. Connect and publish
1. In `app.js`, replace `PASTE_YOUR_CLOUD_FUNCTION_URL_HERE` with the deployed HTTPS function URL.
2. Create a GitHub repository and upload `index.html`, `style.css`, `app.js`, `awake.jpeg`, and `sleeping.jpeg` to the repository root.
3. In repository Settings > Pages, choose deploy from the `main` branch and `/ (root)`.
4. Open the Pages URL. Anyone can view the status; only people who know one of the codes can change it.

## Database rules
Use `database.rules.json`. Clients cannot directly read/write the database; the backend uses the Admin SDK.

## Status behavior
- `CHUD` → awake image/status.
- `SLEEPCHUD` → sleeping image/status.
- Initial display → sleeping.
- The page checks for changes every 5 seconds, so everyone sees changes shortly after they're made.

## Security note
Because the two codes are simple, don't reuse them for important accounts. Anyone who knows a code can change the status. Firebase Cloud Functions may require the Blaze billing plan and a billing account, depending on current Firebase requirements and usage. Set a budget alert and review the project's billing settings.
