'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Une erreur est survenue
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Nous sommes désolés, quelque chose s&apos;est mal passé.
            </p>
            <button
              onClick={reset}
              style={{ backgroundColor: '#000', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500' }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
