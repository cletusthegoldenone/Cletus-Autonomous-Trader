'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="text-6xl mb-4">🦆</div>
          <h1 className="text-5xl font-bold mb-2">
            Cletus <span className="text-cyan-400">PRO</span>
          </h1>
        </div>

        {/* Hero Text */}
        <h2 className="text-4xl font-bold mb-6 leading-tight">
          The ultimate <br />
          <span className="text-cyan-400">Solana DeFi</span>
          <br />
          command center.
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 mb-8 text-lg">
          Autonomous AI scanner • Real-time market briefings
        </p>

        {/* Status Badge */}
        <div className="inline-block border border-gray-600 rounded-full px-6 py-3 mb-8">
          <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
          <span className="text-gray-300">Now in closed beta • 142 traders online</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="border-2 border-gray-500 hover:border-gray-300 text-white px-8 py-3 rounded-lg transition">
            Join Waitlist
          </button>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-8 py-3 rounded-lg transition">
            Open Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}