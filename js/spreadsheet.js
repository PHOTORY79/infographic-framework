/**
 * 스프레드시트 모듈
 * 스프레드시트 형식 데이터 입력 인터페이스를 제공합니다.
 */

/**
 * 스프레드시트 초기화
 * @param {HTMLElement} container - 스프레드시트를 렌더링할 컨테이너 요소
 * @param {Object} config - 설정 객체
 * @returns {Object} 스프레드시트 API 객체
 */
export function initSpreadsheet(container, config = {}) {
  // 오류 체크
  if (!container) {
    console.error('스프레드시트 초기화 오류: 컨테이너 요소가 제공되지 않았습니다.');
    throw new Error('스프레드시트 초기화에 실패했습니다.');
  }

  const spreadsheetContainer = document.createElement('div');
  spreadsheetContainer.className = 'spreadsheet-container';
  container.appendChild(spreadsheetContainer);
  
  // 기본 설정값
  const defaultConfig = {
    rows: 5,
    cols: 5,
    hasHeaders: true,
    headers: [],
    data: [],
    onChange: null
  };
  
  // 설정 병합
  const mergedConfig = { ...defaultConfig, ...config };
  
  // 현재 데이터 상태 저장
  const state = {
    rows: mergedConfig.rows,
    cols: mergedConfig.cols,
    data: [...mergedConfig.data] || Array(mergedConfig.rows).fill().map(() => Array(mergedConfig.cols).fill(''))
  };
  
  // 테이블 생성
  const table = document.createElement('table');
  table.className = 'spreadsheet-table';
  spreadsheetContainer.appendChild(table);
  
  // 헤더 행 생성
  if (mergedConfig.hasHeaders) {
    const thead = document.createElement('thead');
    table.appendChild(thead);
    
    const headerRow = document.createElement('tr');
    thead.appendChild(headerRow);
    
    // 헤더 셀 생성
    for (let col = 0; col < state.cols; col++) {
      const th = document.createElement('th');
      headerRow.appendChild(th);
      
      const headerInput = document.createElement('input');
      headerInput.type = 'text';
      headerInput.className = 'header-cell';
      headerInput.value = mergedConfig.headers[col] || getDefaultColumnName(col);
      headerInput.addEventListener('input', () => {
        mergedConfig.headers[col] = headerInput.value;
        notifyChange();
      });
      
      th.appendChild(headerInput);
    }
  }
  
  // 테이블 본문 생성
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  
  // 데이터 행 생성
  for (let row = 0; row < state.rows; row++) {
    const tr = document.createElement('tr');
    tbody.appendChild(tr);
    
    // 데이터 셀 생성
    for (let col = 0; col < state.cols; col++) {
      const td = document.createElement('td');
      tr.appendChild(td);
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'data-cell';
      input.dataset.row = row;
      input.dataset.col = col;
      input.value = state.data[row]?.[col] !== undefined ? state.data[row][col] : '';
      
      input.addEventListener('input', () => {
        updateCellValue(row, col, input.value);
        notifyChange();
      });
      
      td.appendChild(input);
    }
  }
  
  // 컨트롤 버튼 생성
  const controls = document.createElement('div');
  controls.className = 'spreadsheet-controls';
  spreadsheetContainer.appendChild(controls);
  
  // 행 추가 버튼
  const addRowBtn = document.createElement('button');
  addRowBtn.textContent = '행 추가';
  addRowBtn.className = 'btn btn-sm btn-outline-primary';
  addRowBtn.addEventListener('click', addRow);
  controls.appendChild(addRowBtn);
  
  // 열 추가 버튼
  const addColBtn = document.createElement('button');
  addColBtn.textContent = '열 추가';
  addColBtn.className = 'btn btn-sm btn-outline-primary';
  addColBtn.addEventListener('click', addColumn);
  controls.appendChild(addColBtn);
  
  // 데이터 변경 알림 함수
  function notifyChange() {
    if (typeof mergedConfig.onChange === 'function') {
      mergedConfig.onChange({
        data: state.data,
        headers: mergedConfig.headers
      });
    }
  }
  
  // 셀 데이터 업데이트 함수
  function updateCellValue(row, col, value) {
    if (!state.data[row]) {
      state.data[row] = [];
    }
    state.data[row][col] = value;
  }
  
  // 행 추가 함수
  function addRow() {
    const newRow = [];
    for (let col = 0; col < state.cols; col++) {
      newRow.push('');
    }
    state.data.push(newRow);
    state.rows++;
    
    const tr = document.createElement('tr');
    tbody.appendChild(tr);
    
    for (let col = 0; col < state.cols; col++) {
      const td = document.createElement('td');
      tr.appendChild(td);
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'data-cell';
      input.dataset.row = state.rows - 1;
      input.dataset.col = col;
      
      input.addEventListener('input', () => {
        updateCellValue(state.rows - 1, col, input.value);
        notifyChange();
      });
      
      td.appendChild(input);
    }
    
    notifyChange();
  }
  
  // 열 추가 함수
  function addColumn() {
    state.cols++;
    
    // 헤더에 열 추가
    if (mergedConfig.hasHeaders) {
      const headerRow = table.querySelector('thead tr');
      const th = document.createElement('th');
      headerRow.appendChild(th);
      
      const headerInput = document.createElement('input');
      headerInput.type = 'text';
      headerInput.className = 'header-cell';
      headerInput.value = getDefaultColumnName(state.cols - 1);
      mergedConfig.headers.push(headerInput.value);
      
      headerInput.addEventListener('input', () => {
        mergedConfig.headers[state.cols - 1] = headerInput.value;
        notifyChange();
      });
      
      th.appendChild(headerInput);
    }
    
    // 각 행에 새 열 추가
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((tr, rowIndex) => {
      const td = document.createElement('td');
      tr.appendChild(td);
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'data-cell';
      input.dataset.row = rowIndex;
      input.dataset.col = state.cols - 1;
      
      input.addEventListener('input', () => {
        updateCellValue(rowIndex, state.cols - 1, input.value);
        notifyChange();
      });
      
      td.appendChild(input);
      
      // 상태 데이터에도 추가
      if (!state.data[rowIndex]) {
        state.data[rowIndex] = [];
      }
      state.data[rowIndex][state.cols - 1] = '';
    });
    
    notifyChange();
  }
  
  // 기본 열 이름 생성 (A, B, C, ...)
  function getDefaultColumnName(index) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (index < letters.length) {
      return letters[index];
    } else {
      // 26개 이상일 경우 AA, AB, ... 형식으로
      const firstChar = letters[Math.floor(index / letters.length) - 1];
      const secondChar = letters[index % letters.length];
      return firstChar + secondChar;
    }
  }
  
  // CSV 데이터 생성 함수
  function generateCSV() {
    let csv = '';
    
    // 헤더 행 추가
    if (mergedConfig.hasHeaders && mergedConfig.headers.length > 0) {
      csv += mergedConfig.headers.join(',') + '\n';
    }
    
    // 데이터 행 추가
    for (let row = 0; row < state.rows; row++) {
      const rowData = [];
      for (let col = 0; col < state.cols; col++) {
        let cellValue = state.data[row]?.[col] || '';
        // 쉼표가 포함된 경우 큰따옴표로 감싸기
        if (cellValue.includes(',')) {
          cellValue = `"${cellValue}"`;
        }
        rowData.push(cellValue);
      }
      csv += rowData.join(',') + '\n';
    }
    
    return csv;
  }
  
  /**
   * 데이터를 600-700번대 CSV로 변환
   * 이 함수는 기존 CSV 데이터를 덮어쓰지 않고 600-700번대만 업데이트함
   * @returns {string} 생성된 프레임워크 호환 CSV
   */
  function convertToFrameworkCSV() {
    if (!mergedConfig.hasHeaders || mergedConfig.headers.length === 0) {
      throw new Error('헤더가 필요합니다.');
    }
    
    // 기존 데이터 확인
    const csvInput = document.getElementById('csv-input');
    if (!csvInput || !csvInput.value.trim()) {
      throw new Error('기본 인포그래픽 속성(101-500번대)을 먼저 입력해주세요.');
    }
    
    let result = '';
    const currentLines = csvInput.value.trim().split('\n');
    const currentProperties = {};
    
    // 기존 속성 파싱
    currentLines.forEach(line => {
      const firstComma = line.indexOf(',');
      if (firstComma > 0) {
        const id = line.substring(0, firstComma).trim();
        const value = line.substring(firstComma + 1).trim();
        currentProperties[id] = value;
      }
    });
    
    // 기존 500번대까지 속성 유지
    for (const id in currentProperties) {
      if (parseInt(id) < 600) {
        result += `${id},${currentProperties[id]}\n`;
      }
    }
    
    // X축 레이블 (헤더 제외한 첫 번째 열)
    const xLabels = [];
    for (let row = 0; row < state.rows; row++) {
      if (state.data[row]?.[0]) {
        xLabels.push(state.data[row][0]);
      }
    }
    if (xLabels.length > 0) {
      result += `601,${JSON.stringify(xLabels)}\n`;
    }
    
    // Y축 단위 (헤더의 두 번째 열 이후)
    if (mergedConfig.headers.length > 1) {
      result += `602,"${mergedConfig.headers[1]}"\n`;
    }
    
    // 시리즈 레이블 (헤더의 두 번째 열 이후)
    const seriesLabels = [];
    for (let col = 1; col < mergedConfig.headers.length; col++) {
      seriesLabels.push(mergedConfig.headers[col]);
    }
    if (seriesLabels.length > 0) {
      result += `603,${JSON.stringify(seriesLabels)}\n`;
    }
    
    // 데이터 세트 (701~705) - 각 열의 데이터
    for (let col = 1; col < state.cols; col++) {
      const datasetId = 700 + col;
      if (datasetId > 705) break; // 최대 5개 데이터셋까지만
      
      const values = [];
      for (let row = 0; row < state.rows; row++) {
        let value = state.data[row]?.[col] || '';
        // 숫자로 변환 가능한 경우 숫자로 변환
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && value.trim() !== '') {
          value = numValue;
        }
        values.push(value);
      }
      
      result += `${datasetId},${JSON.stringify(values)}\n`;
    }
    
    return result;
  }
  
  // 반환되는 API
  return {
    getState: () => ({ ...state }),
    getData: () => [...state.data],
    getHeaders: () => [...mergedConfig.headers],
    generateCSV,
    convertToFrameworkCSV,
    setData: (newData) => {
      if (Array.isArray(newData)) {
        state.data = [...newData];
        // TODO: UI 업데이트
      }
    }
  };
}
