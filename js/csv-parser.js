/**
 * CSV 파서 모듈
 * CSV 데이터를 파싱하고 처리하는 함수들을 포함합니다.
 */

/**
 * CSV 데이터를 파싱하여 구조화된 객체로 변환
 * @param {string} csvText - 파싱할 CSV 텍스트
 * @returns {Object} 파싱 결과와 유효성 검사 정보
 */
export function processCSV(csvText) {
  const result = {
    data: {},
    validation: {
      isValid: true,
      errors: []
    }
  };
  
  if (!csvText) {
    result.validation.isValid = false;
    result.validation.errors.push('CSV 데이터가 비어 있습니다.');
    return result;
  }
  
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  
  lines.forEach((line, index) => {
    // 첫 번째 쉼표 위치 찾기
    const firstCommaIndex = line.indexOf(',');
    
    if (firstCommaIndex === -1) {
      result.validation.isValid = false;
      result.validation.errors.push(`라인 ${index + 1}: 쉼표가 없습니다.`);
      return;
    }
    
    // ID와 값 분리
    const id = line.substring(0, firstCommaIndex).trim();
    const value = line.substring(firstCommaIndex + 1).trim();
    
    // ID가 3자리 숫자인지 확인
    if (!/^\d{3}$/.test(id)) {
      result.validation.isValid = false;
      result.validation.errors.push(`라인 ${index + 1}: ID는 3자리 숫자여야 합니다. 문제의 ID: ${id}`);
      return;
    }
    
    // 값이 JSON 배열인지 확인 및 파싱
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        result.data[id] = JSON.parse(value);
      } catch (error) {
        console.error(`JSON 파싱 오류 (ID: ${id}):`, error);
        result.data[id] = value; // 파싱 실패 시 원래 값 사용
      }
    } else {
      // 따옴표로 감싸진 문자열에서 따옴표 제거
      if (value.startsWith('"') && value.endsWith('"')) {
        result.data[id] = value.substring(1, value.length - 1);
      } else {
        result.data[id] = value;
      }
    }
  });
  
  // 필수 속성 검사
  const requiredProperties = ['101', '301', '302', '501'];
  const missingProperties = requiredProperties.filter(prop => !result.data[prop]);
  
  if (missingProperties.length > 0) {
    result.validation.errors.push(`다음 필수 속성이 누락되었습니다: ${missingProperties.join(', ')}`);
    // 필수 속성이 없으면 경고만 발생, 데이터는 처리
  }
  
  return result;
}

/**
 * 업로드된 데이터를 600-700번대 CSV 형식으로 변환
 * @param {Object} uploadedData - 업로드된 데이터 객체 {headers, data}
 * @returns {string} 생성된 CSV 문자열
 */
export function generateFrameworkCSV(uploadedData) {
  const { headers, data } = uploadedData;
  
  if (!headers || headers.length === 0 || !data || data.length === 0) {
    return ''; // 데이터가 없으면 빈 문자열 반환
  }
  
  // 현재 CSV 입력값 가져오기
  const csvInput = document.getElementById('csv-input');
  if (!csvInput || !csvInput.value.trim()) {
    throw new Error('기본 인포그래픽 속성(101-500번대)을 먼저 입력해주세요.');
  }
  
  const currentLines = csvInput.value.trim().split('\n');
  const currentProperties = {};
  
  // 현재 속성 파싱
  currentLines.forEach(line => {
    const firstComma = line.indexOf(',');
    if (firstComma > 0) {
      const id = line.substring(0, firstComma).trim();
      const value = line.substring(firstComma + 1).trim();
      currentProperties[id] = value;
    }
  });
  
  let result = '';
  
  // 기존 500번대까지 속성 유지
  for (let i = 100; i < 600; i++) {
    if (currentProperties[i]) {
      result += `${i},${currentProperties[i]}\n`;
    }
  }
  
  // 새로운 600-700번대 데이터 추가
  // X축 레이블 (첫 번째 열 데이터)
  const xLabels = data.map(row => row[0]);
  result += `601,${JSON.stringify(xLabels)}\n`;
  
  // Y축 단위 (두 번째 헤더)
  if (headers.length > 1) {
    result += `602,"${headers[1]}"\n`;
  }
  
  // 데이터 시리즈 레이블 (헤더의 두 번째부터)
  if (headers.length > 1) {
    const seriesLabels = headers.slice(1);
    result += `603,${JSON.stringify(seriesLabels)}\n`;
  }
  
  // 데이터 세트 (701~705)
  if (headers.length > 1) {
    try {
      const datasets = [];
      
      // 데이터 열 추출 (최대 5개 시리즈까지)
      for (let col = 1; col < Math.min(headers.length, 6); col++) {
        const values = data.map(row => {
          const value = row[col] || '';
          // 숫자로 변환 가능한 경우 숫자로 변환
          const numValue = parseFloat(value);
          return !isNaN(numValue) && value !== '' ? numValue : 0;
        });
        
        datasets.push(values);
      }
      
      // 데이터 세트 CSV 형식으로 추가 (701~705)
      for (let i = 0; i < datasets.length; i++) {
        result += `${701 + i},${JSON.stringify(datasets[i])}\n`;
      }
    } catch (error) {
      console.error('데이터 변환 오류:', error);
      throw new Error(`데이터 변환 오류: ${error.message}`);
    }
  }
  
  return result;
}

