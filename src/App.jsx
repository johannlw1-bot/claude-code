import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import {
  Orbit,
  ArrowUpRight,
  ArrowRight,
  Play,
  ChevronDown,
  Gauge,
  ShieldCheck,
  Users,
  Sprout,
  Radiation,
  SatelliteDish,
  Rocket,
  Waves,
  Leaf,
  Atom,
  Compass,
  Radar,
  Menu,
  X,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1];

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_115329_5e00c9c5-4d69-49b7-94c3-9c31c60bb644.mp4';

const VESSEL_IMAGE =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop';

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap');

@layer components {
  .liquid-glass {
    background: rgba(255, 255, 255, 0.015);
    background-blend-mode: luminosity;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 4px 24px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .liquid-glass::before {
    content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
    background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.05) 80%, rgba(255,255,255,0.2) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
  }
  .liquid-glass-strong {
    background: rgba(255, 255, 255, 0.02);
    background-blend-mode: luminosity;
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    border: none;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2);
    position: relative; overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .liquid-glass-strong::before {
    content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.2px;
    background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.4) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
  }
}

html { scroll-behavior: smooth; }

::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #02040A; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

:focus-visible {
  outline: 1px solid rgba(255,255,255,0.7);
  outline-offset: 3px;
  border-radius: 2px;
}

/* A lingering blur(0px) still makes an element a backdrop root, which would
   flatten backdrop-filter on every glass card nested inside a reveal. */
