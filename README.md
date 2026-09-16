> **Mobilversion:** Projektet är förberett för Android + iOS med Capacitor. Se `MOBILE-README.md`.

# Komp Dagbok

Absolut. Om du menar Lovable kan du ge den den här prompten. Jag har skrivit den så att den förstår exakt hur appen ska fungera och se ut.

Kopiera hela texten:

Skapa en komplett svensk app för Android som heter "KompSaldo".

APPENS SYFTE:
Appen ska hålla koll på användarens komptid. Den ska fungera helt offline och spara all information lokalt på enheten. Ingen inloggning och ingen server/databas i molnet ska behövas.

HUVUDFUNKTIONER:

1. STARTSALDO
När appen används första gången ska användaren kunna skriva in sitt nuvarande kompsaldo i timmar.

Exempel:
"Fyll i ditt saldo här:"
[ 42,0 ] timmar

När användaren sparar ska 42,0 timmar bli det aktuella saldot.

2. AUTOMATISK INTJÄNING
Appen ska automatiskt lägga till 0,7 timmar på saldot för varje ny kalenderdag.

Detta ska fungera även om appen är helt stängd.

Exempel:
Måndag: 42,0 h
Tisdag: 42,7 h
Onsdag: 43,4 h
Torsdag: 44,1 h

Appen ska beräkna hur många kalenderdagar som gått sedan senaste beräkningen när appen öppnas och lägga till:
antal dagar × 0,7 timmar.

VIKTIGT:
0,7 timmar ska vara en inställning som användaren kan ändra senare.

3. TA LEDIGT
Det ska finnas en tydlig knapp:

"Ta ledigt"

Standardvärdet ska vara -8,3 timmar.

När användaren trycker på knappen ska 8,3 timmar dras från saldot.

Exempel:
42,0 h → tryck "Ta ledigt" → 33,7 h.

Även -8,3 timmar ska kunna ändras i inställningar.

4. KOMPA
Det ska finnas en funktion:

"Kompa"

med ett inmatningsfält:

"Fyll i hur många timmar"

Exempel:
[ 4,5 ] [+]
→ saldot ökar med 4,5 timmar.

Användaren ska kunna skriva decimaler med både komma och punkt.

5. TOTALT SALDO
Det aktuella saldot ska visas mycket tydligt och stort.

Exempel:

Totalt saldo

42,0 h

Detta ska vara den viktigaste siffran på startsidan.

6. HISTORIK
Visa en historik över alla förändringar.

Exempel:

Historik

09 sep
+0,7 h
Automatisk intjäning
Saldo: 42,7 h

08 sep
-8,3 h
Ledig
Saldo: 42,0 h

07 sep
+4,0 h
Kompa
Saldo: 50,3 h

Historiken ska sparas lokalt och finnas kvar när appen stängs och öppnas igen.

7. ÅNGRA
Lägg till en knapp:

"Ångra senaste"

Den ska kunna ångra den senaste manuella ändringen.

8. OFFLINE
Appen ska fungera 100 % offline.

All data ska sparas lokalt på Android-enheten.

Appen ska INTE kräva:
- internet
- konto
- registrering
- molndatabas
- server

Använd lokal persistent lagring.

9. INSTÄLLNINGAR
Skapa en enkel inställningssida där användaren kan ändra:

Daglig intjäning:
[ 0,7 ] timmar

Ledig:
[ 8,3 ] timmar

Det ska också finnas:
"Ändra startsaldo"

samt:
"Nollställ all data"

Vid nollställning ska användaren få en bekräftelseruta innan all data raderas.

DESIGN:

Utgå från en modern Android-app med ett rent och enkelt gränssnitt.

Startsidan ska ungefär ha denna struktur:

KompSaldo

Fyll i ditt saldo här:
[ 42,0 ] timmar


TA LEDIGT
[ -8,3 timmar ] [ − ]


KOMPA
[ Fyll i hur många timmar ] [ + ]


┌──────────────────────────┐
│       Totalt saldo       │
│                          │
│        42,0 h            │
└──────────────────────────┘


Historik

+ 0,7 h    Automatisk intjäning
- 8,3 h    Ledig
+ 4,0 h    Kompa


Designen ska vara:
- modern
- enkel
- tydlig
- mobilanpassad
- stora knappar
- stora siffror
- lätt att använda med en hand

Använd gärna:
- grönt för att lägga till tid
- rött för att dra av tid
- blått för totalsaldot
- vita eller mycket ljusa bakgrunder
- rundade kort och knappar

VIKTIG LOGIK:

Saldot får aldrig "glömma" tidigare dagar.

Om användaren exempelvis har:
Startsaldo = 42,0 h
Senaste beräkning = 1 september

och öppnar appen 9 september ska appen automatiskt räkna:

8 dagar × 0,7 = 5,6 h

Nytt saldo:
47,6 h

Därefter ska senaste beräkningsdatum uppdateras till 9 september så att samma dagar inte räknas två gånger.

Om användaren öppnar appen flera gånger samma dag ska 0,7 timmar INTE läggas till flera gånger.

Använd kalenderdatum, inte antal gånger appen öppnas.

VIKTIGT OM HISTORIK:
Automatiskt intjänad tid ska också kunna visas i historiken.

Exempel:

9 sep  +0,7 h  Automatisk intjäning
8 sep  +0,7 h  Automatisk intjäning
7 sep  +0,7 h  Automatisk intjäning

TEKNIK:
Bygg appen så att den kan installeras på Android.

Prioritera en riktig fungerande mobilapp framför en webb-demo.

Om Lovable behöver välja teknik, använd en Android-kompatibel lösning med persistent lokal lagring.

Appen ska fungera utan internet efter installation.

Skapa alla sidor, funktioner, knappar, datalagring och beräkningar färdiga.

Testa särskilt:
1. Startsaldo sparas.
2. Appen kommer ihåg saldot efter omstart.
3. +0,7 timmar läggs till exakt en gång per ny kalenderdag.
4. -8,3 timmar fungerar.
5. Kompa med valfritt antal timmar fungerar.
6. Historiken sparas.
7. Ångra fungerar.
8. Inställningar fungerar.
9. Appen fungerar utan internet.
10. Data försvinner inte när appen stängs.

Gör nu hela appen färdig och funktionell, inte bara en design/mockup.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://komp-time-buddy.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/37708b3e-9f4f-4c0b-9ee6-420b9eac6922).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
