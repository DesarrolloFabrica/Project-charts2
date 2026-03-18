import { useEffect, useMemo, useRef } from "react";
import { gsap } from "../../lib/gsap";
import HeroOrbitalShowcase from "./HeroOrbitalShowcase";
import useHeroOrbitalControls from "../../hooks/useHeroOrbitalControls";
import useHeroScrollTimeline, { type OrbitStoryValues } from "../../hooks/useHeroScrollTimeline";

function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const titleParallaxRef = useRef<HTMLSpanElement | null>(null);
  const subtitleParallaxRef = useRef<HTMLSpanElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);

  // Background refs (capa cinematográfica)
  const heroVignetteRef = useRef<HTMLDivElement | null>(null);
  const bgGlowLeftRef = useRef<HTMLDivElement | null>(null);
  const bgGlowRightRef = useRef<HTMLDivElement | null>(null);
  const bgGlowBottomRef = useRef<HTMLDivElement | null>(null);

  // Orbital UI refs (lado derecho)
  const orbitalGlowRef = useRef<HTMLDivElement | null>(null);
  const chipLeftRefOrbital = useRef<HTMLDivElement | null>(null);
  const chipRightRefOrbital = useRef<HTMLDivElement | null>(null);
  const orbitalIndicatorRef = useRef<HTMLDivElement | null>(null);
  const orbitalPresetLabelRef = useRef<HTMLDivElement | null>(null);

  // Contenedor DOM del canvas (para la conexión hacia la siguiente sección).
  const showcaseFrameRef = useRef<HTMLDivElement | null>(null);

  // Lock compartido para la narrativa (evita cambios de preset/drag durante el pin)
  const isStoryActiveRef = useRef(false);

  const orbitStoryRef = useRef<OrbitStoryValues>({
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    scaleMul: 1,
    rotAddX: 0,
    rotAddY: 0,
    rotAddZ: 0,
    motionMul: 0.85,
    energy: 0.12,
  });

  const {
    activeIndex,
    activePreset,
    fromPreset,
    toPreset,
    mixRef,
    rotationOffsetRef,
    velocityRef,
    isDraggingRef,
    parallaxRef,
    bindHeroParallax,
    bindShowcaseDrag,
    goPrev,
    goNext,
    isMobile,
    isReducedMotion,
  } = useHeroOrbitalControls({ isStoryActiveRef });

  const uiRefs = useMemo(
    () => ({
      eyebrowRef,
      titleRef,
      subtitleRef,
      ctaRef,
      orbitalGlowRef,
      chipLeftRef: chipLeftRefOrbital,
      chipRightRef: chipRightRefOrbital,
      indicatorRef: orbitalIndicatorRef,
      presetLabelRef: orbitalPresetLabelRef,
      showcaseFrameRef,
      heroVignetteRef,
      bgGlowLeftRef,
      bgGlowRightRef,
      bgGlowBottomRef,
    }),
    [
      eyebrowRef,
      titleRef,
      subtitleRef,
      ctaRef,
      orbitalGlowRef,
      chipLeftRefOrbital,
      chipRightRefOrbital,
      orbitalIndicatorRef,
      orbitalPresetLabelRef,
      showcaseFrameRef,
      heroVignetteRef,
      bgGlowLeftRef,
      bgGlowRightRef,
      bgGlowBottomRef,
    ],
  );

  const { isStoryActive } = useHeroScrollTimeline({
    sectionRef,
    orbitStoryRef,
    uiRefs,
    isMobile,
    isReducedMotion,
    isStoryActiveRef,
  });

  const hasMountedRef = useRef(false);

  // Cuando el hero entra al pin narrativo, reseteamos deltas del usuario para evitar poses mezcladas.
  useEffect(() => {
    if (!isStoryActive) return;

    if (titleParallaxRef.current) titleParallaxRef.current.style.transform = "";
    if (subtitleParallaxRef.current) subtitleParallaxRef.current.style.transform = "";

    parallaxRef.current.x = 0;
    parallaxRef.current.y = 0;

    isDraggingRef.current = false;
    velocityRef.current.x = 0;
    velocityRef.current.y = 0;
    rotationOffsetRef.current.x *= 0.3;
    rotationOffsetRef.current.y *= 0.3;
  }, [
    isStoryActive,
    parallaxRef,
    titleParallaxRef,
    subtitleParallaxRef,
    isDraggingRef,
    velocityRef,
    rotationOffsetRef,
  ]);

  useEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;

    if (!section || !eyebrow || !title || !subtitle || !cta) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        eyebrow,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1.2 }
      )
        .fromTo(
          title,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5 },
          "-=0.9"
        )
        .fromTo(
          subtitle,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2 },
          "-=1.1"
        )
        .fromTo(
          cta,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2 },
          "-=1.0"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  // Animar cambio premium de texto al cambiar de variante
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 26, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 0.62 },
      0
    ).fromTo(
      subtitleRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45 },
      0.08
    );
  }, [activeIndex]);

  // Parallax sutil en el texto
  useEffect(() => {
    if (isReducedMotion) return;
    if (isStoryActive) return;

    let rafId = 0;
    const tick = () => {
      const px = parallaxRef.current.x;
      const py = parallaxRef.current.y;

      if (titleParallaxRef.current) {
        titleParallaxRef.current.style.transform = `translate3d(${px * 10}px, ${py * -6}px, 0)`;
      }
      if (subtitleParallaxRef.current) {
        subtitleParallaxRef.current.style.transform = `translate3d(${px * 7}px, ${py * -4}px, 0)`;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [parallaxRef, isReducedMotion, isStoryActive]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-visible bg-[#02040A]"
      onPointerMove={isStoryActive ? undefined : bindHeroParallax.onPointerMove}
      onPointerLeave={isStoryActive ? undefined : bindHeroParallax.onPointerLeave}
    >
      {/* --- FONDOS Y EFECTOS --- */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid futurista con opacidad ajustada */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[32px_32px]" />

        {/* Luces de Neón (Glows) Cinematográficas */}
        <div
          ref={bgGlowLeftRef}
          className="absolute left-[-15%] top-[-10%] h-[700px] w-[700px] rounded-full bg-purple-600/25 blur-[140px] mix-blend-screen"
        />
        <div
          ref={bgGlowRightRef}
          className="absolute right-[-5%] top-[15%] h-[600px] w-[600px] rounded-full bg-cyan-500/20 blur-[140px] mix-blend-screen"
        />
        <div
          ref={bgGlowBottomRef}
          className="absolute bottom-[-25%] left-[15%] h-[900px] w-[900px] rounded-full bg-blue-700/15 blur-[160px] mix-blend-screen"
        />

        {/* Viñeta para centrar la atención en el contenido */}
        <div
          ref={heroVignetteRef}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02040A_100%)] opacity-90"
        />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 items-center gap-12 px-6 pb-16 pt-28 md:px-10 md:pt-32 xl:grid-cols-[1fr_1fr] xl:px-16">
        
        {/* --- LADO IZQUIERDO (TEXTO) --- */}
        <div className="relative flex max-w-[640px] flex-col justify-center">
          
          {/* Eyebrow estilo HUD técnico */}
          <div ref={eyebrowRef} className="mb-8 flex w-max items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 shadow-[0_0_15px_rgba(34,211,238,0.15)] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">
              System Online // V.1.0
            </p>
          </div>

          {/* Título Principal */}
          <h1
            ref={titleRef}
            className="text-[64px] font-extrabold leading-[1.05] tracking-tight drop-shadow-xl md:text-[88px] xl:text-[110px]"
          >
            <span
              ref={titleParallaxRef}
              className="inline-block will-change-transform text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(90deg, ${activePreset.theme.titleGradient[0]}, ${activePreset.theme.titleGradient[1]})`,
              }}
            >
              {activePreset.titleLines[0]}
            </span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(90deg, ${activePreset.theme.titleGradient[1]}, ${activePreset.theme.titleGradient[2]})`,
              }}
            >
              {activePreset.titleLines[1]}
            </span>
          </h1>

          {/* Subtítulo */}
          <p
            ref={subtitleRef}
            className="mt-8 max-w-[500px] text-lg leading-relaxed text-gray-400 drop-shadow-md md:text-xl"
          >
            <span ref={subtitleParallaxRef} className="inline-block will-change-transform">
              {activePreset.subtitle}
            </span>
          </p>

          {/* Botones de Acción */}
          <div ref={ctaRef} className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {/* CTA Primario */}
            <button className="group relative flex h-14 items-center justify-center overflow-hidden rounded-full border border-purple-500/40 bg-[#02040A]/60 px-8 font-bold text-white shadow-[0_0_30px_rgba(168,85,247,0.2)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-purple-400 hover:bg-purple-600/20 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] focus:outline-none">
              <span className="relative z-10 flex items-center gap-3 text-xs uppercase tracking-widest">
                Explore The Core
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
            
            {/* Link Secundario con efecto de línea */}
            <a href="#about" className="group relative flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-cyan-400">
              <span className="relative">
                View Capabilities
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </span>
            </a>
          </div>

        </div>

        {/* --- LADO DERECHO (3D & ELEMENTOS FLOTANTES) --- */}
        <HeroOrbitalShowcase
          activeIndex={activeIndex}
          fromPreset={fromPreset}
          toPreset={toPreset}
          mixRef={mixRef}
          rotationOffsetRef={rotationOffsetRef}
          velocityRef={velocityRef}
          isDraggingRef={isDraggingRef}
          parallaxRef={parallaxRef}
          orbitStoryRef={orbitStoryRef}
          isInteractionLocked={isStoryActive}
          goPrev={goPrev}
          goNext={goNext}
          bindShowcaseDrag={bindShowcaseDrag}
          isMobile={isMobile}
          orbitalGlowRef={orbitalGlowRef}
          chipLeftRef={chipLeftRefOrbital}
          chipRightRef={chipRightRefOrbital}
          indicatorRef={orbitalIndicatorRef}
          presetLabelRef={orbitalPresetLabelRef}
          showcaseFrameRef={showcaseFrameRef}
        />
      </div>
    </section>
  );
}

export default HeroSection;