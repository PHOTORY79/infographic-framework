/**
 * 유틸리티 함수 모음
 */

/**
 * 색상 스키마 가져오기
 * @param {string} colorSchemeKey - 색상 스키마 키
 * @returns {Array} 색상 배열
 */
export function getColorScheme(colorSchemeKey) {
  const colorSchemes = {
    'corporate': ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#5F6368'],
    'vibrant': ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33'],
    'monochromatic': ['#333333', '#555555', '#777777', '#999999', '#BBBBBB'],
    'pastel': ['#FFB6C1', '#AFEEEE', '#FFDAB9', '#D8BFD8', '#FFFACD'],
    'high contrast': ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
    'brand colors': ['#1877F2', '#E4405F', '#1DA1F2', '#0A66C2', '#FF0000'],
    'cool tones': ['#3498DB', '#1ABC9C', '#2ECC71', '#9B59B6', '#34495E'],
    'warm tones': ['#E74C3C', '#F39C12', '#D35400', '#F1C40F', '#E67E22']
  };
  
  // 색상 스키마 키 정규화
  const normalizedKey = colorSchemeKey ? colorSchemeKey.toLowerCase().replace(/\s+/g, ' ').trim() : 'corporate';
  
  // 해당 스키마 반환 또는 기본값
  return colorSchemes[normalizedKey] || colorSchemes['corporate'];
}

/**
 * CSV 파싱 유틸리티 함수
 * 
 * 쉼표로 구분된 CSV 행을 파싱하며 따옴표 처리를 지원함
 * @param {string} row - CSV 행
 * @returns {Array} 파싱된 값의 배열
 */
export function parseCSVRow(row) {
  const result = [];
  let inQuotes = false;
  let currentValue = '';
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // 마지막 값 추가
  result.push(currentValue);
  
  return result;
}

/**
 * HELP_DOC_URL 상수 - 도움말 문서 URL
 */
export const HELP_DOC_URL = 'https://drive.google.com/file/d/1_mNPzUPtWtQAVRjxBCwEkZkxs3zApJzZ/view?usp=sharing';

/**
 * 도움말 문서 열기
 */
export function openHelpDocument() {
  window.open(HELP_DOC_URL, '_blank');
}
