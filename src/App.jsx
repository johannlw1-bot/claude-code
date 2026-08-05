import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Waves,
  Baby,
  Sailboat,
  Trees,
  Dog,
  Car,
  Anchor,
  Umbrella,
  Pizza,
  IceCream,
  Beef,
  Salad,
  Wheat,
  Sun,
  BedDouble,
  ChevronDown,
} from 'lucide-react';

/* ==========================================================================
   ⚠️  DATENPFLEGE — HIER ZUERST ARBEITEN
   --------------------------------------------------------------------------
   Alles mit `null` ist UNBESTÄTIGT und erscheint auf der Seite als sichtbar
   markierter Platzhalter. Sobald ein Wert bestätigt ist, hier eintragen —
   der Platzhalter verschwindet dann automatisch.

   Bewusst NICHT geraten: Telefon (drei Nummern kursieren im Netz),
   Öffnungszeiten, Saison, sämtliche Preise, E-Mail.
   ========================================================================== */

const DATEN = {
  name: 'Strandbad Tschinder',
  ort: 'Döbriach am Millstätter See',
  strasse: 'Seepromenade 46',
  plz: '9873',
  gemeinde: 'Döbriach, Gemeinde Radenthein',
  land: 'Kärnten, Österreich',

  // Im Netz kursieren +43 4246 3522, +43 4246 7937 und 0650 6072346.
  telefon: null, // z.B. '+43 4246 3522'
  telefonRoh: null, // z.B. '+4342463522'  (für den tel:-Link)
  email: null, // z.B. 'info@tschinder.at'

  saison: null, // z.B. 'Mai bis September'
  badVon: null, // z.B. '09:00'
  badBis: null, // z.B. '19:00'
  kuecheVon: null, // z.B. '11:30'
  kuecheBis: null, // z.B. '20:30'

  instagram: null,
  facebook: null,

  // Diese Angaben decken sich über mehrere unabhängige Quellen hinweg.
  seit: '1954',
  flaeche: '6.000',
  liegen: '550',
};

const PREISE = [
  { was: 'Tageskarte Erwachsene', preis: null },
  { was: 'Tageskarte Kinder', preis: null },
  { was: 'Liegestuhl', preis: null },
  { was: 'Sonnenschirm', preis: null },
  { was: 'Saisonkarte', preis: null },
  { was: 'Parkplatz', preis: null },
];

/* --------------------------------------------------------------------------
   BILDER — Slots für die Fotos, die noch kommen.
   `src: null` zeigt eine beschriftete Platzhalterfläche im richtigen Format.
   -------------------------------------------------------------------------- */

const BILDER = {
  hero: { src: null, alt: 'Liegewiese und Millstätter See', wunsch: 'Liegewiese mit See und Bergen, quer, hohe Auflösung' },
  wiese: { src: null, alt: 'Liegewiese unter altem Baumbestand', wunsch: 'Wiese unter den alten Bäumen' },
  steg: { src: null, alt: 'Steg am Millstätter See', wunsch: 'Steg und Wasserrutsche' },
  pizza: { src: null, alt: 'Hausgemachte Pizza', wunsch: 'Pizza aus dem Ofen, nah' },
  restaurant: { src: null, alt: 'Terrasse des Strandrestaurants', wunsch: 'Terrasse mit Seeblick' },
  kinder: { src: null, alt: 'Kinderbecken und Nichtschwimmerbereich', wunsch: 'Kinderbereich' },
  wohnung: { src: null, alt: 'Ferienwohnung am Bad', wunsch: 'Eine der zwei Ferienwohnungen' },
  historie: { src: null, alt: 'Das Strandbad in den Fünfzigerjahren', wunsch: 'Altes Foto aus den 1950ern — das wertvollste Bild überhaupt' },
};

const AUSSTATTUNG = [
  { icon: Trees, titel: 'Wiese unter alten Bäumen', text: 'Großzügige Liegeflächen, gepflegter Rasen und Schatten, wo man ihn am Nachmittag braucht.' },
  { icon: Baby, titel: 'Kinderbecken & Nichtschwimmer', text: 'Flaches, ruhiges Wasser mit eigenem Bereich. Der Grund fällt sanft ab.' },
  { icon: Waves, titel: 'Wasserrutsche am Steg', text: 'Die kleine Rutsche am Steg. Für viele Kinder der eigentliche Grund herzukommen.' },
  { icon: Sailboat, titel: 'Boote & Tretboote', text: 'Verleih direkt am Ufer. Einmal hinaus auf den See und die Perspektive dreht sich.' },
  { icon: Umbrella, titel: 'Strandbar', text: 'Kaltes und Kaffee, ohne dass man den Liegeplatz aufgeben muss.' },
  { icon: Anchor, titel: 'Tauchschule', text: 'Der Millstätter See ist tief und klar. Die Tauchschule ist am Bad.' },
  { icon: Dog, titel: 'Hunde willkommen', text: 'Eigener Bereich am See. Der Hund muss nicht im Auto warten.' },
  { icon: Car, titel: 'Parken', text: 'Parkplätze direkt beim Bad, günstig.' },
];

