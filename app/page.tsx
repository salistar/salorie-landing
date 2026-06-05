import {
  Camera, Activity, Brain, TrendingUp, Globe, Shield,
  Smartphone, Github, ExternalLink, Download, Package,
  Trophy, Dumbbell, Heart, Sparkles,
} from 'lucide-react';

const PRIMARY = '#298f50';
const PRIMARY_DARK = '#1f6b3c';
const REL = 'https://github.com/salistar/salorie/releases/download/v1.0.0';
const APK_URL = `${REL}/salorie-v1.0.0-prod.apk`;
const AAB_URL = `${REL}/salorie-v1.0.0-prod.aab`;
const REPO = 'https://github.com/salistar/salorie';

// Curated real device captures (public/screenshots) with FR labels.
const SHOTS: { src: string; label: string }[] = [
  { src: '/screenshots/01-home.png', label: 'Tableau de bord' },
  { src: '/screenshots/19-scan-barcode.png', label: 'Scan IA' },
  { src: '/screenshots/20-nutrients.png', label: 'Micronutriments' },
  { src: '/screenshots/03-analytics.png', label: 'Analytics & insights' },
  { src: '/screenshots/03-coach.png', label: 'Coach adaptatif' },
  { src: '/screenshots/04-meal-plan.png', label: 'Plans de repas' },
  { src: '/screenshots/05-social.png', label: 'Classement social' },
  { src: '/screenshots/21-coach-achievements.png', label: 'Gamification' },
  { src: '/screenshots/06-health.png', label: 'Health Connect' },
  { src: '/screenshots/17-workout-lifting.png', label: 'Musculation' },
  { src: '/screenshots/18-workout-run.png', label: 'Course' },
  { src: '/screenshots/07-add-water.png', label: 'Hydratation' },
  { src: '/screenshots/02-home-activity.png', label: 'Activité du jour' },
  { src: '/screenshots/12-personal-details.png', label: 'Objectifs perso' },
  { src: '/screenshots/10-notifications.png', label: 'Notifications' },
  { src: '/screenshots/11-preferences.png', label: 'Préférences · 3 langues' },
];