.reveal-settled { filter: none !important; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`;

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Voyages', href: '#voyages' },
  { label: 'Worlds', href: '#worlds' },
  { label: 'Innovation', href: '#innovation' },
  { label: 'Launch', href: '#launch' },
];

const SPECS = [
  {
    icon: Gauge,
    label: 'Speed',
    value: '182,400',
    unit: 'km/h',
    note: 'Sustained under torch burn',
  },
  {
    icon: ShieldCheck,
    label: 'Integrity',
    value: 'Grade V',
    unit: '',
    note: 'Titanium-lithium lattice, four layers',
  },
  {
    icon: Users,
    label: 'Capacity',
    value: '12',
    unit: 'seats',
    note: 'Plus four flight crew',
  },
  {
    icon: Sprout,
    label: 'Life Support',
    value: '400',
    unit: 'days',
    note: 'Closed loop, 99.4% water recovery',
  },
  {
    icon: Radiation,
    label: 'Shielding',
    value: '0.9',
    unit: 'Sv',
    note: 'Total exposure, Earth to Mars and back',
  },
  {
    icon: SatelliteDish,
    label: 'Comms',
    value: '4.2',
    unit: 'Gb/s',
    note: 'Optical relay to the Deep Space Network',
  },
];

const FEATURES = [
  {
    icon: Rocket,
    title: 'Torch Propulsion',
    copy: 'A magnetically confined fusion core holds plasma at 150 million degrees and throws it out the back. Continuous thrust replaces the coast-and-hope arcs of chemical flight.',
  },
  {
    icon: Waves,
    title: 'Rotational Gravity',
    copy: 'The habitat ring turns at 2.1 rpm and holds a steady 0.38 g. Your bones and your inner ear both stay convinced you never left the ground.',
  },
  {
    icon: Leaf,
    title: 'Closed Biosphere',
    copy: 'Algae bioreactors and a soil-free garden recover almost every gram of water and oxygen on board. The ship breathes on the same cycle you do.',
  },
  {
    icon: Atom,
    title: 'Magnetospheric Shielding',
    copy: 'A superconducting coil wraps the crew deck in an artificial magnetosphere, turning the solar wind aside the way Earth has for four billion years.',
  },
  {
    icon: Compass,
    title: 'Autonomous Navigation',
    copy: 'Star trackers fix the ship against 58 reference stars and correct the trajectory forty times a second, with no round trip to mission control.',
  },
  {
    icon: Radar,
    title: 'Continuous Relay',
    copy: 'Three optical relay stations keep a link open the whole way out. Messages home are measured in minutes, and they never sit in a queue.',
  },
];

const JOURNEY = [
  {
    phase: 'Atmospheric Ascent',
    clock: 'T+ 0 to 8 minutes',
    copy: 'Nine sea-level engines lift 4,200 tonnes off the pad at Kourou. You will weigh three times what you do now, for about ninety seconds.',
  },
  {
    phase: 'Orbital Transfer',
    clock: 'Day 1 to 3',
    copy: 'Rendezvous with the Odyssey in a 400 km parking orbit. The transfer vehicle docks, pressurises, and you float through into the ship that becomes your address.',
  },
  {
    phase: 'Deep Space Cruise',
    clock: 'Day 3 to 74',
    copy: 'The torch lights and the ring spins up. Five weeks of steady acceleration, a turnover burn at the midpoint, then five weeks of slowing back down.',
  },
  {
    phase: 'Destination Arrival',
    clock: 'Day 74',
    copy: 'Orbital insertion, then descent. The hatch opens onto ground that no one in your family has ever stood on.',
  },
];

const DESTINATIONS = [
  {
    name: 'Mars',
    site: 'Valles Marineris',
    distance: '225 million km',
    transit: '74 days',
    copy: 'A canyon system four thousand kilometres long. The base sits on the north rim, where the morning fog burns off by ten.',
    image:
      'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1600&auto=format&fit=crop',
    tint: 'linear-gradient(150deg, #4a1f12 0%, #16090b 60%, #02040A 100%)',
    span: true,
  },
  {
    name: 'Lunar Gateway',
    site: 'Shackleton Station',
    distance: '384,400 km',
    transit: '3 days',
    copy: 'Eleven days door to door, and the only window where Earth still fills the frame.',
    image:
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1600&auto=format&fit=crop',
    tint: 'linear-gradient(150deg, #2b3140 0%, #0d1017 60%, #02040A 100%)',
    span: false,
  },
  {
    name: 'Titan',
    site: 'Kraken Mare',
    distance: '1.2 billion km',
    transit: '191 days',
    copy: 'Methane seas under an orange sky, at a pressure your lungs would find almost reasonable.',
    image:
      'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1600&auto=format&fit=crop',
    tint: 'linear-gradient(150deg, #4a3410 0%, #17110a 60%, #02040A 100%)',
    span: false,
  },
  {
    name: 'Europa',
    site: 'Conamara Chaos',
    distance: '628 million km',
    transit: '148 days',
    copy: 'Fractured ice over an ocean twice the volume of every sea on Earth. Descent is restricted to the survey corridor, and it is worth the paperwork.',
    image:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop',
    tint: 'linear-gradient(150deg, #14384a 0%, #091319 60%, #02040A 100%)',
    span: true,
  },
];

const FAQS = [
  {
    q: 'Do I need to be an astronaut?',
    a: 'No. You need to pass a class-two flight physical and complete eleven weeks of training at our Kourou campus: centrifuge tolerance, pressure-suit drills, and emergency egress. Roughly four in five applicants clear it, and the schedule is built around your life rather than the other way around.',
  },
  {
    q: 'What does a seat include?',
    a: 'Passage both ways, the full training programme, your fitted suit, and the surface excursion at your destination. Seats on the Odyssey Class open at $2.4M, paid against a deposit schedule spread across the three years before departure.',
  },
  {
    q: 'How safe is this, honestly?',
    a: 'Every critical system is triply redundant, and the ship can fly a complete return on any single propulsion string. We publish every flight-readiness review and every anomaly report, including the ones that did not go our way. Read them before you decide.',
  },
  {
    q: 'How long am I away from Earth?',
    a: 'A Lunar Gateway rotation runs eleven days door to door. Mars is closer to seven months, which includes forty days on the surface waiting for the transfer window to reopen. Departures are scheduled so that you know your return date before you leave.',
  },
];

const FOOTER_LINKS = [
  {
    heading: 'Missions',
    links: ['Odyssey Class', 'Lunar Gateway', 'Mars Programme', 'Outer System', 'Flight Schedule'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Safety Record', 'Press', 'Contact'],
  },
];

const PARTNERS = ['Aeon', 'Vela', 'Zeno'];

/* -------------------------------------------------------------------------- */
/*  Motion primitives                                                          */
/* -------------------------------------------------------------------------- */

function BlurText({ text, className = '', delay = 0, stagger = 0.055 }) {
  const reduce = useReducedMotion();
  const words = String(text).split(' ');

  return (
    <motion.span
      aria-label={text}
      className={`inline-block ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block"
          variants={{
            hidden: reduce
              ? { opacity: 0 }
              : { filter: 'blur(12px)', opacity: 0, y: 40 },
            visible: reduce
              ? { opacity: 1, transition: { duration: 0.5, ease: EASE } }
              : {
                  filter: 'blur(0px)',
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1.15, ease: EASE },
                },
          }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}