const KARTE = [
  { icon: Pizza, titel: 'Pizza aus dem Ofen', text: 'Hausgemacht und der Grund, warum Leute auch ohne Badezeug herkommen.' },
  { icon: Beef, titel: 'Schnitzel & Steaks', text: 'Die klassische Kärntner Wirtshausküche, ordentlich gemacht.' },
  { icon: Wheat, titel: 'Pasta', text: 'Einfache Nudelgerichte, auch für den kleinen Hunger zwischendurch.' },
  { icon: Salad, titel: 'Salate', text: 'Frisch, für die heißen Tage im Hochsommer.' },
  { icon: IceCream, titel: 'Eisbecher', text: 'Die Eiskarte am Nachmittag — Tradition am Ostufer.' },
  { icon: Baby, titel: 'Kinderteller', text: 'Eigene kleine Karte für die Kleinen.' },
];

const TAGESLAUF = [
  { zeit: () => DATEN.badVon, titel: 'Kassa öffnet', text: 'Die Wiese ist noch leer. Die besten Plätze unter den Bäumen sind jetzt frei.' },
  { zeit: () => DATEN.kuecheVon, titel: 'Küche öffnet', text: 'Der Ofen ist auf Temperatur, die erste Pizza geht raus.' },
  { zeit: () => null, titel: 'Mittag am Steg', text: 'Höchststand. Rutsche, Tretboote, volle Wiese, Kinderlärm.' },
  { zeit: () => DATEN.kuecheBis, titel: 'Letzte Bestellung', text: 'Danach nur noch Eis und Getränke.' },
  { zeit: () => DATEN.badBis, titel: 'Sperrstunde', text: 'Das Abendlicht liegt flach über dem Ostufer. Die schönste Stunde.' },
];

const NAV = [
  { label: 'Das Bad', href: '#bad' },
  { label: 'Küche', href: '#kueche' },
  { label: 'Zeiten', href: '#zeiten' },
  { label: 'Preise', href: '#preise' },
  { label: 'Anfahrt', href: '#anfahrt' },
];

const EASE = [0.16, 1, 0.3, 1];

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&family=Yellowtail&display=swap');

html { scroll-behavior: smooth; }

::selection { background: #E8B04B; color: #0B3B3C; }

:focus-visible {
  outline: 2px solid #0B3B3C;
  outline-offset: 3px;
  border-radius: 4px;
}

/* Ein zurückbleibendes filter:blur(0px) macht das Element zum Backdrop-Root
   und würde verschachtelte Effekte flachdrücken. Nach der Animation weg damit. */
.reveal-fertig { filter: none !important; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
`;

/* ==========================================================================
   Bausteine
   ========================================================================== */

function Reveal({ children, className = '', delay = 0, y = 24 }) {
  const reduce = useReducedMotion();
  const [fertig, setFertig] = useState(false);

  return (
    <motion.div
      className={`${className} ${fertig ? 'reveal-fertig' : ''}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      onAnimationComplete={() => setFertig(true)}
    >
      {children}
    </motion.div>
  );
}

