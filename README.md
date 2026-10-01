# Le Forbici d’Oro — sito web

Sito one-page statico (HTML + CSS + JavaScript, nessuna dipendenza).
Si pubblica copiando la cartella su qualsiasi hosting statico (Netlify, Vercel, GitHub Pages, hosting tradizionale).

## Struttura

```
index.html            pagina unica (tutte le sezioni)
css/styles.css        stile, con design tokens in cima al file
js/main.js            menu, gallery/lightbox, orari "aperto ora", mappa
js/gallery-data.js    ELENCO FOTO DELLA GALLERY (da modificare)
assets/favicon.svg
assets/img/
  hero/               foto principale (verticale 4:5)
  chi-siamo/          foto ambiente del negozio (orizzontale, molto larga)
  stile/              primo piano di un lavoro (4:5) + dettaglio (3:2)
  gallery/            foto dei lavori
  logo/               logo ufficiale (SVG o PNG trasparente)
```

## Palette (presa dal negozio)

Definita in cima a `css/styles.css`:
crema `#F5EFE3` (carta da parati dietro l’insegna) · nero caldo `#1A1614` e oro `#C29A45` (logo) ·
bordeaux `#7A2A28` (poltrone) · senape `#E2B13C` / `#F0DFAA` (pareti) · noce `#4A382C` (arredi).
Il logo nell’header e nel footer è un nastro nero con scritta oro in corsivo (font Pinyon Script), come l’insegna.

## Foto già inserite

Foto reali del negozio:
- `chi-siamo/esterno.webp` — ingresso su Via Nomentana (Chi siamo)
- `chi-siamo/interno.webp` — interno con le poltrone (non usata al momento)
- `logo/insegna-logo.webp` — insegna interna con il logo
- `og-image.jpg` — 1200×630 per la condivisione social

### ⚠ Foto PROVVISORIE da Unsplash (da sostituire prima di pubblicare)

Sono foto reali (non generate) con [licenza Unsplash](https://unsplash.com/license): uso commerciale
gratuito, attribuzione non obbligatoria. **Non sono lavori del negozio**: nella sezione "Lavori"
vanno sostituite con foto dei tagli fatti da Le Forbici d’Oro (es. dal loro Instagram), altrimenti
si mostrano ai clienti lavori di altri. Sono segnate con `PROVVISORIA` nel codice.

Regole: **nessun volto** e **niente ambienti diversi dal negozio** (poltrone, pavimenti, pareti che non ci sono). Solo primi piani con sfondo sfocato.
correzione colore (toni caldi, saturazione -12%) per uniformarle.

| File | Fotografo | Pagina |
|---|---|---|
| hero/hero-rasoio-* | Agustin Fernandez | https://unsplash.com/photos/1Pmp9uxK8X8 |
| stile/stile-forbici-* | Peter Vimalis | https://unsplash.com/photos/CMt1rgM5Y0I |
| stile/dettaglio-1200 | František Čaník | https://unsplash.com/photos/Xb_6OTCCnXo |
| gallery/forbici-pettine-* | Jonathan Cooper | https://unsplash.com/photos/sS3qRFsKZlg |
| gallery/collo-* | Hai Phung | https://unsplash.com/photos/m4Pd_e-4zKs |
| gallery/postazione-* | Federico Tonini | https://unsplash.com/photos/5WttPbwX73c |
| gallery/attrezzi-* | Ta Focando | https://unsplash.com/photos/i3x4Bjmt-Js |
| gallery/forbici-* | zlobniyy | https://unsplash.com/photos/y-VX9YhDd4c |

## Aggiungere le foto reali

Tutti i punti da sostituire sono segnati nel codice con commenti `FOTO …` e un riquadro
tratteggiato con etichetta (classe `.ph`). Per ogni punto:

1. Salvare la foto nella cartella indicata, in formato **WebP** (o AVIF), in due misure
   (es. `-900` e `-1600` px di larghezza). Strumento gratuito: <https://squoosh.app> (qualità 75–82).
2. In `index.html`, togliere il commento attorno allo snippet `<img …>` già pronto,
   aggiornare nomi file, `width`/`height` reali e il testo `alt`.
3. Eliminare la riga `<div class="ph" …></div>`.

**Gallery:** non serve toccare l’HTML. Si modifica solo `js/gallery-data.js`
(istruzioni ed esempio nel file). La prima foto con `featured: true` occupa il riquadro grande.

**Logo:** metterlo in `assets/img/logo/` e sostituire il nome testuale nell’header
(commento `LOGO` in `index.html`).

## Da completare con il proprietario

- **Servizi**: le voci attuali sono segnaposto (`data-placeholder`). Confermare nomi e
  descrizioni; prezzo e durata si inseriscono in `.svc-price` / `.svc-duration`
  (se vuoti non vengono mostrati).
- **Chi siamo**: spazio predisposto per storia/team (commento `PLACEHOLDER`).
- **Dominio**: in `<head>` compilare `canonical`, `og:url`, `og:image` (commento `TODO`).

## Informazioni usate (fornite dal cliente)

- Via Nomentana, 58 — 00015 Monterotondo RM
- Tel. 329 468 8952 (`tel:+393294688952`)
- Tutti i giorni 09:00–21:00
- Instagram: https://www.instagram.com/le.forbici.doro_2
- Facebook: https://www.facebook.com/p/Le-Forbici-DOro-2-100063562630242/
- Scheda Google: 146 recensioni (mostrato solo come dato, nessuna recensione riportata)

Nessun prezzo, nome, anno, recensione o sistema di prenotazione è stato inventato.

## Anteprima locale

```
npx serve .
```
oppure aprire direttamente `index.html` nel browser.
