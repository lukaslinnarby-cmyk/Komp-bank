# KompSaldo för Android + iOS

Projektet är förberett för Capacitor 8 med samma KompSaldo-kod på Android och iOS.

## Första gången

```powershell
npm.cmd install
npm.cmd run build
npx.cmd cap add android
npx.cmd cap add ios
npx.cmd cap sync
```

`android/` och `ios/` skapas då lokalt. De behöver bara läggas till en gång.

## Android

Öppna Android-projektet:

```powershell
npm.cmd run android:open
```

Android Studio öppnas. Där kan du köra appen på en ansluten Android-telefon eller bygga APK.

### Enklast via GitHub

Workflow-filen `.github/workflows/android-apk.yml` bygger automatiskt en debug-APK när projektet pushas till `main`. På GitHub: Actions → Build Android APK → senaste gröna körningen → Artifacts → KompSaldo-Android-APK.

## iPhone / iOS

För iOS behövs macOS med Xcode för den slutliga native-builden och signeringen.

```bash
npm install
npm run build
npx cap add ios
npx cap sync ios
npm run ios:open
```

Xcode öppnas. Välj ditt Apple Team under Signing & Capabilities och kör sedan på din iPhone. För distribution till andra används normalt TestFlight/App Store.

## Efter ändringar i KompSaldo

Kör:

```powershell
npm.cmd run mobile:sync
```

Det bygger webbappen och synkar samma version till både Android och iOS om plattformarna finns skapade.

## Appidentitet

- Appnamn: KompSaldo
- App ID / Bundle ID: `se.kompsaldo.app`
- Webboutput för Capacitor: `.output/public`

## Viktigt om offline

KompSaldo sparar sin användardata lokalt på enheten. Capacitor paketerar webbgränssnittet i native-appen; den ska därför inte behöva en extern webbserver för det vanliga appflödet.