/**
 * CSV 파일 읽기
 * @param {File} file - 업로드된 CSV 파일
 * @returns {Promise<Object>} 파싱된 데이터 {headers, data}
 */
export function readCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = function() {
      reject(new Error('Excel 파일을 읽는 중 오류가 발생했습니다.'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * CSV 미리보기 표시
 * @param {Object} csvData - CSV 데이터 {headers, data}
 * @param {HTMLElement} container - 미리보기를 표시할 컨테이너
 */
export function displayCSVPreview(csvData, container) {
  const { headers, data } = csvData;
  
  // 테이블 생성
  let tableHTML = '<div class="table-responsive"><table class="table table-sm table-bordered">';
  
  // 헤더 행
  tableHTML += '<thead><tr>';
  headers.forEach(header => {
    tableHTML += `<th>${header}</th>`;
  });
  tableHTML += '</tr></thead>';
  
  // 데이터 행 (최대 10행까지만 표시)
  tableHTML += '<tbody>';
  const maxRows = Math.min(data.length, 10);
  for (let i = 0; i < maxRows; i++) {
    tableHTML += '<tr>';
    data[i].forEach(cell => {
      tableHTML += `<td>${cell}</td>`;
    });
    tableHTML += '</tr>';
  }
  tableHTML += '</tbody></table></div>';
  
  // 추가 정보
  if (data.length > 10) {
    tableHTML += `<div class="text-muted">총 ${data.length}행 중 10행만 표시됩니다.</div>`;
  }
  
  container.innerHTML = tableHTML;
  
  // 전역 변수에 업로드된 데이터 저장
  window.uploadedData = csvData;
  
  // CSV 변환 버튼 표시
  if (window.dataToCSVBtn) {
    window.dataToCSVBtn.style.display = 'block';
  }
}

/**
 * Excel 미리보기 표시 (CSV와 동일하게 처리)
 * @param {Object} excelData - Excel 데이터 {headers, data}
 * @param {HTMLElement} container - 미리보기를 표시할 컨테이너
 */
export function displayExcelPreview(excelData, container) {
  displayCSVPreview(excelData, container);
}nload = function(event) {
      try {
        const csvText = event.target.result;
        const rows = csvText.split(/\r?\n/).filter(row => row.trim());
        
        if (rows.length === 0) {
          reject(new Error('파일에 데이터가 없습니다.'));
          return;
        }
        
        // parseCSVRow 함수는 utils.js에서 가져옴
        const parseCSVRow = (row) => {
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
        };
        
        const headers = parseCSVRow(rows[0]);
        const data = rows.slice(1).map(row => parseCSVRow(row));
        
        resolve({ headers, data });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = function() {
      reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Excel 파일 읽기
 * @param {File} file - 업로드된 Excel 파일
 * @returns {Promise<Object>} 파싱된 데이터 {headers, data}
 */
export function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(event) {
      try {
        // XLSX 라이브러리 필요, main.js에서 로드 확인 필요
        if (typeof XLSX === 'undefined') {
          reject(new Error('XLSX 라이브러리가 로드되지 않았습니다.'));
          return;
        }
        
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          reject(new Error('파일에 데이터가 없습니다.'));
          return;
        }
        
        // 첫 번째 행은 헤더로 간주
        const headers = jsonData[0] || [];
        const rows = jsonData.slice(1);
        
        resolve({ headers, data: rows });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.o