function Reveal({ children, className = '', delay = 0, y = 28 }) {
  const reduce = useReducedMotion();
  const [settled, setSettled] = useState(false);

  return (
    <motion.div
      className={`${className} ${settled ? 'reveal-settled' : ''}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.95, ease: EASE, delay }}
      onAnimationComplete={() => setSettled(true)}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, className = '' }) {
  return (
    <span
      className={`font-body text-[11px] font-medium uppercase tracking-[0.25em] text-white/40 ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  A. Navbar                                                                  */
/* -------------------------------------------------------------------------- */

function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.2 }}
      className="fixed top-6 z-50 flex w-full items-center justify-between px-6 lg:px-12"
    >
      <a
        href="#home"
        aria-label="Perihelion, back to top"
        className="liquid-glass flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white/90 hover:text-white"
      >
        <Orbit className="h-5 w-5" strokeWidth={1.4} />
      </a>

      <nav className="liquid-glass hidden items-center gap-1 rounded-full p-1.5 pl-7 lg:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="rounded-full px-4 py-2 font-body text-[13px] font-normal tracking-wide text-white/60 transition-colors duration-300 hover:text-white"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#launch"
          className="ml-3 flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 font-body text-[13px] font-medium tracking-wide text-[#02040A] transition-transform duration-300 hover:scale-[1.03]"
        >
          Claim a Spot
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      </nav>

      <div className="flex items-center gap-3 lg:hidden">
        <a
          href="#launch"
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 font-body text-[12px] font-medium tracking-wide text-[#02040A]"
        >
          Claim a Spot
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full text-white/80"
        >
          {open ? (
            <X className="h-[18px] w-[18px]" strokeWidth={1.6} />
          ) : (
            <Menu className="h-[18px] w-[18px]" strokeWidth={1.6} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="liquid-glass-strong absolute left-6 right-6 top-20 flex flex-col rounded-3xl p-3 lg:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 font-body text-sm tracking-wide text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* -------------------------------------------------------------------------- */
/*  B. Hero                                                                    */
/* -------------------------------------------------------------------------- */

function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '55%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'video';
    preload.type = 'video/mp4';
    preload.href = HERO_VIDEO;
    document.head.appendChild(preload);

    const preconnects = ['https://d8j0ntlcm91z4.cloudfront.net', 'https://images.unsplash.com'].map(
      (href) => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        return link;
      },
    );

    return () => {
      preload.remove();
      preconnects.forEach((link) => link.remove());
    };
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      <motion.div
        style={reduce ? undefined : { y, scale, opacity }}
        className="absolute inset-0 -z-10"
      >
        <video
          className="h-full w-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#02040A]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#02040A]/70 via-transparent to-[#02040A]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#02040A] to-transparent" />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.35 }}
          className="liquid-glass mb-10 flex items-center gap-3 rounded-full py-2 pl-2 pr-5"
        >
          <span className="rounded-full bg-white/90 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-[#02040A]">
            New
          </span>
          <span className="font-body text-[12px] tracking-[0.14em] text-white/70">
            Odyssey Class opens for boarding, Q3 2027
          </span>
        </motion.div>

        <h1 className="font-heading text-balance text-[clamp(2.9rem,8.6vw,8.5rem)] italic leading-[0.92] tracking-tight text-white">
          <BlurText text="Venture Past Our Sky Across the Universe" stagger={0.07} delay={0.15} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.9 }}
          className="mt-8 max-w-xl text-balance font-body text-[15px] font-light leading-loose text-white/60 sm:text-base"
        >
          Commercial deep-space passage opens in 2027. Twelve seats a departure, eleven weeks of
          training, and a window over the terminator line of another world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 1.05 }}
          className="mt-12 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#launch"
            className="liquid-glass-strong group flex items-center gap-2.5 rounded-full px-8 py-4 font-body text-[13px] font-medium tracking-[0.06em] text-white hover:bg-white/[0.06]"
          >
            Reserve a seat
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.8}
            />
          </a>
          <a
            href="#voyages"
            className="group flex items-center gap-3 rounded-full px-6 py-4 font-body text-[13px] font-medium tracking-[0.06em] text-white/60 transition-colors duration-300 hover:text-white"
          >
            <span className="liquid-glass flex h-9 w-9 items-center justify-center rounded-full">
              <Play className="h-3 w-3 fill-white/80 text-white/80" strokeWidth={1.5} />
            </span>
            Watch the launch
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 1.6 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="h-14 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  C. Mission statement                                                       */
/* -------------------------------------------------------------------------- */