async function getReleaseMeta() {
  try {
    const res = await fetch('https://api.github.com/repos/salistar/salorie/releases/tags/v1.0.0', {
      next: { revalidate: 300 },
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const mb = (n: number) => (n / 1024 / 1024).toFixed(0);
    const apk = data.assets?.find((a: any) => a.name.endsWith('.apk'));
    const aab = data.assets?.find((a: any) => a.name.endsWith('.aab'));
    const date = apk
      ? new Date(apk.updated_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
      : null;
    return { apkMB: apk ? mb(apk.size) : null, aabMB: aab ? mb(aab.size) : null, date };
  } catch {
    return null;
  }
}

export default async function Home() {
  const meta = await getReleaseMeta();
  return (
    <main style={{ overflow: 'hidden' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="Salorie logo" width={36} height={36}
                 style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(41,143,80,0.25)' }} />
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>Salorie</span>
          </div>
          <div className="nav-links" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a className="nav-text" href="#features" style={{ fontSize: 15, fontWeight: 500, color: '#475569' }}>Fonctions</a>
            <a className="nav-text" href="#screenshots" style={{ fontSize: 15, fontWeight: 500, color: '#475569' }}>Captures</a>
            <a className="nav-text" href="#download" style={{ fontSize: 15, fontWeight: 500, color: '#475569' }}>Télécharger</a>
            <a href={REPO} target="_blank" rel="noopener"
               style={{
                 display: 'flex', alignItems: 'center', gap: 8,
                 padding: '8px 16px', borderRadius: 10,
                 background: PRIMARY, color: '#fff', fontWeight: 700, fontSize: 14,
               }}>
              <Github size={16} /> GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        paddingTop: 130, paddingBottom: 70,
        background: 'radial-gradient(1200px 500px at 80% -10%, rgba(41,143,80,0.10), transparent), linear-gradient(180deg, #f0fdf4 0%, transparent 60%)',
      }}>
        <div className="hero-grid" style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 999,
              background: 'rgba(41,143,80,0.1)', color: PRIMARY_DARK,
              fontSize: 13, fontWeight: 700, marginBottom: 22,
            }}>
              <Sparkles size={14} /> Propulsé par l&apos;IA Gemini
            </div>
            <h1 className="h1-resp" style={{
              fontSize: 56, fontWeight: 900, lineHeight: 1.05, letterSpacing: -1.5, margin: '0 0 22px 0',
            }}>
              Scanne ton repas,<br />
              <span style={{ color: PRIMARY }}>suis tes calories</span>,<br />
              atteins tes objectifs.
            </h1>
            <p style={{ fontSize: 20, color: '#475569', lineHeight: 1.6, margin: '0 0 30px 0', maxWidth: 520 }}>
              Salorie analyse tes repas en temps réel par photo. Macros, calories,
              micronutriments, coach adaptatif et plans de repas — tout en un scan.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href={APK_URL} download style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 30px', borderRadius: 14, background: PRIMARY, color: '#fff',
                fontWeight: 700, fontSize: 16, boxShadow: '0 10px 30px rgba(41,143,80,0.3)',
              }}>
                <Download size={18} /> Télécharger l&apos;APK
                {meta?.apkMB && <span style={{ opacity: 0.8, fontSize: 13, marginLeft: 4 }}>({meta.apkMB} MB)</span>}
              </a>
              <a href="#screenshots" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 30px', borderRadius: 14, background: '#fff', color: '#0f172a',
                fontWeight: 700, fontSize: 16, border: '2px solid #e2e8f0',
              }}>
                <Smartphone size={18} /> Voir l&apos;app
              </a>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 44, flexWrap: 'wrap' }}>
              <Stat value="100%" label="Privé & sécurisé" />
              <Stat value="<2s" label="Analyse IA" />
              <Stat value="3" label="Langues · FR/EN/AR" />
            </div>
          </div>

          {/* Real screenshot in a phone frame */}
          <div className="hero-phone" style={{ position: 'relative', height: 620, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute', width: 360, height: 360, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(41,143,80,0.18), transparent 70%)', filter: 'blur(20px)',
            }} />
            <PhoneFrame src="/screenshots/01-home.png" big />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '70px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Header title="Tout pour atteindre tes objectifs" sub="Une app complète, pensée pour de vrais utilisateurs." />
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            <Feature icon={<Camera size={26} />} title="Scan IA instantané" desc="Photographie ton assiette : Gemini identifie les aliments et calcule les macros en moins de 2 secondes." />
            <Feature icon={<Activity size={26} />} title="Suivi nutritionnel complet" desc="Calories, protéines, glucides, lipides, eau, exercice — centralisés dans un dashboard clair." />
            <Feature icon={<Brain size={26} />} title="Micronutriments + insights" desc="Vitamines, fer, magnésium… estimés par IA, avec recommandations personnalisées en 3 langues." />
            <Feature icon={<TrendingUp size={26} />} title="Coach TDEE adaptatif" desc="Tes besoins recalculés en continu selon ta dépense réelle et ta tendance de poids." />
            <Feature icon={<Trophy size={26} />} title="Social & gamification" desc="Classement entre amis, streaks et succès à débloquer pour rester motivé sur la durée." />
            <Feature icon={<Heart size={26} />} title="Health Connect" desc="Synchronise pas, activité et données santé avec l'écosystème Android Health Connect." />
            <Feature icon={<Dumbbell size={26} />} title="Workouts & plans repas" desc="Séances musculation/course avec calories dépensées, et plans de repas générés par IA." />
            <Feature icon={<Globe size={26} />} title="3 langues · RTL" desc="Français, English, العربية — interface arabe right-to-left parfaitement intégrée." />
            <Feature icon={<Shield size={26} />} title="Auth & données sécurisées" desc="Connexion Clerk (Google/email) et Firestore verrouillé par utilisateur (règles request.auth)." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '70px 24px', background: 'linear-gradient(180deg, #f8fafc, #f0fdf4)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Header title="Comment ça marche" sub="" />
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 12 }}>
            <Step num="1" title="Onboarding rapide" desc="Renseigne ton profil (5 questions). On calcule tes besoins en moins d'une minute." />
            <Step num="2" title="Scan tes repas" desc="Pointe la caméra sur ton assiette. Gemini te dit ce que tu manges, avec macros précis." />
            <Step num="3" title="Suis tes progrès" desc="Dashboard quotidien, graphiques hebdo, insights IA pour ajuster ton plan." />
          </div>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section id="screenshots" style={{ padding: '70px 0 30px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Header title="L'app en images" sub="Captures réelles de Salorie sur Android — 16 écrans." />
        </div>
        <div className="shots-scroll" style={{
          display: 'flex', gap: 26, overflowX: 'auto', padding: '28px 24px 36px',
          scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
        }}>
          {SHOTS.map((s) => (
            <div key={s.src} style={{ flex: '0 0 auto', scrollSnapAlign: 'center', textAlign: 'center' }}>
              <PhoneFrame src={s.src} />
              <div style={{ marginTop: 14, fontSize: 14, fontWeight: 700, color: '#334155' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
          ← Fais défiler pour voir tous les écrans →
        </p>
      </section>

      {/* DOWNLOAD */}
      <section id="download" style={{ padding: '70px 24px' }}>
        <div style={{
          maxWidth: 920, margin: '0 auto', padding: 56, borderRadius: 32,
          background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
          color: '#fff', textAlign: 'center', boxShadow: '0 30px 60px rgba(41,143,80,0.3)',
        }}>
          <Smartphone size={52} style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1, margin: 0 }}>Disponible sur Android</h2>
          <p style={{ fontSize: 18, marginTop: 14, opacity: 0.95 }}>
            APK signé de production — installation directe. Bientôt sur Google Play.
          </p>
          {meta?.date && (
            <p style={{ fontSize: 13, marginTop: 8, opacity: 0.78 }}>
              Build v1.0.0 · {meta.date}
              {meta.apkMB && ` · APK ${meta.apkMB} MB`}{meta.aabMB && ` · AAB ${meta.aabMB} MB`}
            </p>
          )}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <a href={APK_URL} download style={{
              padding: '16px 30px', borderRadius: 14, background: '#fff', color: PRIMARY_DARK,
              fontWeight: 800, fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              <Download size={20} /> Télécharger l&apos;APK
              {meta?.apkMB && <span style={{ opacity: 0.7, fontSize: 13 }}>({meta.apkMB} MB)</span>}
            </a>
            <a href={AAB_URL} download style={{
              padding: '16px 30px', borderRadius: 14, background: 'rgba(255,255,255,0.15)', color: '#fff',
              fontWeight: 800, fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 10,
              border: '2px solid rgba(255,255,255,0.35)',
            }}>
              <Package size={20} /> Bundle .aab (Play Store)
              {meta?.aabMB && <span style={{ opacity: 0.7, fontSize: 13 }}>({meta.aabMB} MB)</span>}
            </a>
          </div>
          <div style={{ marginTop: 20 }}>
            <a href={REPO} target="_blank" rel="noopener" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700,
              opacity: 0.92, textDecoration: 'underline',
            }}>
              <ExternalLink size={16} /> Code source & releases sur GitHub
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: 14 }}>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          <a href="/privacy" style={{ color: PRIMARY_DARK, fontWeight: 600 }}>Confidentialité</a>
          <a href="/terms" style={{ color: PRIMARY_DARK, fontWeight: 600 }}>Conditions</a>
          <a href={REPO} target="_blank" rel="noopener" style={{ color: PRIMARY_DARK, fontWeight: 600 }}>GitHub</a>
        </div>
        <p>© 2026 Salorie — <a href="https://salistar.com" style={{ color: PRIMARY_DARK, fontWeight: 600 }}>salistar.com</a></p>
      </footer>
    </main>
  );
}

function PhoneFrame({ src, big = false }: { src: string; big?: boolean }) {
  const h = big ? 600 : 540;
  return (
    <div style={{
      height: h, width: big ? 296 : 266, padding: 10, borderRadius: 42,
      background: 'linear-gradient(135deg, #1f2937, #0f172a)',
      boxShadow: '0 26px 60px rgba(15,23,42,0.30)', flex: '0 0 auto', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)',
        width: 90, height: 18, borderRadius: 999, background: '#0f172a', zIndex: 2,
      }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Capture Salorie" style={{
        width: '100%', height: '100%', objectFit: 'cover',
        borderRadius: 32, display: 'block', background: '#fff',
      }} />
    </div>
  );
}

function Header({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 44 }}>
      <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1, margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 18, color: '#64748b', marginTop: 14 }}>{sub}</p>}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 900, color: PRIMARY_DARK }}>{value}</div>
      <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{ padding: 26, borderRadius: 20, background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
      <div style={{
        width: 54, height: 54, borderRadius: 14, background: 'rgba(41,143,80,0.1)', color: PRIMARY_DARK,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 15, color: '#64748b', marginTop: 10, marginBottom: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div style={{ position: 'relative', padding: 28, borderRadius: 20, background: '#fff', border: '1px solid #e2e8f0' }}>
      <div style={{
        position: 'absolute', top: -20, left: 28, width: 48, height: 48, borderRadius: 14,
        background: PRIMARY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 900, boxShadow: '0 8px 20px rgba(41,143,80,0.3)',
      }}>{num}</div>
      <h3 style={{ fontSize: 19, fontWeight: 800, margin: '24px 0 12px 0' }}>{title}</h3>
      <p style={{ fontSize: 15, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}