function AufsteigenderText({ text, className = '', stagger = 0.05 }) {
  const reduce = useReducedMotion();
  const woerter = String(text).split(' ');

  return (
    <motion.span
      aria-label={text}
      className={`inline-block ${className}`}
      initial="aus"
      whileInView="an"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ aus: {}, an: { transition: { staggerChildren: stagger } } }}
    >
      {woerter.map((wort, i) => (
        <motion.span
          key={`${wort}-${i}`}
          aria-hidden="true"
          className="inline-block"
          variants={{
            aus: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
            an: reduce
              ? { opacity: 1, transition: { duration: 0.4 } }
              : { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
          }}
        >
          {wort}
          {i < woerter.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}

/** Zeigt einen bestätigten Wert — oder einen unübersehbaren Platzhalter. */
function Wert({ wert, platzhalter = 'noch offen', className = '' }) {
  if (wert !== null && wert !== undefined && wert !== '') {
    return <span className={className}>{wert}</span>;
  }
  return (
    <span
      title="Dieser Wert ist noch nicht bestätigt und darf so nicht online gehen."
      className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-rot/60 bg-rot/10 px-2 py-0.5 align-middle font-body text-[0.8em] font-medium text-rot"
    >
      {platzhalter}
    </span>
  );
}

/** Bild-Slot: echtes Foto, sonst eine beschriftete Fläche im richtigen Format. */
function Bild({ bild, className = '', ratio = 'aspect-[4/3]', prioritaet = false, ohneLabel = false }) {
  if (bild?.src) {
    return (
      <img
        src={bild.src}
        alt={bild.alt}
        loading={prioritaet ? 'eager' : 'lazy'}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`Platzhalter: ${bild?.alt ?? 'Foto folgt'}`}
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-seehell/50 via-see/30 to-sonne/40 ${ratio} ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.18] [background-image:repeating-linear-gradient(135deg,#0B3B3C_0_1px,transparent_1px_10px)]" />
      {!ohneLabel && (
        <>
          <span className="relative rounded-full bg-sandhell/90 px-4 py-1.5 text-center font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-tief">
            Foto folgt
          </span>
          {bild?.wunsch && (
            <span className="relative mt-2 max-w-[80%] text-center font-body text-[11px] leading-snug text-tief/70">
              {bild.wunsch}
            </span>
          )}
        </>
      )}
    </div>
  );
}

function Auge({ children, className = '' }) {
  return (
    <span className={`font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-see ${className}`}>
      {children}
    </span>
  );
}

/* ==========================================================================
   Kopf
   ========================================================================== */

function Kopf() {
  const [offen, setOffen] = useState(false);
  const [gescrollt, setGescrollt] = useState(false);

  useEffect(() => {
    const beiScroll = () => setGescrollt(window.scrollY > 40);
    beiScroll();
    window.addEventListener('scroll', beiScroll, { passive: true });
    return () => window.removeEventListener('scroll', beiScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        gescrollt ? 'bg-sand/95 shadow-[0_1px_0_rgba(11,59,60,0.12)] backdrop-blur-sm' : ''
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
        {/* Über dem dunklen Hero hell, ab dem Scrollen dunkel auf Sand. */}
        <a
          href="#oben"
          className={`font-schrift text-3xl leading-none transition-colors duration-500 lg:text-4xl ${
            gescrollt ? 'text-tief' : 'text-sandhell'
          }`}
        >
          Tschinder
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`font-body text-[14px] font-medium transition-colors duration-500 ${
                gescrollt ? 'text-tief/70 hover:text-tief' : 'text-sandhell/80 hover:text-sandhell'
              }`}
            >
              {n.label}
            </a>
          ))}
          {DATEN.telefonRoh ? (
            <a
              href={`tel:${DATEN.telefonRoh}`}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-[14px] font-semibold transition-transform hover:scale-[1.03] ${
                gescrollt ? 'bg-tief text-sandhell' : 'bg-sandhell text-tief'
              }`}
            >
              <Phone className="h-4 w-4" strokeWidth={2} />
              {DATEN.telefon}
            </a>
          ) : (
            <span
              className={`rounded-full border border-dashed px-4 py-2 font-body text-[13px] font-semibold ${
                gescrollt ? 'border-rot/60 bg-rot/10 text-rot' : 'border-sandhell/70 bg-rot text-sandhell'
              }`}
            >
              Telefonnummer fehlt
            </span>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOffen((v) => !v)}
          aria-expanded={offen}
          aria-label={offen ? 'Menü schließen' : 'Menü öffnen'}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-500 lg:hidden ${
            gescrollt || offen ? 'bg-tief text-sandhell' : 'bg-sandhell text-tief'
          }`}
        >
          {offen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {offen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden bg-sand/95 backdrop-blur-sm lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-5">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOffen(false)}
                  className="rounded-xl px-3 py-3 font-body text-[15px] font-medium text-tief/80 hover:bg-tief/5"
                >
                  {n.label}
                </a>
              ))}
              {DATEN.telefonRoh && (
                <a
                  href={`tel:${DATEN.telefonRoh}`}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-tief px-5 py-3.5 font-body text-[15px] font-semibold text-sandhell"
                >
                  <Phone className="h-4 w-4" />
                  {DATEN.telefon}
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ==========================================================================
   Hero
   ========================================================================== */

function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section id="oben" ref={ref} className="relative min-h-[92svh] overflow-hidden pt-24">
      {/* Kein -z-10: das läge hinter dem bg-sand des Wurzelelements und wäre unsichtbar. */}
      <motion.div style={reduce ? undefined : { y, scale }} className="absolute inset-0">
        <Bild bild={BILDER.hero} ratio="" prioritaet ohneLabel className="h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-tief/45 via-tief/40 to-tief/75" />
      </motion.div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-end px-5 pb-14 pt-16 lg:px-10 lg:pb-20">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-sandhell/90 px-4 py-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.18em] text-tief">
            <Sun className="h-3.5 w-3.5 text-sonne" strokeWidth={2.5} />
            In Familienhand seit {DATEN.seit}
          </span>
        </Reveal>

        <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.6rem,7.5vw,6rem)] font-extrabold leading-[0.95] tracking-tight text-sandhell drop-shadow-[0_2px_20px_rgba(11,59,60,0.35)]">
          <AufsteigenderText text="Ein Tag am Ostufer, so wie er sein soll." />
        </h1>

        <Reveal delay={0.25}>
          <p className="mt-7 max-w-xl font-body text-[16px] leading-relaxed text-sandhell/95 lg:text-[18px]">
            Familienstrandbad mit Restaurant in Döbriach. {DATEN.flaeche} m² Liegewiese unter altem
            Baumbestand, flaches Wasser für die Kinder und eine Pizza, für die Leute auch ohne
            Badezeug kommen.
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#zeiten"
              className="flex items-center gap-2 rounded-full bg-rot px-7 py-4 font-body text-[15px] font-semibold text-sandhell transition-transform hover:scale-[1.03]"
            >
              Zeiten und Preise
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </a>
            <a
              href="#anfahrt"
              className="flex items-center gap-2 rounded-full bg-sandhell/90 px-7 py-4 font-body text-[15px] font-semibold text-tief transition-transform hover:scale-[1.03]"
            >
              <MapPin className="h-4 w-4" strokeWidth={2.2} />
              Anfahrt
            </a>
          </div>
        </Reveal>

        {/* Die drei Dinge, die Gäste zuerst suchen. */}
        <Reveal delay={0.45}>
          <dl className="mt-12 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl bg-tief/15 sm:grid-cols-3">
            {[
              { k: 'Geöffnet', v: DATEN.badVon && DATEN.badBis ? `${DATEN.badVon} – ${DATEN.badBis}` : null, p: 'Zeiten offen' },
              { k: 'Küche', v: DATEN.kuecheVon && DATEN.kuecheBis ? `${DATEN.kuecheVon} – ${DATEN.kuecheBis}` : null, p: 'Zeiten offen' },
              { k: 'Saison', v: DATEN.saison, p: 'Saison offen' },
            ].map((z) => (
              <div key={z.k} className="bg-sandhell px-5 py-4">
                <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-see">
                  {z.k}
                </dt>
                <dd className="mt-1.5 font-display text-[19px] font-bold text-tief">
                  <Wert wert={z.v} platzhalter={z.p} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   Das Bad
   ========================================================================== */

function DasBad() {
  return (
    <section id="bad" className="scroll-mt-24 bg-sand px-5 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <Auge>Das Bad</Auge>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.02] tracking-tight text-tief">
            <AufsteigenderText text="Wiese, Wasser, Schatten. Mehr braucht ein Sommertag nicht." />
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-tief/15 lg:grid-cols-4">
            {[
              { zahl: DATEN.flaeche, einheit: 'm² Liegewiese', hinweis: 'Platz auch am vollen Tag' },
              { zahl: DATEN.liegen, einheit: 'Liegeplätze', hinweis: 'Liegen und Schirme zu mieten' },
              { zahl: DATEN.seit, einheit: 'seit', hinweis: 'in Familienhand' },
              { zahl: '2', einheit: 'Ferienwohnungen', hinweis: 'direkt am Bad' },
            ].map((s) => (
              <div key={s.einheit} className="bg-sandhell p-6 lg:p-8">
                <p className="font-display text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-none text-tief">
                  {s.zahl}
                </p>
                <p className="mt-2 font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-see">
                  {s.einheit}
                </p>
                <p className="mt-1.5 font-body text-[13px] text-tief/55">{s.hinweis}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="h-[300px] overflow-hidden rounded-3xl lg:h-[420px]">
              <Bild bild={BILDER.wiese} ratio="" />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="h-[300px] overflow-hidden rounded-3xl lg:h-[420px]">
              <Bild bild={BILDER.steg} ratio="" />
            </div>
          </Reveal>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUSSTATTUNG.map((a, i) => (
            <Reveal key={a.titel} delay={0.05 * i} y={18}>
              <div className="h-full rounded-2xl bg-sandhell p-6 transition-transform duration-300 hover:-translate-y-1">
                <a.icon className="h-5 w-5 text-see" strokeWidth={1.8} />
                <h3 className="mt-5 font-display text-[19px] font-bold leading-tight text-tief">
                  {a.titel}
                </h3>
                <p className="mt-2 font-body text-[14px] leading-relaxed text-tief/60">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Küche
   ========================================================================== */

function Kueche() {
  return (
    <section id="kueche" className="scroll-mt-24 bg-tief px-5 py-24 text-sandhell lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-2">
          <Reveal>
            <Auge className="text-sonne">Die Küche</Auge>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.02] tracking-tight">
              <AufsteigenderText text="Die Pizza ist der Grund, warum viele zuerst kommen." />
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="font-body text-[16px] leading-relaxed text-sandhell/70 lg:text-[17px]">
              Hausgemacht, aus dem Ofen, seit Jahrzehnten nach demselben Prinzip: wenige Zutaten,
              ordentlich gemacht. Dazu Wirtshausküche, Eisbecher am Nachmittag und eine eigene Karte
              für die Kinder. Gegessen wird in Badehose — das gehört hier dazu.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-[320px] overflow-hidden rounded-3xl lg:h-[460px]">
              <Bild bild={BILDER.pizza} ratio="" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-[320px] overflow-hidden rounded-3xl lg:h-[460px]">
              <Bild bild={BILDER.restaurant} ratio="" />
            </div>
          </Reveal>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KARTE.map((k, i) => (
            <Reveal key={k.titel} delay={0.05 * i} y={18}>
              <div className="h-full rounded-2xl border border-sandhell/15 bg-sandhell/[0.06] p-7 transition-colors duration-300 hover:bg-sandhell/[0.11]">
                <k.icon className="h-5 w-5 text-sonne" strokeWidth={1.8} />
                <h3 className="mt-5 font-display text-[20px] font-bold leading-tight">{k.titel}</h3>
                <p className="mt-2 font-body text-[14px] leading-relaxed text-sandhell/60">{k.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-dashed border-sonne/50 bg-sonne/10 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-[19px] font-bold">Speisekarte</p>
              <p className="mt-1 font-body text-[14px] text-sandhell/70">
                Die aktuelle Karte mit Preisen fehlt noch — schick sie mir, dann kommt sie hier
                herein.
              </p>
            </div>
            <span className="rounded-full border border-dashed border-sonne/60 px-4 py-2 font-body text-[13px] font-semibold text-sonne">
              folgt
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   Der Tagesbogen — Öffnungszeiten auf der Sonnenbahn
   ========================================================================== */

function Tagesbogen() {
  // Punkte liegen auf der Parabel y = (1-2t)², also exakt auf dem gezeichneten Bogen.
  const punkte = TAGESLAUF.map((s, i) => {
    const t = 0.1 + (0.8 * i) / (TAGESLAUF.length - 1);
    return { ...s, t, hoch: Math.pow(1 - 2 * t, 2) };
  });

  return (
    <section id="zeiten" className="scroll-mt-24 bg-sand px-5 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <Auge>Der Tag</Auge>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.02] tracking-tight text-tief">
            <AufsteigenderText text="Von der ersten Runde bis zum flachen Abendlicht." />
          </h2>
          <p className="mt-6 font-body text-[16px] leading-relaxed text-tief/60">
            Ein Strandbad ist kein Gebäude, sondern ein Tagesablauf. Hier ist er.
          </p>
        </Reveal>

        {/* Bogen ab Tablet */}
        <div className="relative mt-20 hidden h-[340px] md:block">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M 0 100 Q 50 -100 100 100"
              fill="none"
              stroke="#E8B04B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {punkte.map((p, i) => (
            <motion.div
              key={p.titel}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 * i }}
              className="absolute w-[19%] text-center"
              // x/y gehören in den Motion-Transform: Tailwinds -translate-*
              // würde von framer-motions eigenem inline-transform überschrieben.
              // y = -6px setzt den Punkt selbst auf die Kurve, der Text fließt darunter.
              style={{ left: `${p.t * 100}%`, top: `${p.hoch * 100}%`, x: '-50%', y: -6 }}
            >
              <span className="mx-auto mb-3 block h-3 w-3 rounded-full bg-sonne ring-4 ring-sand" />
              <p className="font-display text-[17px] font-extrabold leading-none text-tief">
                <Wert wert={p.zeit()} platzhalter="Zeit" />
              </p>
              <p className="mt-2 font-body text-[13px] font-semibold text-see">{p.titel}</p>
              <p className="mt-1.5 font-body text-[12px] leading-snug text-tief/50">{p.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Am Handy kippt der Bogen in die Senkrechte */}
        <div className="mt-12 flex flex-col gap-5 md:hidden">
          {TAGESLAUF.map((s, i) => (
            <Reveal key={s.titel} delay={0.05 * i} y={16}>
              <div className="flex gap-4 border-l-2 border-dashed border-sonne pl-5">
                <div>
                  <p className="font-display text-[18px] font-extrabold leading-none text-tief">
                    <Wert wert={s.zeit()} platzhalter="Zeit" />
                  </p>
                  <p className="mt-1.5 font-body text-[14px] font-semibold text-see">{s.titel}</p>
                  <p className="mt-1 font-body text-[13px] leading-snug text-tief/55">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-16 rounded-2xl bg-sandhell p-6 font-body text-[15px] leading-relaxed text-tief/70">
            <strong className="font-semibold text-tief">Saison:</strong>{' '}
            <Wert wert={DATEN.saison} platzhalter="Saisonzeitraum noch offen" /> — bei
            durchwachsenem Wetter kann sich der Betrieb ändern. Im Zweifel kurz anrufen.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   Preise
   ========================================================================== */

function Preise() {
  return (
    <section id="preise" className="scroll-mt-24 bg-sand px-5 pb-24 lg:px-10 lg:pb-32">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <Auge>Preise</Auge>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight text-tief">
            <AufsteigenderText text="Was der Tag kostet." />
          </h2>
          <p className="mt-6 font-body text-[16px] leading-relaxed text-tief/60">
            Ohne Kleingedrucktes. Was hier steht, zahlt man an der Kassa.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-12 divide-y divide-tief/10 overflow-hidden rounded-3xl bg-sandhell">
            {PREISE.map((p) => (
              <li key={p.was} className="flex items-center justify-between gap-6 px-6 py-5 lg:px-8">
                <span className="font-body text-[15px] font-medium text-tief lg:text-[16px]">
                  {p.was}
                </span>
                <span className="font-display text-[19px] font-extrabold text-tief">
                  <Wert wert={p.preis} platzhalter="offen" />
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   Ferienwohnungen — bewusst kurz gehalten
   ========================================================================== */

function Wohnungen() {
  return (
    <section className="bg-sand px-5 pb-24 lg:px-10 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-0 overflow-hidden rounded-3xl bg-schatten text-sandhell lg:grid-cols-2">
            <div className="h-[260px] lg:h-full lg:min-h-[320px]">
              <Bild bild={BILDER.wohnung} ratio="" />
            </div>
            <div className="p-8 lg:p-12">
              <Auge className="text-sonne">Übernachten</Auge>
              <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-extrabold leading-[1.05]">
                Zwei Ferienwohnungen, direkt am Bad
              </h2>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-sandhell/70">
                Im ersten Stock, je für drei bis vier Personen, mit Küchenzeile, Dusche, WC und
                Fernseher. Morgens vor allen anderen im Wasser — das ist der eigentliche Luxus.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {DATEN.telefonRoh ? (
                  <a
                    href={`tel:${DATEN.telefonRoh}`}
                    className="flex items-center gap-2 rounded-full bg-sonne px-6 py-3 font-body text-[14px] font-semibold text-tief"
                  >
                    <Phone className="h-4 w-4" strokeWidth={2.2} />
                    Anfragen
                  </a>
                ) : (
                  <span className="rounded-full border border-dashed border-sonne/60 px-5 py-2.5 font-body text-[13px] font-semibold text-sonne">
                    Telefonnummer fehlt
                  </span>
                )}
                {DATEN.email && (
                  <a
                    href={`mailto:${DATEN.email}?subject=Anfrage%20Ferienwohnung`}
                    className="flex items-center gap-2 rounded-full border border-sandhell/30 px-6 py-3 font-body text-[14px] font-semibold text-sandhell"
                  >
                    <Mail className="h-4 w-4" strokeWidth={2.2} />
                    E-Mail
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   Seit 1954
   ========================================================================== */

function Geschichte() {
  return (
    <section className="bg-sandhell px-5 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="overflow-hidden rounded-3xl">
            <div className="h-[320px] lg:h-[460px]">
              <Bild bild={BILDER.historie} ratio="" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Auge>Seit {DATEN.seit}</Auge>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight text-tief">
            <AufsteigenderText text="Vier Generationen, dieselbe Wiese." />
          </h2>
          <div className="mt-7 flex flex-col gap-5 font-body text-[16px] leading-relaxed text-tief/70">
            <p>
              Seit {DATEN.seit} ist das Strandbad in Familienhand. Wer heute mit den eigenen Kindern
              auf der Wiese liegt, lag hier oft selbst schon als Kind — und die Eltern davor.
            </p>
            <p>
              Viel hat sich in dieser Zeit nicht verändert, und das ist kein Versäumnis, sondern der
              Punkt. Der Baumbestand ist älter geworden, die Rutsche steht noch immer am Steg.
            </p>
            <p className="rounded-2xl border border-dashed border-rot/40 bg-rot/5 p-5 text-[15px] text-tief/70">
              <strong className="font-semibold text-rot">Hier fehlt das Beste:</strong> Wer den
              Betrieb heute führt, und wie es {DATEN.seit} angefangen hat. Zwei, drei Sätze aus
              erster Hand sind an dieser Stelle mehr wert als jede Werbezeile — dazu ein altes Foto,
              falls sich eines findet.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   Anfahrt
   ========================================================================== */

function Anfahrt() {
  const adresse = `${DATEN.strasse}, ${DATEN.plz} ${DATEN.gemeinde}`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${DATEN.name} ${adresse}`,
  )}`;

  return (
    <section id="anfahrt" className="scroll-mt-24 bg-sand px-5 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <Auge>Anfahrt</Auge>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight text-tief">
            <AufsteigenderText text="Am Ostufer, in Döbriach." />
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="group relative flex h-[320px] items-center justify-center overflow-hidden rounded-3xl bg-seehell/30 lg:h-[420px]"
            >
              <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(45deg,#1B8A86_0_1px,transparent_1px_14px)]" />
              <div className="relative flex flex-col items-center gap-3 text-center">
                <MapPin className="h-8 w-8 text-tief" strokeWidth={1.8} />
                <p className="font-display text-[20px] font-bold text-tief">In Google Maps öffnen</p>
                <p className="max-w-xs font-body text-[13px] leading-snug text-tief/60">
                  Bewusst als Link statt als eingebettete Karte — eine Google-Maps-Einbettung setzt
                  Cookies und bräuchte einen Cookie-Hinweis.
                </p>
                <span className="mt-1 flex items-center gap-1.5 font-body text-[14px] font-semibold text-rot">
                  Route planen
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-6 rounded-3xl bg-sandhell p-8">
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-see">
                  Adresse
                </p>
                <p className="mt-2 font-display text-[19px] font-bold leading-snug text-tief">
                  {DATEN.name}
                  <br />
                  {DATEN.strasse}
                  <br />
                  {DATEN.plz} {DATEN.gemeinde}
                </p>
              </div>

              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-see">
                  Telefon
                </p>
                <p className="mt-2">
                  {DATEN.telefonRoh ? (
                    <a
                      href={`tel:${DATEN.telefonRoh}`}
                      className="font-display text-[19px] font-bold text-tief underline decoration-sonne decoration-2 underline-offset-4"
                    >
                      {DATEN.telefon}
                    </a>
                  ) : (
                    <Wert wert={null} platzhalter="Nummer noch offen" />
                  )}
                </p>
              </div>

              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-see">
                  E-Mail
                </p>
                <p className="mt-2">
                  {DATEN.email ? (
                    <a
                      href={`mailto:${DATEN.email}`}
                      className="font-display text-[19px] font-bold text-tief underline decoration-sonne decoration-2 underline-offset-4"
                    >
                      {DATEN.email}
                    </a>
                  ) : (
                    <Wert wert={null} platzhalter="Adresse noch offen" />
                  )}
                </p>
              </div>

              <div className="mt-auto">
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-see">
                  Parken
                </p>
                <p className="mt-2 font-body text-[14px] leading-relaxed text-tief/60">
                  Parkplätze direkt beim Bad. An heißen Wochenenden früh da sein.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Fuß
   ========================================================================== */

function Fuss() {
  return (
    <footer className="bg-tief px-5 py-16 text-sandhell lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-schrift text-4xl leading-none text-sandhell">Tschinder</p>
            <p className="mt-4 max-w-xs font-body text-[14px] leading-relaxed text-sandhell/60">
              Familienstrandbad mit Restaurant am Ostufer des Millstätter Sees. Seit {DATEN.seit}.
            </p>
          </div>

          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-sonne">
              Seite
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="font-body text-[14px] text-sandhell/60 hover:text-sandhell">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-sonne">
              Kontakt
            </p>
            <ul className="mt-5 flex flex-col gap-3 font-body text-[14px] text-sandhell/60">
              <li>
                {DATEN.strasse}, {DATEN.plz}
                <br />
                {DATEN.gemeinde}
              </li>
              <li>
                {DATEN.telefonRoh ? (
                  <a href={`tel:${DATEN.telefonRoh}`} className="hover:text-sandhell">
                    {DATEN.telefon}
                  </a>
                ) : (
                  <Wert wert={null} platzhalter="Telefon offen" />
                )}
              </li>
              <li>
                {DATEN.email ? (
                  <a href={`mailto:${DATEN.email}`} className="hover:text-sandhell">
                    {DATEN.email}
                  </a>
                ) : (
                  <Wert wert={null} platzhalter="E-Mail offen" />
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-sandhell/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[13px] text-sandhell/45">
            © {new Date().getFullYear()} {DATEN.name}
          </p>
          <div className="flex flex-wrap gap-6">
            {/* In Österreich für einen Gewerbebetrieb verpflichtend. */}
            <a href="#impressum" className="font-body text-[13px] text-sandhell/45 hover:text-sandhell">
              Impressum
            </a>
            <a href="#datenschutz" className="font-body text-[13px] text-sandhell/45 hover:text-sandhell">
              Datenschutz
            </a>
          </div>
        </div>

        <p className="mt-6 rounded-xl border border-dashed border-sonne/40 bg-sonne/10 p-4 font-body text-[13px] leading-relaxed text-sonne">
          <strong>Noch zu erledigen:</strong> Impressum und Datenschutzerklärung sind in Österreich
          für einen Gewerbebetrieb Pflicht. Die Seiten sind verlinkt, die Inhalte fehlen noch.
        </p>
      </div>
    </footer>
  );
}

/* ==========================================================================
   Hinweisleiste — verschwindet, sobald alle Daten gepflegt sind
   ========================================================================== */

function Offenposten() {
  const [zu, setZu] = useState(false);
  const leiste = useRef(null);

  // Die Leiste liegt fix über der Seite und würde sonst den Fußbereich verdecken.
  // Höhe messen statt raten: am Handy bricht der Text auf mehrere Zeilen um.
  useEffect(() => {
    const el = leiste.current;
    if (zu || !el) {
      document.body.style.paddingBottom = '';
      return undefined;
    }
    const messen = () => {
      document.body.style.paddingBottom = `${el.offsetHeight}px`;
    };
    messen();
    const beobachter = new ResizeObserver(messen);
    beobachter.observe(el);
    return () => {
      beobachter.disconnect();
      document.body.style.paddingBottom = '';
    };
  }, [zu]);

  const offen = [
    !DATEN.telefon && 'Telefon',
    !DATEN.email && 'E-Mail',
    !DATEN.saison && 'Saison',
    !DATEN.badVon && 'Öffnungszeiten',
    !DATEN.kuecheVon && 'Küchenzeiten',
    PREISE.some((p) => !p.preis) && 'Preise',
    Object.values(BILDER).some((b) => !b.src) && 'Fotos',
  ].filter(Boolean);

  if (zu || offen.length === 0) return null;

  return (
    <div
      ref={leiste}
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-rot bg-rot px-5 py-3 text-sandhell"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <p className="flex-1 font-body text-[13px] leading-snug">
          <strong>Noch nicht online stellen.</strong> Es fehlen: {offen.join(', ')}. Alle Lücken sind
          auf der Seite rot markiert und in <code className="font-mono">DATEN</code> zu pflegen.
        </p>
        <button
          type="button"
          onClick={() => setZu(true)}
          aria-label="Hinweis ausblenden"
          className="shrink-0 rounded-full p-1.5 hover:bg-sandhell/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   App
   ========================================================================== */

export default function App() {
  // Strukturierte Daten für Google — nur bestätigte Felder, keine Platzhalter.
  useEffect(() => {
    const daten = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: DATEN.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: DATEN.strasse,
        postalCode: DATEN.plz,
        addressLocality: 'Döbriach',
        addressRegion: 'Kärnten',
        addressCountry: 'AT',
      },
      servesCuisine: ['Pizza', 'Österreichisch'],
      ...(DATEN.telefon ? { telephone: DATEN.telefon } : {}),
      ...(DATEN.email ? { email: DATEN.email } : {}),
    };

    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(daten);
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  return (
    <div className="min-h-screen bg-sand font-body text-tief antialiased">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <Kopf />

      <main>
        <Hero />
        <DasBad />
        <Kueche />
        <Tagesbogen />
        <Preise />
        <Wohnungen />
        <Geschichte />
        <Anfahrt />
      </main>

      <Fuss />
      <Offenposten />
    </div>
  );
}
