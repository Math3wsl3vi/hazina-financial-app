import React from "react";

const InvestmentOptions: React.FC = () => {
  return (
    <div className="min-h-screen font-poppins">
      {/* Header */}
      <header className=" text-black py-6 text-center">
        <h1 className="text-4xl font-bold">📊 Investment Options: High to Low Risk</h1>
        <p className="mt-2 text-lg">For Both Local and Global Markets</p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* High-Risk Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-red-600 mb-4">🟥 High-Risk Investments</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">🔹 Local</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Cryptocurrency Trading:</strong> Volatile and unregulated in Kenya; high potential returns but highly risky.
              </li>
              <li>
                <strong>Forex Trading:</strong> Popular among Kenyan youth; involves leverage, which can amplify losses.
              </li>
              <li>
                <strong>Startups / Angel Investing:</strong> Investing in small businesses or startups; can yield big rewards or total losses.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">🔹 Global</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Crypto Assets (e.g., Bitcoin, Ethereum):</strong> Globally volatile, affected by sentiment and regulation.
              </li>
              <li>
                <strong>Leveraged ETFs:</strong> Magnify gains and losses using borrowed capital.
              </li>
              <li>
                <strong>Penny Stocks / Speculative Stocks:</strong> Cheap stocks with little regulation or public info.
              </li>
            </ul>
          </div>
        </section>

        {/* Medium-Risk Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-orange-600 mb-4">🟧 Medium-Risk Investments</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">🔹 Local</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>SACCO Investments:</strong> Member-based savings groups offering dividends and credit access.
              </li>
              <li>
                <strong>Unit Trusts (e.g., Money Market Funds, Balanced Funds):</strong> Professionally managed with moderate returns and diversified risk.
              </li>
              <li>
                <strong>Real Estate (Off-Plan Buying):</strong> Can be rewarding, but risks exist with project delays or developer fraud.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">🔹 Global</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Index Funds / ETFs (e.g., S&P 500):</strong> Diversified and relatively stable over the long-term.
              </li>
              <li>
                <strong>Dividend Stocks:</strong> Companies that regularly pay out profits; more stable than growth stocks.
              </li>
              <li>
                <strong>REITs (Real Estate Investment Trusts):</strong> Gives global property exposure with fewer entry barriers.
              </li>
            </ul>
          </div>
        </section>

        {/* Low-Risk Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-green-600 mb-4">🟩 Low-Risk Investments</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">🔹 Local</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Treasury Bills & Bonds (CBK):</strong> Government-issued; fixed interest with minimal risk.
              </li>
              <li>
                <strong>Money Market Funds (e.g., from CIC, Britam):</strong> Short-term, low-volatility investments yielding ~8–11% annually.
              </li>
              <li>
                <strong>Fixed Deposits (Banks):</strong> Offer guaranteed returns but often lower than inflation.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">🔹 Global</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Government Bonds (e.g., US Treasury):</strong> Considered “risk-free”; yields vary by country and maturity.
              </li>
              <li>
                <strong>Global Money Market Accounts:</strong> Safe instruments used by international investors.
              </li>
              <li>
                <strong>High-Grade Corporate Bonds:</strong> Issued by stable companies; low default risk.
              </li>
            </ul>
          </div>
        </section>

        {/* Key Tips Section */}
        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">🧠 Key Tips</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Diversify across risk levels and markets (local + global).</li>
            <li>Always assess liquidity, return expectations, and investment horizon.</li>
            <li>Avoid putting all capital in high-risk assets, especially without an emergency fund.</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <div className="h-[55px]"></div>
    </div>
  );
};

export default InvestmentOptions;