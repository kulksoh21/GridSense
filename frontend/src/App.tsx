import './index.css';
import { useState } from 'react';
import { EnergyForm } from './components/EnergyForm';
import { Dashboard } from './components/Dashboard';
import { predictEnergyBill, getRecommendations, calculateGoalProgress, UserInput, EnergyPrediction } from './services/api';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

function App() {
  const [prediction, setPrediction] = useState<EnergyPrediction | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [goalProgress, setGoalProgress] = useState(0);

  const handleFormSubmit = async (data: UserInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictEnergyBill(data);
      setPrediction(result);
      setUserInput(data);
      const recs = getRecommendations(result, data);
      setRecommendations(recs);
      const progress = calculateGoalProgress(result.predicted_bill_usd, data.monthly_spend_goal);
      setGoalProgress(progress);
    } catch (err) {
      setError('Failed to analyze energy usage. Please check if the backend server is running on http://localhost:5000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">⚡</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">GridSense</h1>
                <p className="text-sm text-gray-600">Smart Energy Usage Analysis</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Analyze • Identify • Optimize
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <EnergyForm onSubmit={handleFormSubmit} loading={loading} />
          </div>

          {/* Right Column - Dashboard */}
          <div className="lg:col-span-2">
            {prediction ? (
              <Dashboard
                prediction={prediction}
                userInput={userInput}
                recommendations={recommendations}
                goalProgress={goalProgress}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Get Started
                </h3>
                <p className="text-gray-600">
                  Fill out the form to analyze your home's energy usage and discover personalized recommendations to reduce your bill.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">GridSense</h3>
              <p className="text-gray-400">
                Helping households reduce energy waste and cut carbon emissions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="text-gray-400 space-y-2">
                <li>Energy usage analysis</li>
                <li>Bill predictions</li>
                <li>Carbon footprint tracking</li>
                <li>Personalized recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links</h4>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <FiGithub />
                  <span>GitHub</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiExternalLink />
                  <span>Documentation</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 GridSense. Made with ⚡ for a sustainable future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
