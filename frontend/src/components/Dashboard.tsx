import { EnergyPrediction, UserInput } from '../services/api';
import { FiTrendingDown, FiTarget, FiLeaf } from 'react-icons/fi';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-energy-blue to-blue-600 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-2">Your Energy Usage Summary</h2>
        <p className="text-blue-100">
          {userInput.home_size_sqft} sqft home with {userInput.residents} resident
          {userInput.residents > 1 ? 's' : ''}
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
                {prediction.total_kwh.toFixed(0)}
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
                {prediction.carbon_kg.toFixed(0)} kg
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
          <h3 className="text-lg font-semibold text-gray-900">Top 3 Actions to Reduce Usage</h3>
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
                  {prediction.hvac_kwh.toFixed(0)} kWh
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-energy-orange h-2 rounded-full"
                  style={{
                    width: `${(prediction.hvac_kwh / prediction.total_kwh) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {((prediction.hvac_kwh / prediction.total_kwh) * 100).toFixed(1)}% of total usage
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
                    width: `${(prediction.peak_kwh / prediction.total_kwh) * 100}%`,
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
                    width: `${(prediction.offpeak_kwh / prediction.total_kwh) * 100}%`,
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
