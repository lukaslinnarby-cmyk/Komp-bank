# KompSaldo Android offline

Projektet är konverterat från TanStack Start server-build till en statisk Vite SPA. Kör `npm install`, `npm run build`, `npx cap add android`, `npx cap sync android` och bygg debug APK med `cd android && ./gradlew assembleDebug`. GitHub Actions-workflow finns i `.github/workflows/android-apk.yml`.

OBS: localStorage är lokal för appen och fungerar utan nätverk, men kan försvinna när appdata rensas eller appen avinstalleras. Säkerhetskopiera saldot innan du avinstallerar. APK och offlinebeteende måste verifieras i GitHub Actions/på Android-enhet.