function Mission() {
  return (
    <section className="relative overflow-hidden px-6 py-36 lg:py-52">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1d4ed8]/20 blur-[120px]" />

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.4, ease: EASE }}
          className="mb-14 h-24 w-px origin-top bg-gradient-to-b from-transparent via-white/40 to-transparent"
        />

        <Reveal className="mb-10">
          <Eyebrow>The Mission</Eyebrow>
        </Reveal>

        <p className="font-heading text-balance text-[clamp(1.9rem,4.4vw,3.6rem)] italic leading-[1.15] tracking-tight text-white/90">
          <BlurText
            text="We are not just building ships. We are engineering the next great chapter of human history."
            stagger={0.045}
          />
        </p>

        <Reveal delay={0.3} className="mt-12">
          <span className="font-body text-[12px] tracking-[0.2em] text-white/35">
            Perihelion Flight Charter, Article I
          </span>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  D. Vessel specs                                                            */
/* -------------------------------------------------------------------------- */

function Vessel() {
  return (
    <section className="relative px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        <Reveal>
          <div className="liquid-glass group h-[520px] w-full overflow-hidden rounded-[2.5rem] lg:h-[650px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220] to-[#02040A]" />
            <img
              src={VESSEL_IMAGE}
              alt="The Odyssey Class in low orbit above Earth's night side"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-80 transition-transform duration-[1600ms] ease-out group-hover:scale-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-[#02040A]/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-8 lg:p-12">
              <Eyebrow>Odyssey Class</Eyebrow>
              <h3 className="mt-4 font-heading text-4xl italic leading-none tracking-tight text-white lg:text-6xl">
                The Apex Voyager
              </h3>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col justify-between">
          <Reveal delay={0.1}>
            <Eyebrow>Vessel Specification</Eyebrow>
            <h2 className="mt-6 font-heading text-balance text-[clamp(2.2rem,4.6vw,3.75rem)] italic leading-[1.02] tracking-tight text-white">
              <BlurText text="Unrivalled Engineering" />
            </h2>
            <p className="mt-6 max-w-md font-body text-[15px] font-light leading-relaxed text-white/60">
              Four hundred and eighty metres of pressure hull, drive section, and spin ring, built to
              carry twelve people further than anyone has been and bring them home unremarkable.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SPECS.map((spec, i) => (
              <Reveal key={spec.label} delay={0.08 * i} y={20}>
                <div className="liquid-glass h-full rounded-2xl p-6 hover:bg-white/[0.035]">
                  <spec.icon className="h-4 w-4 text-white/40" strokeWidth={1.5} />
                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-heading text-3xl italic leading-none tracking-tight text-white">
                      {spec.value}
                    </span>
                    {spec.unit && (
                      <span className="font-body text-xs tracking-wide text-white/50">
                        {spec.unit}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-body text-[10px] uppercase tracking-[0.22em] text-white/40">
                    {spec.label}
                  </p>
                  <p className="mt-2 font-body text-[12px] font-light leading-relaxed text-white/40">
                    {spec.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  E. Features                                                                */
/* -------------------------------------------------------------------------- */

function Features() {
  return (
    <section id="innovation" className="relative scroll-mt-32 overflow-hidden px-6 py-28 lg:px-12 lg:py-40">
      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[500px] w-[760px] -translate-x-1/2 rounded-full bg-[#4338ca]/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Innovation</Eyebrow>
          <h2 className="mt-6 font-heading text-balance text-[clamp(2.4rem,5.4vw,4.5rem)] italic leading-[1.02] tracking-tight text-white">
            <BlurText text="Engineering the Impossible" />
          </h2>
          <p className="mx-auto mt-7 max-w-lg text-balance font-body text-[15px] font-light leading-loose text-white/60">
            Six systems had to exist before any of this was a business. We built all six, then flew
            them uncrewed for four years before we sold a single seat.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={0.07 * i} y={24}>
              <div className="liquid-glass-strong group h-full rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-1 hover:bg-white/[0.045] lg:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] transition-colors duration-500 group-hover:border-white/20">
                  <feature.icon className="h-[18px] w-[18px] text-white/70" strokeWidth={1.4} />
                </div>
                <h3 className="mt-8 font-heading text-2xl italic tracking-tight text-white lg:text-[1.7rem]">
                  {feature.title}
                </h3>
                <p className="mt-4 font-body text-[14px] font-light leading-relaxed text-white/60">
                  {feature.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  F. Journey timeline                                                        */
/* -------------------------------------------------------------------------- */

function Journey() {
  return (
    <section id="voyages" className="relative scroll-mt-32 px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>The Voyage</Eyebrow>
          <h2 className="mt-6 font-heading text-balance text-[clamp(2.4rem,5.4vw,4.5rem)] italic leading-[1.02] tracking-tight text-white">
            <BlurText text="Seventy-Four Days" />
          </h2>
          <p className="mx-auto mt-7 max-w-lg text-balance font-body text-[15px] font-light leading-loose text-white/60">
            Pad to surface, in four phases. Every passenger flies this sequence, and every passenger
            has rehearsed it before the morning of the launch.
          </p>
        </Reveal>

        <div className="relative mt-24">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.8, ease: EASE }}
            className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-transparent via-white/25 to-transparent md:left-1/2 md:-translate-x-1/2"
          />

          <div className="flex flex-col gap-14 md:gap-24">
            {JOURNEY.map((step, i) => {
              const left = i % 2 === 0;
              return (
                <div
                  key={step.phase}
                  className="relative flex items-center md:grid md:grid-cols-2 md:gap-16"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                    className="absolute left-4 z-10 -translate-x-1/2 md:left-1/2"
                  >
                    <span className="relative flex h-3 w-3 items-center justify-center">
                      <span className="absolute h-3 w-3 rounded-full bg-white/20 blur-[6px]" />
                      <span className="absolute h-6 w-6 rounded-full bg-white/10 blur-[10px]" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.55)]" />
                    </span>
                  </motion.div>

                  <div
                    className={
                      left
                        ? 'w-full pl-12 md:col-start-1 md:pl-0 md:pr-4 md:text-right'
                        : 'w-full pl-12 md:col-start-2 md:pl-4'
                    }
                  >
                    <Reveal delay={0.1} y={24}>
                      <div className="liquid-glass rounded-3xl p-7 hover:bg-white/[0.035] lg:p-9">
                        <Eyebrow>{step.clock}</Eyebrow>
                        <h3 className="mt-4 font-heading text-[1.75rem] italic leading-tight tracking-tight text-white lg:text-4xl">
                          {step.phase}
                        </h3>
                        <p className="mt-4 font-body text-[14px] font-light leading-relaxed text-white/60">
                          {step.copy}
                        </p>
                      </div>
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  G. Destinations                                                            */
/* -------------------------------------------------------------------------- */

function Destinations() {
  return (
    <section id="worlds" className="relative scroll-mt-32 px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow>Destinations</Eyebrow>
            <h2 className="mt-6 font-heading text-balance text-[clamp(2.4rem,5.4vw,4.5rem)] italic leading-[1.02] tracking-tight text-white">
              <BlurText text="Worlds Await" />
            </h2>
          </div>
          <a
            href="#worlds"
            className="group flex items-center gap-2 font-body text-[13px] tracking-[0.08em] text-white/60 transition-colors duration-300 hover:text-white"
          >
            View All Destinations
            <ArrowRight
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.6}
            />
          </a>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {DESTINATIONS.map((world, i) => (
            <Reveal
              key={world.name}
              delay={0.08 * i}
              y={24}
              className={world.span ? 'md:col-span-2' : 'md:col-span-1'}
            >
              <article className="group relative h-[440px] w-full overflow-hidden rounded-[2rem] lg:h-[520px]">
                <div className="absolute inset-0" style={{ background: world.tint }} />
                <img
                  src={world.image}
                  alt={`${world.name}, seen from approach`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-[#02040A]/45 to-transparent" />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col p-8 lg:p-10">
                  <div className="flex items-center gap-3">
                    <Eyebrow>{world.site}</Eyebrow>
                  </div>
                  <h3 className="mt-3 font-heading text-4xl italic leading-none tracking-tight text-white lg:text-5xl">
                    {world.name}
                  </h3>
                  <p className="mt-4 max-w-sm font-body text-[13.5px] font-light leading-relaxed text-white/60">
                    {world.copy}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/35">
                        Distance
                      </p>
                      <p className="mt-1 font-body text-[13px] text-white/70">{world.distance}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/35">
                        Transit
                      </p>
                      <p className="mt-1 font-body text-[13px] text-white/70">{world.transit}</p>
                    </div>
                    <a
                      href="#launch"
                      className="liquid-glass ml-auto flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-[12px] tracking-[0.06em] text-white/80 hover:bg-white/[0.06] hover:text-white"
                    >
                      Flight details
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.7} />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  H. FAQ                                                                     */
/* -------------------------------------------------------------------------- */

function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <Eyebrow>Before You Apply</Eyebrow>
          <h2 className="mt-6 font-heading text-balance text-[clamp(2.4rem,5.4vw,4.5rem)] italic leading-[1.02] tracking-tight text-white">
            <BlurText text="Common Inquiries" />
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={0.06 * i} y={20}>
                <div className="liquid-glass rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left lg:px-9"
                  >
                    <span className="font-body text-[15px] font-normal tracking-wide text-white/90 lg:text-base">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-white/50 transition-transform duration-500 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      strokeWidth={1.6}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-7 pb-7 font-body text-[14px] font-light leading-loose text-white/55 lg:px-9 lg:pb-8">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  I. Footer                                                                  */
/* -------------------------------------------------------------------------- */

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <footer id="launch" className="relative scroll-mt-32 border-t border-white/10 px-6 pb-12 pt-24 lg:px-12 lg:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <span className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full">
                <Orbit className="h-[18px] w-[18px] text-white/90" strokeWidth={1.4} />
              </span>
              <span className="font-body text-[13px] uppercase tracking-[0.3em] text-white/70">
                Perihelion
              </span>
            </div>

            <h2 className="mt-10 max-w-md font-heading text-balance text-[clamp(2.2rem,4.6vw,3.5rem)] italic leading-[1.05] tracking-tight text-white">
              <BlurText text="The universe is calling" />
            </h2>

            <p className="mt-6 max-w-sm font-body text-[14px] font-light leading-relaxed text-white/50">
              Launch windows, flight-readiness reviews, and seat releases. Roughly one email a month.
            </p>

            <form onSubmit={onSubmit} className="mt-8 max-w-md">
              <div className="liquid-glass flex items-center gap-2 rounded-full p-1.5 pl-6">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubscribed(false);
                  }}
                  placeholder="you@earth.com"
                  className="w-full bg-transparent font-body text-[14px] font-light text-white placeholder:text-white/30 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-white px-6 py-3 font-body text-[12px] font-medium tracking-[0.06em] text-[#02040A] transition-transform duration-300 hover:scale-[1.03]"
                >
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>
              <AnimatePresence>
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="mt-4 pl-6 font-body text-[12px] tracking-wide text-white/45"
                  >
                    You are on the list. The next window opens in March.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.heading} className="lg:col-span-3">
              <Eyebrow>{column.heading}</Eyebrow>
              <ul className="mt-7 flex flex-col gap-4">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#launch"
                      className="font-body text-[14px] font-light text-white/50 transition-colors duration-300 hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-24 flex flex-col gap-8 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-body text-[12px] tracking-wide text-white/35">
            © {new Date().getFullYear()} Perihelion Spaceflight. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {['Privacy', 'Terms', 'Flight Safety'].map((policy) => (
              <a
                key={policy}
                href="#launch"
                className="font-body text-[12px] tracking-wide text-white/35 transition-colors duration-300 hover:text-white/70"
              >
                {policy}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-white/25">
              Partners
            </span>
            {PARTNERS.map((partner) => (
              <span key={partner} className="font-heading text-xl italic text-white/40">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  App                                                                        */
/* -------------------------------------------------------------------------- */

export default function App() {
  return (
    <div className="min-h-screen bg-[#02040A] font-body text-white antialiased selection:bg-white/30 selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <Navbar />

      <main>
        <Hero />
        <Mission />
        <Vessel />
        <Features />
        <Journey />
        <Destinations />
        <Faq />
      </main>

      <Footer />
    </div>
  );
}
