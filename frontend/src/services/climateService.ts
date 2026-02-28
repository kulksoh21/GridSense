/**
 * Climate detection using real weather data
 * Uses Nominatim for geocoding and Open-Meteo for weather data
 */

// Fallback ZIP code to climate mapping for CA
const zipToclimateDefault: Record<string, 'coastal' | 'inland' | 'desert' | 'mountain'> = {
  '90': 'coastal', '91': 'desert', '92': 'coastal', '93': 'desert',
  '94': 'coastal', '95': 'inland', '96': 'mountain',
};

export const getClimateFromZipCode = async (
  zipCode: string
): Promise<'coastal' | 'inland' | 'desert' | 'mountain' | null> => {
  try {
    // Step 1: Geocode ZIP code using Nominatim
    console.log('🔍 Fetching coordinates for ZIP:', zipCode);
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=US&format=json&limit=1`,
      { 
        headers: { 'Accept': 'application/json' },
      }
    );
    
    console.log('📍 Nominatim status:', geoResponse.status);
    
    if (!geoResponse.ok) {
      console.warn('❌ Geocoding failed with status:', geoResponse.status);
      const fallback = getFallbackClimate(zipCode);
      console.log('📌 Using fallback climate:', fallback);
      return fallback;
    }
    
    const geoData = await geoResponse.json();
    console.log('✅ Geocoding result:', geoData);
    
    if (!geoData || geoData.length === 0) {
      console.warn('❌ No geocoding results for ZIP:', zipCode);
      const fallback = getFallbackClimate(zipCode);
      console.log('📌 Using fallback climate:', fallback);
      return fallback;
    }

    const { lat, lon } = geoData[0];
    console.log(`✅ Geocoded to: lat=${lat}, lon=${lon}`);

    // Step 2: Get weather data from Open-Meteo
    console.log('🌤️ Fetching weather data...');
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code&timezone=auto`,
      { 
        headers: { 'Accept': 'application/json' },
      }
    );

    console.log('🌤️ Open-Meteo status:', weatherResponse.status);

    if (!weatherResponse.ok) {
      console.warn('❌ Weather API failed with status:', weatherResponse.status);
      const fallback = getFallbackClimate(zipCode);
      console.log('📌 Using fallback climate:', fallback);
      return fallback;
    }

    const weatherData = await weatherResponse.json();
    console.log('✅ Weather data:', weatherData);
    
    const temp = weatherData.current?.temperature_2m ?? null;
    const precipitation = weatherData.current?.precipitation ?? 0;
    console.log(`🌡️ Weather: temp=${temp}°C, precipitation=${precipitation}mm, lat=${lat}, lon=${lon}`);

    // Step 3: Determine climate type based on weather characteristics
    const climate = determineClimateType(temp, precipitation, lat, lon);
    console.log('🎯 Final detected climate:', climate);
    return climate;
  } catch (error) {
    console.error('💥 Error fetching climate data:', error);
    const fallback = getFallbackClimate(zipCode);
    console.log('📌 Using fallback climate:', fallback);
    return fallback;
  }
};

const getFallbackClimate = (zipCode: string): 'coastal' | 'inland' | 'desert' | 'mountain' => {
  if (!zipCode || zipCode.length < 2) return 'inland';
  
  const prefix = zipCode.substring(0, 2);
  console.log('Using fallback climate for ZIP prefix:', prefix);
  
  return zipToclimateDefault[prefix] || 'inland';
};

const determineClimateType = (
  temp: number | null,
  precipitation: number,
  latitude: number,
  longitude: number
): 'coastal' | 'inland' | 'desert' | 'mountain' | null => {
  // If no temp data, use fallback logic based on location
  if (temp === null) {
    // California coast (longitude -124 to -119)
    if (longitude > -125 && longitude < -118) {
      return 'coastal';
    }
    // Very low latitude in CA = desert (southern desert, lat < 34)
    if (latitude < 34) {
      return 'desert';
    }
    // High latitude in CA = mountain (lat > 39)
    if (latitude > 39) {
      return 'mountain';
    }
    return 'inland';
  }

  // DESERT: Very hot (> 26°C / 79°F) and dry (< 5mm)
  // OR: Low latitude (< 34) with hot temps (> 20°C)
  if ((temp > 26 && precipitation < 5) || (latitude < 34 && temp > 20)) {
    console.log(`  → Desert (temp=${temp}, lat=${latitude})`);
    return 'desert';
  }

  // MOUNTAIN: Cold (< 10°C / 50°F) 
  // OR: High latitude (> 39) with cool temps (< 18°C)
  if (temp < 10 || (latitude > 39 && temp < 18)) {
    console.log(`  → Mountain (temp=${temp}, lat=${latitude})`);
    return 'mountain';
  }

  // COASTAL: Very close to coast (longitude < -121.5) and not too inland
  // CA coast is roughly -124 to -117, but we want to catch actual coastal areas
  // Exclude inland areas like Sacramento (-121.3) which is further inland
  if (longitude < -121.5 && latitude > 32 && latitude < 41) {
    console.log(`  → Coastal (longitude=${longitude})`);
    return 'coastal';
  }

  // INLAND: Everything else (moderate temps, mid-latitudes, further from coast)
  console.log(`  → Inland (temp=${temp}, lat=${latitude}, lon=${longitude})`);
  return 'inland';
};

export const getClimateLabel = (
  climate: 'coastal' | 'inland' | 'desert' | 'mountain'
): string => {
  const labels: Record<string, string> = {
    coastal: 'Coastal',
    inland: 'Inland',
    desert: 'Desert',
    mountain: 'Mountain',
  };
  return labels[climate] || 'Inland';
};
