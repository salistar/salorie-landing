import Landing from './Landing';

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
    return {
      apkMB: apk ? mb(apk.size) : null,
      aabMB: aab ? mb(aab.size) : null,
      iso: apk ? apk.updated_at : null,
    };
  } catch {
    return null;
  }
}

export default async function Page() {
  const meta = await getReleaseMeta();
  return <Landing meta={meta} />;
}
