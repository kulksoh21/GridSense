import { useState } from 'react';
import { UserInput } from '../services/api';
import { getClimateFromZipCode, getClimateLabel } from '../services/climateService';

interface EnergyFormProps {
  onSubmit: (data: UserInput) => void;
  loading: boolean;
}

export const EnergyForm = ({ onSubmit, loading }: EnergyFormProps) => {
  const [formData, setFormData] = useState<UserInput>({
    home_size_sqft: 2000,
    residents: 2,
    location: 'coastal',
    utility: 'PG&E',
    ac_level: 'medium',
    climate: 'coastal',
    time_usage_type: 'mixed',
    fridge: 1,
    washer: 1,
    dryer: 0,
    dishwasher: 0,
    ev_charger: 0,
    pool_pump: 0,
    monthly_spend_goal: undefined,
  });

  const [zipCode, setZipCode] = useState('');
  const [climateLoading, setClimateLoading] = useState(false);
  const [climateError, setClimateError] = useState<string | null>(null);
  const [, setAcHours] = useState(12);
  const [homeSizeInput, setHomeSizeInput] = useState('2000');
  const [acHoursInput, setAcHoursInput] = useState('12');

  const handleInputChange = (field: keyof UserInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value;
    setZipCode(zip);
    setClimateError(null);

    if (zip.length >= 4) {
      setClimateLoading(true);
      try {
        const climate = await getClimateFromZipCode(zip);
        if (climate) {
          handleInputChange('climate', climate);
          setClimateError(null);
        } else {
          // Silently use fallback, don't show error
          setClimateError(null);
        }
      } catch (error) {
        console.error('Error fetching climate:', error);
        setClimateError(null);
      } finally {
        setClimateLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell Us About Your Home</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ZIP Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code / Postal Code
          </label>
          <input
            type="text"
            value={zipCode}
            onChange={handleZipCodeChange}
            placeholder="e.g., 94022"
            maxLength={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-energy-blue focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Auto-detects climate using weather data (US only)</p>
        </div>

        {/* Home Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Home Size (sqft)
          </label>
          <input
            type="number"
            value={homeSizeInput}
            onChange={(e) => {
              const rawValue = e.target.value;
              setHomeSizeInput(rawValue);

              if (rawValue === '') {
                return;
              }

              const parsed = parseInt(rawValue, 10);
              if (!Number.isNaN(parsed)) {
                handleInputChange('home_size_sqft', parsed);
              }
            }}
            onBlur={() => {
              if (homeSizeInput.trim() === '') {
                setHomeSizeInput('0');
                handleInputChange('home_size_sqft', 0);
              }
            }}
            step="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-energy-blue focus:border-transparent"
          />
        </div>

        {/* Residents */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Residents
          </label>
          <select
            value={formData.residents.toString()}
            onChange={(e) => handleInputChange('residents', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-energy-blue focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n.toString()}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Utility Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Utility Provider
          </label>
          <select
            value={formData.utility}
            onChange={(e) => handleInputChange('utility', e.target.value as UserInput['utility'])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-energy-blue focus:border-transparent"
          >
            <option value="PG&E">PG&E</option>
            <option value="SCE">SCE</option>
            <option value="SDG&E">SDG&E</option>
          </select>
        </div>

        {/* Climate Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Climate Type {climateLoading && <span className="text-xs text-gray-500">(detecting...)</span>}
          </label>
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium">
            {getClimateLabel(formData.climate)}
          </div>
          {climateError && (
            <p className="text-xs text-orange-600 mt-1">⚠️ {climateError}</p>
          )}
        </div>

        {/* AC/Heating Hours Per Day */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AC/Heating Hours Per Day
          </label>
          <input
            type="number"
            min="0"
            max="24"
            value={acHoursInput}
            onChange={(e) => {
              const rawValue = e.target.value;
              setAcHoursInput(rawValue);

              if (rawValue === '') {
                return;
              }

              const parsed = parseInt(rawValue, 10);
              if (Number.isNaN(parsed)) {
                return;
              }

              const hours = Math.max(0, Math.min(24, parsed));
              setAcHours(hours);
              const level = hours <= 8 ? 'low' : hours <= 14 ? 'medium' : 'high';
              handleInputChange('ac_level', level);
            }}
            onBlur={() => {
              if (acHoursInput.trim() === '') {
                setAcHoursInput('0');
                setAcHours(0);
                handleInputChange('ac_level', 'low');
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Low: ≤8h | Medium: 8-14h | High: ≥14h</p>
        </div>

        {/* Time Usage Type */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            When Do You Use The Most Energy?
          </label>
          <select
            value={formData.time_usage_type}
            onChange={(e) => handleInputChange('time_usage_type', e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-energy-blue focus:border-transparent"
          >
            <option value="morning_peak">Morning Peak (High usage 6am-10am, electricity is more expensive)</option>
            <option value="evening_peak">Evening Peak (High usage 4pm-9pm, electricity is most expensive)</option>
            <option value="off_peak">Off Peak (Most usage after 9pm, cheapest electricity rates)</option>
            <option value="mixed">Mixed (Even usage throughout the day)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Peak hours have higher electricity rates. Shifting usage to off-peak saves money!</p>
        </div>

        {/* Monthly Spend Goal */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Spend Goal (Optional)
          </label>
          <input
            type="number"
            value={formData.monthly_spend_goal || ''}
            onChange={(e) =>
              handleInputChange('monthly_spend_goal', e.target.value ? parseFloat(e.target.value) : undefined)
            }
            min="0"
            step="10"
            placeholder="e.g., 100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-energy-blue focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Enter your target monthly bill to track progress</p>
        </div>
      </div>

      {/* Appliances Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appliances</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'fridge', label: 'Refrigerator' },
            { key: 'washer', label: 'Washing Machine' },
            { key: 'dryer', label: 'Dryer' },
            { key: 'dishwasher', label: 'Dishwasher' },
            { key: 'ev_charger', label: 'EV Charger' },
            { key: 'pool_pump', label: 'Pool Pump' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData[key as keyof UserInput] === 1}
                onChange={(e) =>
                  handleInputChange(key as keyof UserInput, e.target.checked ? 1 : 0)
                }
                className="w-4 h-4 text-energy-blue border-gray-300 rounded focus:ring-energy-blue"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 bg-energy-blue text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Analyzing Your Usage...' : 'Get My Energy Analysis'}
      </button>
    </form>
  );
};
