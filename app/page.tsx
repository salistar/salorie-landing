import {
  Camera, Activity, Brain, TrendingUp, Globe, Shield,
  Smartphone, ChevronRight, Github, ExternalLink, Star, Download,
} from 'lucide-react';

const PRIMARY = '#298f50';
const PRIMARY_DARK = '#1f6b3c';

// URL stable du dernier APK debug Salorie publie par GitHub Actions
// (tag "latest" overwrite a chaque push main, voir .github/workflows/android-build.yml du repo mobile).
// GitHub Releases sert avec Content-Disposition: attachment, donc <a download> declenche
// un vrai telechargement sans navigation.
const APK_URL = 'https://github.com/salistar/salorie/releases/download/latest/app-debug.apk';

// Helper pour fetcher la taille + date du dernier release (Server Component, cache 5min)
async function getApkMeta(): Promise<{ sizeMB: string; date: string } | null> {
  try {
    const res = await fetch('https://api.github.com/repos/salistar/salorie/releases/tags/latest', {
      next: { revalidate: 300 }, // re-fetch toutes les 5 min
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const apk = data.assets?.find((a: any) => a.name === 'app-debug.apk');
    if (!apk) return null;
    const sizeMB = (apk.size / 1024 / 1024).toFixed(0);
    const date = new Date(apk.updated_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    return { sizeMB, date };
  } catch {
    return null;
  }
}

export default async function Home() {
  const apk = await getApkMeta();
  return (
    <main style={{ overflow: 'hidden' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 18, fontWeight: 900,
            }}>S</div>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
              Salorie
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#features" style={{ fontSize: 15, fontWeight: 500, color: '#475569' }}>Features</a>
            <a href="#how" style={{ fontSize: 15, fontWeight: 500, color: '#475569' }}>How it works</a>
            <a href="https://github.com/salistar/salorie" target="_blank" rel="noopener"
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
        paddingTop: 140, paddingBottom: 80,
        background: `linear-gradient(180deg, #f0fdf4 0%, transparent 100%)`,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 999,
              background: 'rgba(41,143,80,0.1)', color: PRIMARY_DARK,
              fontSize: 13, fontWeight: 700, marginBottom: 24,
            }}>
              <Star size={14} /> AI-powered • Built with Gemini
            </div>
            <h1 style={{
              fontSize: 56, fontWeight: 900, lineHeight: 1.05,
              letterSpacing: -1.5, margin: '0 0 24px 0',
            }}>
              Scanne ton repas,<br />
              <span style={{ color: PRIMARY }}>suis tes calories</span>,<br />
              atteins tes objectifs.
            </h1>
            <p style={{
              fontSize: 20, color: '#475569', lineHeight: 1.6,
              margin: '0 0 32px 0', maxWidth: 520,
            }}>
              Salorie utilise l'intelligence artificielle Gemini pour analyser
              tes repas en temps réel. Macros, calories, recommandations — tout
              en un scan.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a
                href={APK_URL}
                download="salorie-latest.apk"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '16px 32px', borderRadius: 14,
                  background: PRIMARY, color: '#fff',
                  fontWeight: 700, fontSize: 16,
                  boxShadow: '0 10px 30px rgba(41,143,80,0.3)',
                }}
              >
                <Download size={18} /> Télécharger l'APK
                {apk && <span style={{ opacity: 0.8, fontSize: 13, marginLeft: 4 }}>({apk.sizeMB} MB)</span>}
              </a>
              <a href="https://github.com/salistar/salorie" target="_blank" rel="noopener" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 32px', borderRadius: 14,
                background: '#fff', color: '#0f172a',
                fontWeight: 700, fontSize: 16,
                border: '2px solid #e2e8f0',
              }}>
                <Github size={18} /> Voir le code
              </a>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
              <Stat value="100%" label="Privé & sécurisé" />
              <Stat value="<2s" label="Analyse IA" />
              <Stat value="3" label="Langues (FR/EN/AR)" />
            </div>
          </div>

          {/* Mock phone */}
          <div style={{
            position: 'relative', height: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 280, height: 560, borderRadius: 40,
              background: 'linear-gradient(135deg, #1f2937, #0f172a)',
              padding: 12, boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
              position: 'relative',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: 30,
                background: '#fff', padding: 20, display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ height: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 700 }}>
                  <span>9:41</span>
                  <span>●●●</span>
                </div>
                <div style={{
                  marginTop: 16, padding: 18, borderRadius: 18,
                  background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                  color: '#fff',
                }}>
                  <div style={{ fontSize: 11, opacity: 0.9 }}>Aujourd'hui</div>
                  <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4 }}>1,847</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>/ 2,200 kcal</div>
                </div>
                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <Mac label="P" value="142g" color="#3b82f6" />
                  <Mac label="C" value="186g" color="#f59e0b" />
                  <Mac label="L" value="65g" color="#ef4444" />
                </div>
                <div style={{ marginTop: 14, padding: 14, background: '#f1f5f9', borderRadius: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>📸 SCAN IA</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6 }}>Poulet grillé + riz</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>520 kcal • 45g protéines</div>
                </div>
                <div style={{
                  marginTop: 'auto', height: 56, borderRadius: 18,
                  background: PRIMARY, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 15,
                }}>
                  <Camera size={18} style={{ marginRight: 8 }} /> Scanner mon repas
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1, margin: 0 }}>
              Tout ce qu'il te faut pour atteindre tes objectifs
            </h2>
            <p style={{ fontSize: 18, color: '#64748b', marginTop: 16 }}>
              Une app complète, conçue pour les vrais utilisateurs.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <Feature
              icon={<Camera size={28} />}
              title="Scan IA instantané"
              desc="Prends une photo de ton repas, Gemini analyse les ingrédients et calcule les macros en moins de 2 secondes."
            />
            <Feature
              icon={<Activity size={28} />}
              title="Suivi nutritionnel complet"
              desc="Calories, protéines, glucides, lipides, eau, exercice — tout est centralisé dans un dashboard clair."
            />
            <Feature
              icon={<Brain size={28} />}
              title="Insights personnalisés"
              desc="L'IA t'envoie des recommandations adaptées à ton profil, tes objectifs et tes habitudes alimentaires."
            />
            <Feature
              icon={<TrendingUp size={28} />}
              title="Plan nutritionnel sur mesure"
              desc="Calcul automatique de tes besoins selon ton sexe, âge, poids, taille, niveau d'activité et objectif."
            />
            <Feature
              icon={<Globe size={28} />}
              title="3 langues, RTL inclus"
              desc="Français, English, العربية. Interface arabe right-to-left parfaitement intégrée."
            />
            <Feature
              icon={<Shield size={28} />}
              title="Authentification sécurisée"
              desc="Sign-in via Clerk (email + Google OAuth). Données chiffrées dans Firebase Firestore."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #f8fafc, #f0fdf4)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1, margin: 0, textAlign: 'center', marginBottom: 60 }}>
            Comment ça marche
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            <Step num="1" title="Onboarding rapide" desc="Renseigne ton profil (5 questions). On calcule tes besoins en moins d'une minute." />
            <Step num="2" title="Scan tes repas" desc="Pointe la caméra sur ton assiette. Gemini analyse et te dit ce que tu manges, avec macros précis." />
            <Step num="3" title="Suis tes progrès" desc="Dashboard quotidien, graphiques hebdo, insights IA pour ajuster ton plan." />
          </div>
        </div>
      </section>

      {/* DOWNLOAD CTA */}
      <section id="download" style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          padding: 60, borderRadius: 32,
          background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
          color: '#fff', textAlign: 'center',
          boxShadow: '0 30px 60px rgba(41,143,80,0.3)',
        }}>
          <Smartphone size={56} style={{ marginBottom: 24 }} />
          <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1, margin: 0 }}>
            Disponible sur Android
          </h2>
          <p style={{ fontSize: 18, marginTop: 16, opacity: 0.95 }}>
            APK direct (debug) — bientôt sur Google Play.
          </p>
          {apk && (
            <p style={{ fontSize: 13, marginTop: 8, opacity: 0.75 }}>
              Dernière build : {apk.date} · {apk.sizeMB} MB
            </p>
          )}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
            <a
              href={APK_URL}
              download="salorie-latest.apk"
              style={{
                padding: '16px 32px', borderRadius: 14,
                background: '#fff', color: PRIMARY_DARK,
                fontWeight: 800, fontSize: 16,
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}
            >
              <Download size={20} /> Télécharger APK
              {apk && <span style={{ opacity: 0.7, fontSize: 13, marginLeft: 4 }}>({apk.sizeMB} MB)</span>}
            </a>
            <a href="https://github.com/salistar/salorie"
               target="_blank" rel="noopener"
               style={{
                 padding: '16px 32px', borderRadius: 14,
                 background: 'rgba(255,255,255,0.15)', color: '#fff',
                 fontWeight: 800, fontSize: 16,
                 display: 'inline-flex', alignItems: 'center', gap: 10,
                 border: '2px solid rgba(255,255,255,0.3)',
               }}>
              <ExternalLink size={20} /> Code source
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '40px 24px', textAlign: 'center',
        borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: 14,
      }}>
        <p>© 2026 Salorie — <a href="https://salistar.com" style={{ color: PRIMARY_DARK, fontWeight: 600 }}>salistar.com</a></p>
      </footer>
    </main>
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

function Mac({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: 10, background: '#f8fafc', borderRadius: 10, textAlign: 'center' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 800, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{
      padding: 28, borderRadius: 20, background: '#fff',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'rgba(41,143,80,0.1)', color: PRIMARY_DARK,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
      }}>{icon}</div>
      <h3 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 15, color: '#64748b', marginTop: 10, marginBottom: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div style={{ position: 'relative', padding: 28, borderRadius: 20, background: '#fff', border: '1px solid #e2e8f0' }}>
      <div style={{
        position: 'absolute', top: -20, left: 28,
        width: 48, height: 48, borderRadius: 14,
        background: PRIMARY, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 900,
        boxShadow: '0 8px 20px rgba(41,143,80,0.3)',
      }}>{num}</div>
      <h3 style={{ fontSize: 19, fontWeight: 800, margin: '24px 0 12px 0' }}>{title}</h3>
      <p style={{ fontSize: 15, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}
