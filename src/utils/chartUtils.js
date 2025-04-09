import { SAMPLE_DATA } from '../data/sampleData';

// 차트 데이터 준비 함수
export const prepareChartData = (visType) => {
  const lowerType = visType.toLowerCase();
  
  if (lowerType.includes('bar chart')) {
    return SAMPLE_DATA.bar;
  } else if (lowerType.includes('line chart')) {
    return SAMPLE_DATA.line;
  } else if (lowerType.includes('pie chart') || lowerType.includes('donut chart')) {
    return SAMPLE_DATA.pie;
  } else if (lowerType.includes('area chart')) {
    return SAMPLE_DATA.area;
  } else if (lowerType.includes('process') || lowerType.includes('flow')) {
    return SAMPLE_DATA.process;
  } else if (lowerType.includes('timeline')) {
    return SAMPLE_DATA.timeline;
  } else if (lowerType.includes('comparison')) {
    return SAMPLE_DATA.comparison;
  } else if (lowerType.includes('scatter') || lowerType.includes('bubble')) {
    return SAMPLE_DATA.scatter;
  } else {
    // 기본 데이터
    return SAMPLE_DATA.bar;
  }
};

// SVG 다운로드 준비 함수
export const prepareSvgForDownload = (svgElement, title) => {
  if (!svgElement) return null;
  
  // SVG 복제 및 스타일 적용
  const svgClone = svgElement.cloneNode(true);
  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // 스타일 인라인화
  const styleElement = document.createElement('style');
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      Array.from(sheet.cssRules).forEach(rule => {
        styleElement.innerHTML += rule.cssText;
      });
    } catch (e) {
      console.log('Could not access stylesheet rules');
    }
  });
  
  svgClone.insertBefore(styleElement, svgClone.firstChild);
  
  // 제목 추가
  if (title) {
    const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleElement.setAttribute('x', '50%');
    titleElement.setAttribute('y', '30');
    titleElement.setAttribute('text-anchor', 'middle');
    titleElement.setAttribute('font-size', '20');
    titleElement.setAttribute('font-weight', 'bold');
    titleElement.textContent = title;
    svgClone.insertBefore(titleElement, svgClone.firstChild);
  }
  
  return svgClone;
};

// 차트 SVG를 PNG로 변환
export const convertSvgToPng = (svgElement, title, callback) => {
  const svgClone = prepareSvgForDownload(svgElement, title);
  if (!svgClone) {
    callback(null);
    return;
  }
  
  const svgData = new XMLSerializer().serializeToString(svgClone);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 이미지 생성
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    
    // PNG로 변환
    canvas.toBlob(function(blob) {
      callback(blob);
    }, 'image/png');
  };
  
  img.src = url;
};

// 차트 SVG 다운로드
export const downloadSvg = (svgElement, title, filename = 'infographic.svg') => {
  if (!svgElement) return;
  
  try {
    const svgClone = prepareSvgForDownload(svgElement, title);
    if (!svgClone) return;
    
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('SVG 다운로드 중 오류 발생:', error);
    alert('SVG 다운로드 중 오류가 발생했습니다.');
  }
};

// 차트 PNG 다운로드
export const downloadPng = (svgElement, title, filename = 'infographic.png') => {
  if (!svgElement) return;
  
  convertSvgToPng(svgElement, title, (blob) => {
    if (!blob) {
      alert('PNG 변환 중 오류가 발생했습니다.');
      return;
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};

// 레이아웃에 따른 차트 파라미터 조정
export const getLayoutParams = (layout, chartType) => {
  const lowerLayout = layout.toLowerCase();
  const lowerType = chartType.toLowerCase();
  
  // 기본 마진
  const defaultMargin = { top: 40, right: 30, left: 50, bottom: 30 };
  
  // 수평 레이아웃인 경우
  if (lowerLayout.includes('horizontal') && (lowerType.includes('bar') || lowerType.includes('column'))) {
    return {
      layout: 'vertical', // recharts에서는 수평 막대를 vertical 레이아웃으로 표시
      margin: { ...defaultMargin, left: 100 } // 수평 막대는 레이블을 위한 왼쪽 여백 필요
    };
  }
  
  // 수직 레이아웃인 경우
  else if (lowerLayout.includes('vertical') && (lowerType.includes('bar') || lowerType.includes('column'))) {
    return {
      layout: 'horizontal', // recharts에서는 수직 막대를 horizontal 레이아웃으로 표시
      margin: defaultMargin
    };
  }
  
  // 원형 레이아웃인 경우
  else if (lowerLayout.includes('circular') || 
          lowerType.includes('pie') || 
          lowerType.includes('donut')) {
    return {
      // 파이/도넛 차트의 경우 layout 속성은 없음
      margin: defaultMargin
    };
  }
  
  // 그리드 레이아웃인 경우
  else if (lowerLayout.includes('grid')) {
    return {
      // 그리드 레이아웃은 일반적으로 대시보드에 적용됨
      margin: { top: 20, right: 20, left: 20, bottom: 20 }
    };
  }
  
  // 기본 설정
  return {
    layout: 'horizontal',
    margin: defaultMargin
  };
};
