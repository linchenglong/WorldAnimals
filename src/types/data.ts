// 动物数据类型定义

export interface Animal {
  animal_cn: string;
  animal_en: string;
  scientific_name: string;
  category: string;
  is_endemic: boolean;
  is_national_animal: boolean;
  significance: string;
  conservation_status: string;
  image_url: string;
  image_keywords: string;
  fun_fact: string;
}

export interface CountryData {
  country: string;
  country_en: string;
  region: string;
  coordinates: [number, number]; // [lat, lng]
  animals: Animal[];
}

export interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  country: string;
  country_en: string;
  animals: Animal[];
}

// 将原始数据转换为标记数据
export function prepareMarkerData(data: CountryData[]): MarkerData[] {
  const markers: MarkerData[] = [];
  let id = 0;
  
  data.forEach(country => {
    markers.push({
      id: `marker-${id++}`,
      lat: country.coordinates[0],
      lng: country.coordinates[1],
      country: country.country,
      country_en: country.country_en,
      animals: country.animals
    });
  });
  
  return markers;
}
