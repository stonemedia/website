export default function AdminHealth() {
  return (
    <main style={{ padding: 24, color: "white", background: "#0B0B0F", minHeight: "100vh" }}>
      <h1>Admin Health</h1>
      <pre style={{ marginTop: 16, opacity: 0.8 }}>
{JSON.stringify(
  {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  },
  null,
  2
)}
      </pre>
    </main>
  );
}