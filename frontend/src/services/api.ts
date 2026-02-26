import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export interface UserInput {
  home_size_sqft: number;
  residents: number;
  location: string;
  ac_level: 'low' | 'medium' | 'high';
  climate: 'coastal' | 'inland' | 'desert' | 'mountain';
  time_usage_type: 'morning_peak' | 'evening_peak' | 'off_peak' | 'mixed';
  fridge: 0 | 1;
  washer: 0 | 1;
  dryer: 0 | 1;
  dishwasher: 0 | 1;
  ev_charger: 0 | 1;
  pool_pump: 0 | 1;
  monthly_spend_goal?: number;
}

export interface EnergyPrediction {
  predicted_bill_usd: number;
  total_kwh: number;
  hvac_kwh: number;
  peak_kwh: number;
  offpeak_kwh: number;
  carbon_kg: number;
  monthly_energy_saving_recommendation: string;
}

export const predictEnergyBill = async (userInput: UserInput): Promise<EnergyPrediction> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, userInput);
    return response.data;
  } catch (error) {
    console.error('Error predicting energy bill:', error);
    throw error;
  }
};

export const getRecommendations = (prediction: EnergyPrediction, userInput: UserInput): string[] => {
  const recommendations: string[] = [];

  // Recommendation 1: HVAC
  if (userInput.ac_level === 'high') {
    const savingsFromHVAC = (prediction.hvac_kwh * 0.2 * 0.35).toFixed(2);
    recommendations.push(
      `Lower thermostat by 2°F to reduce HVAC usage by ~20% and save $${savingsFromHVAC}/month`
    );
  } else if (userInput.ac_level === 'medium') {
    const savingsFromHVAC = (prediction.hvac_kwh * 0.15 * 0.35).toFixed(2);
    recommendations.push(
      `Adjust thermostat to save ~15% on HVAC and cut $${savingsFromHVAC}/month from your bill`
    );
  }

  // Recommendation 2: Peak usage
  if (userInput.time_usage_type !== 'off_peak') {
    const savingsFromOffPeak = (prediction.peak_kwh * 0.2 * (0.35 - 0.15)).toFixed(2);
    recommendations.push(
      `Shift heavy appliance usage to off-peak hours (after 9 PM) and save $${savingsFromOffPeak}/month`
    );
  }

  // Recommendation 3: Appliances
  const applianceCount = Object.values(userInput).filter(
    (v) => v === 1 && typeof v === 'number'
  ).length;

  if (applianceCount > 3) {
    const savingsFromAppliances = ((prediction.total_kwh - prediction.hvac_kwh) * 0.15 * 0.35).toFixed(2);
    recommendations.push(
      `Unplug rarely-used appliances and use energy-efficient models, saving $${savingsFromAppliances}/month`
    );
  } else {
    recommendations.push(
      `Consider upgrading to ENERGY STAR appliances for long-term savings on your energy costs`
    );
  }

  // Add goal-specific recommendation if goal exists
  if (userInput.monthly_spend_goal) {
    const difference = prediction.predicted_bill_usd - userInput.monthly_spend_goal;
    if (difference > 0) {
      const goalsavings = difference.toFixed(2);
      recommendations[0] = `${recommendations[0]} to reach your $${userInput.monthly_spend_goal}/month goal`;
    }
  }

  return recommendations.slice(0, 3);
};

export const calculateGoalProgress = (
  currentBill: number,
  goalBill: number | undefined
): number => {
  if (!goalBill || goalBill <= 0) return 0;
  return Math.min(100, Math.max(0, (1 - (currentBill - goalBill) / goalBill) * 100));
};
