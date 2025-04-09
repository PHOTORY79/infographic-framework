// CSV 파싱 함수
export const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  const parsedData = [];
  
  lines.forEach(line => {
    if (!line.trim()) return;
    
    const firstComma = line.indexOf(',');
    if (firstComma === -1) return;
    
    const id = line.substring(0, firstComma).trim();
    const value = line.substring(firstComma + 1).trim();
    
    parsedData.push({ id, value });
  });
  
  return parsedData;
};

// CSV 데이터를 프레임워크 구조로 변환
export const organizeFrameworkData = (data) => {
  const organized = {
    meta: {},
    data: {},
    design: {},
    content: {},
    technical: {}
  };
  
  data.forEach(item => {
    const id = item.id;
    const firstDigit = id.charAt(0);
    
    switch (firstDigit) {
      case '1':
        organized.meta[id] = item.value;
        break;
      case '2':
        organized.data[id] = item.value;
        break;
      case '3':
        organized.design[id] = item.value;
        break;
      case '4':
        organized.content[id] = item.value;
        break;
      case '5':
        organized.technical[id] = item.value;
        break;
      default:
        break;
    }
  });
  
  return organized;
};

// CSV 데이터 검증
export const validateCSV = (data) => {
  const messages = [];
  const requiredAttributes = ['101', '301', '302', '501'];
  const missingAttributes = requiredAttributes.filter(attr => 
    !data.some(item => item.id === attr)
  );
  
  if (missingAttributes.length > 0) {
    messages.push({
      type: 'warning',
      message: `필수 속성이 누락되었습니다: ${missingAttributes.join(', ')}`,
      details: '효과적인 인포그래픽을 위해 이러한 속성을 포함하는 것이 좋습니다.'
    });
  }
  
  // 시각화 유형과 데이터 관계 검증
  const visualizationType = data.find(item => item.id === '101')?.value || '';
  const dataRelationship = data.find(item => item.id === '202')?.value || '';
  
  // 파이 차트와 추세 관계 확인
  if (visualizationType.toLowerCase().includes('pie chart') && 
      dataRelationship.toLowerCase() === 'trend') {
    messages.push({
      type: 'error',
      message: '파이 차트는 추세(Trend) 데이터 관계에 적합하지 않습니다.',
      details: '파이 차트는 구성(Composition) 또는 부분-전체(Part-to-Whole) 관계에 더 적합합니다.'
    });
  }
  
  // 타임라인과 구성 관계 확인
  if (visualizationType.toLowerCase().includes('timeline') && 
      dataRelationship.toLowerCase() === 'composition') {
    messages.push({
      type: 'error',
      message: '타임라인은 구성(Composition) 데이터 관계에 적합하지 않습니다.',
      details: '타임라인은 순차적(Sequential) 또는 추세(Trend) 관계에 더 적합합니다.'
    });
  }
  
  // 레이아웃과 차트 유형 호환성 확인
  const layout = data.find(item => item.id === '301')?.value || '';
  
  if (visualizationType.toLowerCase().includes('pie chart') && 
      layout.toLowerCase() === 'vertical') {
    messages.push({
      type: 'warning',
      message: '파이 차트에는 Circular 레이아웃이 더 적합합니다.',
      details: '현재 Vertical 레이아웃이 지정되어 있습니다.'
    });
  }
  
  // 레이아웃 및 색상 스키마가 있지만 시각화 유형이 없는 경우
  if (!visualizationType && (layout || data.some(item => item.id === '302'))) {
    messages.push({
      type: 'error',
      message: '시각화 유형(101)이 지정되지 않았습니다.',
      details: '레이아웃이나 색상 스키마보다 시각화 유형을 먼저 지정해야 합니다.'
    });
  }
  
  return messages;
};

// CSV 데이터를 문자열로 변환
export const csvDataToString = (data) => {
  return data.map(item => `${item.id},${item.value}`).join('\n');
};

// 인포그래픽 유형에 적합한 데이터 관계 추천
export const recommendDataRelationship = (visualType) => {
  const lowerType = visualType.toLowerCase();
  
  if (lowerType.includes('pie') || lowerType.includes('donut')) {
    return 'Composition (구성)';
  } else if (lowerType.includes('bar') || lowerType.includes('column')) {
    return 'Comparison (비교)';
  } else if (lowerType.includes('line') || lowerType.includes('area')) {
    return 'Trend (추세)';
  } else if (lowerType.includes('scatter') || lowerType.includes('bubble')) {
    return 'Correlation (상관관계)';
  } else if (lowerType.includes('timeline') || lowerType.includes('gantt')) {
    return 'Sequential (순차적)';
  } else if (lowerType.includes('process') || lowerType.includes('flow')) {
    return 'Sequential (순차적)';
  } else if (lowerType.includes('map')) {
    return 'Geographic (지리적)';
  } else {
    return 'Comparison (비교)';
  }
};

// 프레임워크 데이터에서 특정 속성 값 가져오기
export const getAttributeValue = (data, id, defaultValue = '') => {
  const item = data.find(item => item.id === id);
  return item ? item.value : defaultValue;
};
