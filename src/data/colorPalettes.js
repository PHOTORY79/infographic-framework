// 인포그래픽에 사용할 색상 팔레트 정의
export const COLOR_PALETTES = {
  'Corporate': ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c'],
  'Vibrant': ['#ff3e6c', '#34e4ea', '#ffde59', '#52489c', '#4cd964'],
  'Monochromatic': ['#252525', '#525252', '#737373', '#969696', '#bdbdbd', '#d9d9d9', '#f7f7f7'],
  'High Contrast': ['#000000', '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'],
  'Pastel': ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9'],
  'Cool Tones': ['#4575b4', '#91bfdb', '#e0f3f8', '#fee090', '#fc8d59'],
  'Warm Tones': ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb'],
  'Grayscale': ['#252525', '#636363', '#969696', '#cccccc', '#f7f7f7'],
  'Brand Colors': ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
  'Accessible': ['#0072B2', '#E69F00', '#009E73', '#CC79A7', '#56B4E9'],
  'Nature Inspired': ['#2E7D32', '#8BC34A', '#00796B', '#2196F3', '#FFC107'],
  'Data Driven': ['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', '#ffffe0', '#ffbcaf', '#f4777f', '#cf3759', '#93003a']
};

// 색상 스키마 설명
export const COLOR_DESCRIPTIONS = {
  'Corporate': '전문적이고 비즈니스에 적합한 푸른 톤의 컬러 스키마',
  'Vibrant': '선명하고 눈에 띄는 생동감 있는 색상들',
  'Monochromatic': '단일 색상의 다양한 농도로 구성된 세련된 스키마',
  'High Contrast': '접근성을 높이는 강한 대비의 색상 조합',
  'Pastel': '부드럽고 차분한 파스텔 색상',
  'Cool Tones': '차분한 블루, 그린 계열의 시원한 색상',
  'Warm Tones': '따뜻한 느낌의 레드, 오렌지 계열',
  'Grayscale': '흑백 톤의 전문적인 색상 스키마',
  'Brand Colors': '다양한 브랜드 감성의 균형 잡힌 조합',
  'Accessible': '색맹을 고려한 접근성 높은 색상',
  'Nature Inspired': '자연에서 영감을 받은 유기적인 색상',
  'Data Driven': '데이터 시각화에 최적화된 색상 스펙트럼'
};

// 특정 차트 유형에 추천되는 색상 스키마
export const RECOMMENDED_COLOR_SCHEMES = {
  'Bar Chart': ['Corporate', 'Vibrant', 'Monochromatic'],
  'Pie Chart': ['Vibrant', 'High Contrast', 'Cool Tones'],
  'Line Chart': ['Corporate', 'Cool Tones', 'Data Driven'],
  'Process Diagram': ['Vibrant', 'Corporate', 'Nature Inspired'],
  'Comparison Chart': ['High Contrast', 'Accessible', 'Corporate'],
  'Timeline': ['Cool Tones', 'Warm Tones', 'Corporate']
};

// 색상 팔레트에서 색상 가져오기
export const getColorsFromPalette = (paletteName, count = 5) => {
  const palette = COLOR_PALETTES[paletteName] || COLOR_PALETTES['Corporate'];
  
  // 필요한 색상 수가 팔레트보다 많으면 색상 반복
  if (count > palette.length) {
    const extendedPalette = [];
    for (let i = 0; i < count; i++) {
      extendedPalette.push(palette[i % palette.length]);
    }
    return extendedPalette;
  }
  
  // 그렇지 않으면 팔레트에서 필요한 만큼 가져오기
  return palette.slice(0, count);
};

// 특정 차트 유형에 적합한 색상 스키마 추천
export const recommendColorScheme = (chartType) => {
  const lowerType = chartType.toLowerCase();
  
  // 차트 유형에 따른 추천 색상 스키마 매핑
  if (lowerType.includes('bar')) {
    return RECOMMENDED_COLOR_SCHEMES['Bar Chart'];
  } else if (lowerType.includes('pie') || lowerType.includes('donut')) {
    return RECOMMENDED_COLOR_SCHEMES['Pie Chart'];
  } else if (lowerType.includes('line') || lowerType.includes('area')) {
    return RECOMMENDED_COLOR_SCHEMES['Line Chart'];
  } else if (lowerType.includes('process') || lowerType.includes('flow')) {
    return RECOMMENDED_COLOR_SCHEMES['Process Diagram'];
  } else if (lowerType.includes('comparison')) {
    return RECOMMENDED_COLOR_SCHEMES['Comparison Chart'];
  } else if (lowerType.includes('timeline')) {
    return RECOMMENDED_COLOR_SCHEMES['Timeline'];
  }
  
  // 기본값
  return ['Corporate', 'Vibrant', 'Accessible'];
};
