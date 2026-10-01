/*
 * GALLERY — Le Forbici d’Oro
 * ---------------------------------------------------------------
 * Per aggiungere una foto:
 *   1. salva l'immagine in assets/img/gallery/ (consigliato .webp)
 *        - versione grande:  nome-1600.webp  (lato lungo 1600px)
 *        - miniatura:        nome-800.webp   (lato lungo 800px)
 *   2. aggiungi (o modifica) una voce qui sotto.
 *
 * Campi:
 *   src      immagine grande, usata nel lightbox     (obbligatorio per le foto reali)
 *   thumb    miniatura per la griglia               (facoltativo, altrimenti usa src)
 *   width    larghezza di src in px                 (consigliato)
 *   height   altezza di src in px                   (consigliato)
 *   alt      descrizione della foto per accessibilità e SEO
 *   caption  didascalia breve mostrata nel lightbox
 *   featured true = riquadro grande (usarlo su UNA sola foto, idealmente la prima)
 *
 * Le voci con src: null vengono mostrate come placeholder.
 * Quando arrivano le foto reali basta sostituire null con il percorso.
 *
 * Esempio:
 *   { src: "assets/img/gallery/sfumatura-01-1600.webp",
 *     thumb: "assets/img/gallery/sfumatura-01-800.webp",
 *     width: 1600, height: 2000,
 *     alt: "Sfumatura bassa con riga laterale", caption: "Sfumatura" },
 */
// TUTTE PROVVISORIE (Unsplash, vedi README): sostituire con i lavori del negozio
window.GALLERY = [
  { src: "assets/img/gallery/forbici-pettine-1600.webp", thumb: "assets/img/gallery/forbici-pettine-1600.webp", width: 1600, height: 1067,
    alt: "Taglio con forbici e pettine sulla nuca", caption: "Forbici e pettine", featured: true },
  { src: "assets/img/gallery/collo-1600.webp", thumb: "assets/img/gallery/collo-800.webp", width: 1600, height: 1067,
    alt: "Rifinitura delle linee sul collo", caption: "Dettaglio" },
  { src: "assets/img/gallery/postazione-1600.webp", thumb: "assets/img/gallery/postazione-800.webp", width: 1600, height: 1067,
    alt: "Tosatrici e spazzole pronte sulla postazione", caption: "Gli attrezzi" },
  { src: "assets/img/gallery/attrezzi-1600.webp", thumb: "assets/img/gallery/attrezzi-800.webp", width: 1600, height: 1067,
    alt: "Mani del barbiere con forbici e pettine", caption: "Le mani" },
  { src: "assets/img/gallery/forbici-1600.webp", thumb: "assets/img/gallery/forbici-800.webp", width: 1600, height: 1067,
    alt: "Forbici e pettini ordinati sul pannello", caption: "Forbici" },
];
