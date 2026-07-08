import styles from "./page.module.css";

const endpoints = [
  "POST /api/trade/scan",
  "POST /api/trade/execute",
  "POST /api/trade/close-position",
  "GET /api/trade/positions",
  "POST /api/emergency/kill-switch",
  "POST /api/ai/ask",
];

const setupItems = [
  "npm install",
  "cp .env.example .env.local",
  "npm run lint",
  "npm run build",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.kicker}>Cletus Autonomous Trader</span>
          <h1>Compilable bootstrap for the documented trading system.</h1>
          <p>
            This repository now includes the missing Next.js and TypeScript project files needed to install,
            lint, test, and build successfully while the trading logic is implemented incrementally.
          </p>
          <span className={styles.status}>Build-ready scaffold with placeholder API routes</span>
        </section>

        <section className={styles.grid}>
          <article className={styles.panel}>
            <h2>Available placeholder routes</h2>
            <ul className={styles.list}>
              {endpoints.map((endpoint) => (
                <li key={endpoint}>
                  <code>{endpoint}</code>
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.panel}>
            <h2>Quick start</h2>
            <ul className={styles.list}>
              {setupItems.map((item) => (
                <li key={item}>
                  <code>{item}</code>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
