import { EnergyPrediction, UserInput } from '../services/api';
import { FiTarget, FiTrendingDown } from 'react-icons/fi';

interface DashboardProps {
  prediction: EnergyPrediction | null;
  userInput: UserInput | null;
  recommendations: string[];
  goalProgress: number;
}

export const Dashboard = ({ prediction, userInput, recommendations, goalProgress }: DashboardProps) => {
  if (!prediction || !userInput) {
    return null;
  }

  const totalKwh = prediction.total_kwh ?? 0;
  const hvacKwh = prediction.hvac_kwh ?? 0;
  const carbonKg = prediction.carbon_kg ?? 0;
  const hvacPct = totalKwh > 0 ? (hvacKwh / totalKwh) * 100 : 0;
  const peakPct = totalKwh > 0 ? (prediction.peak_kwh / totalKwh) * 100 : 0;
  const offpeakPct = totalKwh > 0 ? (prediction.offpeak_kwh / totalKwh) * 100 : 0;
  const ecoScore = prediction.eco_score ?? 0;
  const ecoGrade = prediction.eco_grade ?? 'N/A';
  const similarAvgKwh = prediction.similar_users_avg_kwh ?? 0;
  const similarComparison = prediction.similar_users_comparison ?? 'No comparison available yet.';
  const badges = prediction.badges ?? [];
  const leaderboard = prediction.leaderboard ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-energy-blue to-blue-600 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-2">Your Energy Usage Summary</h2>
        <p className="text-blue-100">
          {userInput.home_size_sqft} sqft home with {userInput.residents} resident
          {userInput.residents > 1 ? 's' : ''}
        </p>
        <p className="text-blue-100 text-sm mt-1">
          Utility provider: {prediction.utility ?? userInput.utility}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimated Bill */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly Bill</p>
              <p className="text-3xl font-bold text-energy-blue mt-2">
                ${prediction.predicted_bill_usd.toFixed(2)}
              </p>
            </div>
            <div className="text-4xl text-energy-blue opacity-20">💰</div>
          </div>
        </div>

        {/* Total kWh */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly kWh</p>
              <p className="text-3xl font-bold text-energy-orange mt-2">
                {totalKwh.toFixed(0)}
              </p>
            </div>
            <div className="text-4xl text-energy-orange opacity-20">⚡</div>
          </div>
        </div>

        {/* Carbon Footprint */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Carbon Footprint</p>
              <p className="text-3xl font-bold text-energy-green mt-2">
                {carbonKg.toFixed(0)} kg
              </p>
            </div>
            <div className="text-4xl text-energy-green opacity-20">🌱</div>
          </div>
        </div>

        {/* Peak vs Off-Peak */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div>
            <p className="text-gray-600 text-sm font-medium">Peak Usage</p>
            <p className="text-lg font-bold text-gray-900 mt-2">
              {prediction.peak_kwh.toFixed(0)} kWh
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Off-peak: {prediction.offpeak_kwh.toFixed(0)} kWh
            </p>
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      {userInput.monthly_spend_goal && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiTarget className="text-energy-blue mr-2 text-lg" />
            <h3 className="text-lg font-semibold text-gray-900">
              Progress Toward ${userInput.monthly_spend_goal}/month Goal
            </h3>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                goalProgress >= 100 ? 'bg-energy-green' : 'bg-energy-blue'
              }`}
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">
              Current: ${prediction.predicted_bill_usd.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {goalProgress.toFixed(0)}%
            </span>
          </div>
          {goalProgress < 100 && (
            <p className="text-sm text-energy-orange mt-2">
              📍 Save ${(prediction.predicted_bill_usd - userInput.monthly_spend_goal).toFixed(2)} more to reach your goal
            </p>
          )}
          {goalProgress >= 100 && (
            <p className="text-sm text-energy-green mt-2">
              ✓ You've met your goal!
            </p>
          )}
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <FiTrendingDown className="text-energy-green mr-2 text-lg" />
          <h3 className="text-lg font-semibold text-gray-900">Top Actions to Reduce Usage</h3>
        </div>
        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-energy-green"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-energy-green text-white rounded-full flex items-center justify-center font-bold mr-4">
                {idx + 1}
              </div>
              <p className="text-gray-800">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Eco Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <span className="text-energy-green mr-2 text-lg" aria-hidden="true">Eco</span>
          <h4 className="font-semibold text-gray-900">Eco Score</h4>
        </div>
        <p className="text-3xl font-bold text-energy-green">{ecoScore}</p>
        <p className="text-sm text-gray-600 mt-1">Grade: {ecoGrade}</p>
        {prediction.leaderboard_rank && (
          <p className="text-sm text-gray-600 mt-1">Leaderboard rank: #{prediction.leaderboard_rank}</p>
        )}
        {badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span key={badge} className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Similar Homes + Leaderboard Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Compared to Similar Homes</h4>
          <p className="text-sm text-gray-700">{similarComparison}</p>
          <p className="text-xs text-gray-500 mt-2">
            Similar-home average usage: {similarAvgKwh.toFixed(0)} kWh/month
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Top Eco Scores</h4>
          {leaderboard.length > 0 ? (
            <div className="space-y-1">
              {leaderboard.slice(0, 3).map((entry) => (
                <div key={`${entry.rank}-${entry.eco_score}`} className="flex justify-between text-sm text-gray-700">
                  <span>#{entry.rank}</span>
                  <span>{entry.eco_score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No leaderboard data yet.</p>
          )}
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HVAC Usage */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold text-gray-900 mb-4">HVAC Usage Breakdown</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">HVAC</span>
                <span className="text-sm font-semibold text-gray-900">
                  {hvacKwh.toFixed(0)} kWh
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-energy-orange h-2 rounded-full"
                  style={{
                    width: `${hvacPct}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {hvacPct.toFixed(1)}% of total usage
            </p>
          </div>
        </div>

        {/* Peak vs Off-Peak Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Usage by Time</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Peak Hours</span>
                <span className="text-sm font-semibold text-gray-900">
                  {prediction.peak_kwh.toFixed(0)} kWh
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-energy-blue h-2 rounded-full"
                  style={{
                    width: `${peakPct}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Off-Peak Hours</span>
                <span className="text-sm font-semibold text-gray-900">
                  {prediction.offpeak_kwh.toFixed(0)} kWh
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-energy-green h-2 rounded-full"
                  style={{
                    width: `${offpeakPct}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
