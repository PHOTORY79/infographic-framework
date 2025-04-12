// 색상 스키마 가져오기
function getColorScheme(colorSchemeKey) {
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

// 스프레드시트 형식 데이터 입력 인터페이스
function initSpreadsheet(container, config = {}) {
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
  
  // 데이터를 600-700번대 CSV로 변환
  function convertToFrameworkCSV() {
    if (!mergedConfig.hasHeaders || mergedConfig.headers.length === 0) {
      throw new Error('헤더가 필요합니다.');
    }
    
    let result = '';
    
    // 기본 인포그래픽 속성 추가
    result += '101,Bar Chart\n';
    result += '102,Data Visualization\n';
    result += '301,Vertical\n';
    result += '302,Corporate\n';
    result += `401,${mergedConfig.headers[0]} 데이터\n`;
    result += '501,SVG\n';
    
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

// 파일 업로드 및 처리 기능
function initFileUpload() {
  const fileUploadInput = document.getElementById('file-upload');
  const uploadPreview = document.getElementById('upload-preview');
  const csvInput = document.getElementById('csv-input');
  
  if (!fileUploadInput) return;
  
  fileUploadInput.addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      uploadPreview.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">로딩 중...</span></div>';
      
      // 파일 확장자 확인
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let fileData;
      
      if (fileExtension === 'csv') {
        // CSV 파일 처리
        fileData = await readCSVFile(file);
        displayCSVPreview(fileData, uploadPreview);
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        // Excel 파일 처리
        fileData = await readExcelFile(file);
        displayExcelPreview(fileData, uploadPreview);
      } else {
        throw new Error('지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일만 업로드해주세요.');
      }
      
    } catch (error) {
      console.error('파일 처리 오류:', error);
      uploadPreview.innerHTML = `<div class="alert alert-danger">오류: ${error.message}</div>`;
    }
  });
  
  // 업로드된 데이터를 CSV로 변환 버튼
  const dataToCSVBtn = document.createElement('button');
  dataToCSVBtn.textContent = 'CSV 입력으로 전송';
  dataToCSVBtn.className = 'btn btn-primary mt-2';
  dataToCSVBtn.style.display = 'none';
  uploadPreview.after(dataToCSVBtn);
  
  dataToCSVBtn.addEventListener('click', function() {
    if (window.uploadedData) {
      csvInput.value = generateFrameworkCSV(window.uploadedData);
      
      // CSV 탭으로 전환
      const csvTab = document.getElementById('csv-tab');
      if (csvTab) {
        const tabInstance = new bootstrap.Tab(csvTab);
        tabInstance.show();
      }
    }
  });
  
  // 전역 변수에 버튼 저장 (표시/숨김을 위해)
  window.dataToCSVBtn = dataToCSVBtn;
}

// CSV 파일 읽기
async function readCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(event) {
      try {
        const csvText = event.target.result;
        const rows = csvText.split(/\r?\n/).filter(row => row.trim());
        
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

// CSV 행 파싱 (쉼표로 구분, 따옴표 처리)
function parseCSVRow(row) {
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

// Excel 파일 읽기
async function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(event) {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // 첫 번째 행은 헤더로 간주
        const headers = jsonData[0] || [];
        const rows = jsonData.slice(1);
        
        resolve({ headers, data: rows });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = function() {
      reject(new Error('Excel 파일을 읽는 중 오류가 발생했습니다.'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// CSV 미리보기 표시
function displayCSVPreview(csvData, container) {
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

// Excel 미리보기 표시 (CSV와 동일하게 처리)
function displayExcelPreview(excelData, container) {
  displayCSVPreview(excelData, container);
}

// 업로드된 데이터를 600-700번대 CSV 형식으로 변환
function generateFrameworkCSV(uploadedData) {
  const { headers, data } = uploadedData;
  
  if (!headers || headers.length === 0 || !data || data.length === 0) {
    return ''; // 데이터가 없으면 빈 문자열 반환
  }
  
  let result = '';
  
  // 기본 인포그래픽 속성 추가
  result += '101,Bar Chart\n';
  result += '102,Data Visualization\n';
  result += '201,Numerical\n';
  result += '202,Comparison\n';
  result += '301,Vertical\n';
  result += '302,Corporate\n';
  result += `401,${headers[0]} 데이터 시각화\n`;
  result += '501,SVG\n';
  
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
  
  // 주요 데이터 세트 (두 번째 열 데이터)
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
    }
  }
  
  return result;
}

// 도움말 문서 열기
function openHelpDocument() {
  window.open(HELP_DOC_URL, '_blank');
}// 프로세스 다이어그램 렌더링 함수
function renderProcessDiagram(container, csvData) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container process-diagram';
  container.appendChild(chartContainer);
  
  const steps = csvData['601'] || [];
  const descriptions = csvData['701'] || [];
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '프로세스 다이어그램';
  
  // SVG 생성
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 400');
  chartContainer.appendChild(svg);
  
  // 타이틀 추가
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', '400');
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('font-size', '20');
  title.setAttribute('font-weight', 'bold');
  title.textContent = chartTitle;
  svg.appendChild(title);
  
  // 프로세스 단계 그리기
  const numSteps = steps.length;
  const isHorizontal = csvData['301'] && csvData['301'].toLowerCase().includes('horizontal');
  
  if (isHorizontal) {
    // 수평 프로세스 다이어그램
    const stepWidth = 120;
    const stepHeight = 80;
    const arrowLength = 40;
    const totalDiagramWidth = numSteps * stepWidth + (numSteps - 1) * arrowLength;
    const startX = (800 - totalDiagramWidth) / 2;
    const startY = 150;
    
    for (let i = 0; i < numSteps; i++) {
      const x = startX + i * (stepWidth + arrowLength);
      const y = startY;
      
      // 단계 박스
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', stepWidth);
      rect.setAttribute('height', stepHeight);
      rect.setAttribute('rx', '5');
      rect.setAttribute('ry', '5');
      rect.setAttribute('fill', colorScheme[i % colorScheme.length]);
      svg.appendChild(rect);
      
      // 단계 제목
      const stepTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      stepTitle.setAttribute('x', x + stepWidth / 2);
      stepTitle.setAttribute('y', y + 25);
      stepTitle.setAttribute('text-anchor', 'middle');
      stepTitle.setAttribute('font-size', '14');
      stepTitle.setAttribute('fill', 'white');
      stepTitle.setAttribute('font-weight', 'bold');
      stepTitle.textContent = steps[i] || `단계 ${i + 1}`;
      svg.appendChild(stepTitle);
      
      // 설명 (있을 경우)
      if (descriptions && descriptions[i]) {
        const desc = descriptions[i].toString();
        const lines = desc.split('\\n');
        
        lines.forEach((line, lineIndex) => {
          const descText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          descText.setAttribute('x', x + stepWidth / 2);
          descText.setAttribute('y', y + 40 + lineIndex * 12);
          descText.setAttribute('text-anchor', 'middle');
          descText.setAttribute('font-size', '10');
          descText.setAttribute('fill', 'white');
          descText.textContent = line;
          svg.appendChild(descText);
        });
      }
      
      // 화살표 (마지막 단계 제외)
      if (i < numSteps - 1) {
        const arrowX = x + stepWidth;
        const arrowY = y + stepHeight / 2;
        
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow.setAttribute('d', `M ${arrowX + 5},${arrowY} L ${arrowX + arrowLength - 5},${arrowY} M ${arrowX + arrowLength - 12},${arrowY - 7} L ${arrowX + arrowLength - 5},${arrowY} L ${arrowX + arrowLength - 12},${arrowY + 7}`);
        arrow.setAttribute('stroke', '#555');
        arrow.setAttribute('stroke-width', '2');
        arrow.setAttribute('fill', 'none');
        svg.appendChild(arrow);
      }
    }
  } else {
    // 수직 프로세스 다이어그램
    const stepWidth = 200;
    const stepHeight = 60;
    const arrowLength = 30;
    const totalDiagramHeight = numSteps * stepHeight + (numSteps - 1) * arrowLength;
    const startX = (800 - stepWidth) / 2;
    const startY = (400 - totalDiagramHeight) / 2;
    
    for (let i = 0; i < numSteps; i++) {
      const x = startX;
      const y = startY + i * (stepHeight + arrowLength);
      
      // 단계 박스
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', stepWidth);
      rect.setAttribute('height', stepHeight);
      rect.setAttribute('rx', '5');
      rect.setAttribute('ry', '5');
      rect.setAttribute('fill', colorScheme[i % colorScheme.length]);
      svg.appendChild(rect);
      
      // 단계 제목
      const stepTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      stepTitle.setAttribute('x', x + stepWidth / 2);
      stepTitle.setAttribute('y', y + 22);
      stepTitle.setAttribute('text-anchor', 'middle');
      stepTitle.setAttribute('font-size', '14');
      stepTitle.setAttribute('fill', 'white');
      stepTitle.setAttribute('font-weight', 'bold');
      stepTitle.textContent = steps[i] || `단계 ${i + 1}`;
      svg.appendChild(stepTitle);
      
      // 설명 (있을 경우)
      if (descriptions && descriptions[i]) {
        const desc = descriptions[i].toString();
        const lines = desc.split('\\n');
        
        lines.forEach((line, lineIndex) => {
          if (lineIndex < 2) { // 최대 2줄까지만 표시
            const descText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            descText.setAttribute('x', x + stepWidth / 2);
            descText.setAttribute('y', y + 40 + lineIndex * 12);
            descText.setAttribute('text-anchor', 'middle');
            descText.setAttribute('font-size', '10');
            descText.setAttribute('fill', 'white');
            descText.textContent = line;
            svg.appendChild(descText);
          }
        });
      }
      
      // 화살표 (마지막 단계 제외)
      if (i < numSteps - 1) {
        const arrowX = x + stepWidth / 2;
        const arrowY = y + stepHeight;
        
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow.setAttribute('d', `M ${arrowX},${arrowY + 5} L ${arrowX},${arrowY + arrowLength - 5} M ${arrowX - 7},${arrowY + arrowLength - 12} L ${arrowX},${arrowY + arrowLength - 5} L ${arrowX + 7},${arrowY + arrowLength - 12}`);
        arrow.setAttribute('stroke', '#555');
        arrow.setAttribute('stroke-width', '2');
        arrow.setAttribute('fill', 'none');
        svg.appendChild(arrow);
      }
    }
  }
}

// 타임라인 렌더링 함수
function renderTimeline(container, csvData) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container timeline';
  container.appendChild(chartContainer);
  
  const events = csvData['601'] || [];
  const descriptions = csvData['702'] || [];
  const titles = csvData['701'] || [];
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '타임라인';
  const isVertical = csvData['301'] && csvData['301'].toLowerCase().includes('vertical');
  
  // SVG 생성
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 500');
  chartContainer.appendChild(svg);
  
  // 타이틀 추가
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', '400');
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('font-size', '20');
  title.setAttribute('font-weight', 'bold');
  title.textContent = chartTitle;
  svg.appendChild(title);
  
  const numEvents = events.length;
  
  if (isVertical) {
    // 수직 타임라인
    const timelineX = 200;
    const startY = 80;
    const endY = 450;
    const timelineLength = endY - startY;
    const eventSpacing = numEvents > 1 ? timelineLength / (numEvents - 1) : timelineLength;
    
    // 타임라인 선
    const mainLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    mainLine.setAttribute('x1', timelineX);
    mainLine.setAttribute('y1', startY);
    mainLine.setAttribute('x2', timelineX);
    mainLine.setAttribute('y2', endY);
    mainLine.setAttribute('stroke', '#ccc');
    mainLine.setAttribute('stroke-width', '4');
    svg.appendChild(mainLine);
    
    // 이벤트 그리기
    for (let i = 0; i < numEvents; i++) {
      const eventY = startY + i * eventSpacing;
      
      // 이벤트 점
      const eventDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      eventDot.setAttribute('cx', timelineX);
      eventDot.setAttribute('cy', eventY);
      eventDot.setAttribute('r', '8');
      eventDot.setAttribute('fill', colorScheme[i % colorScheme.length]);
      svg.appendChild(eventDot);
      
      // 이벤트 날짜/시간 - 더 멀리 배치하여 겹침 방지
      const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      dateText.setAttribute('x', timelineX - 25);
      dateText.setAttribute('y', eventY);
      dateText.setAttribute('text-anchor', 'end');
      dateText.setAttribute('dominant-baseline', 'middle');
      dateText.setAttribute('font-size', '14');
      dateText.textContent = events[i] || `이벤트 ${i + 1}`;
      svg.appendChild(dateText);
      
      // 이벤트 제목 - 오른쪽으로 더 멀리 배치
      const eventTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      eventTitle.setAttribute('x', timelineX + 25);
      eventTitle.setAttribute('y', eventY);
      eventTitle.setAttribute('dominant-baseline', 'middle');
      eventTitle.setAttribute('font-size', '14');
      eventTitle.setAttribute('font-weight', 'bold');
      eventTitle.textContent = titles[i] || '';
      svg.appendChild(eventTitle);
      
      // 이벤트 설명 - 위치 조정하여 겹침 방지
      if (descriptions && descriptions[i]) {
        const descText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        descText.setAttribute('x', timelineX + 25);
        descText.setAttribute('y', eventY + 20);
        descText.setAttribute('font-size', '12');
        
        // 설명이 길면 잘라서 표시
        const maxLength = 40;
        let descContent = descriptions[i].toString();
        if (descContent.length > maxLength) {
          descContent = descContent.substring(0, maxLength) + '...';
        }
        
        descText.textContent = descContent;
        svg.appendChild(descText);
      }
    }
  } else {
    // 수평 타임라인
    const timelineY = 250;
    const startX = 50;
    const endX = 750;
    const timelineLength = endX - startX;
    const eventSpacing = numEvents > 1 ? timelineLength / (numEvents - 1) : timelineLength;
    
    // 타임라인 선
    const mainLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    mainLine.setAttribute('x1', startX);
    mainLine.setAttribute('y1', timelineY);
    mainLine.setAttribute('x2', endX);
    mainLine.setAttribute('y2', timelineY);
    mainLine.setAttribute('stroke', '#ccc');
    mainLine.setAttribute('stroke-width', '4');
    svg.appendChild(mainLine);
    
    // 이벤트 그리기
    for (let i = 0; i < numEvents; i++) {
      const eventX = startX + i * eventSpacing;
      const isEven = i % 2 === 0;
      
      // 홀수/짝수 이벤트 위치 조정하여 겹침 방지
      const textY = isEven ? timelineY - 70 : timelineY + 70;
      const descY = isEven ? timelineY - 50 : timelineY + 90;
      
      // 이벤트 점
      const eventDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      eventDot.setAttribute('cx', eventX);
      eventDot.setAttribute('cy', timelineY);
      eventDot.setAttribute('r', '8');
      eventDot.setAttribute('fill', colorScheme[i % colorScheme.length]);
      svg.appendChild(eventDot);
      
      // 이벤트 날짜/시간
      const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      dateText.setAttribute('x', eventX);
      dateText.setAttribute('y', textY - 20);
      dateText.setAttribute('text-anchor', 'middle');
      dateText.setAttribute('font-size', '12');
      dateText.textContent = events[i] || `이벤트 ${i + 1}`;
      svg.appendChild(dateText);
      
      // 이벤트 제목
      const eventTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      eventTitle.setAttribute('x', eventX);
      eventTitle.setAttribute('y', textY);
      eventTitle.setAttribute('text-anchor', 'middle');
      eventTitle.setAttribute('font-size', '14');
      eventTitle.setAttribute('font-weight', 'bold');
      eventTitle.textContent = titles[i] || '';
      svg.appendChild(eventTitle);
      
      // 이벤트 설명 - 더 짧게 잘라서 표시
      if (descriptions && descriptions[i]) {
        const descText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        descText.setAttribute('x', eventX);
        descText.setAttribute('y', descY);
        descText.setAttribute('text-anchor', 'middle');
        descText.setAttribute('font-size', '12');
        
        // 설명이 길면 잘라서 표시
        const maxLength = 25;
        let descContent = descriptions[i].toString();
        if (descContent.length > maxLength) {
          descContent = descContent.substring(0, maxLength) + '...';
        }
        
        descText.textContent = descContent;
        svg.appendChild(descText);
      }
      
      // 연결선 - 더 뚜렷하게
      const connector = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      connector.setAttribute('x1', eventX);
      connector.setAttribute('y1', timelineY);
      connector.setAttribute('x2', eventX);
      connector.setAttribute('y2', isEven ? timelineY - 40 : timelineY + 40);
      connector.setAttribute('stroke', colorScheme[i % colorScheme.length]);
      connector.setAttribute('stroke-width', '2');
      svg.appendChild(connector);
    }
  }
}

// 비교 차트 렌더링 함수
function renderComparisonChart(container, csvData) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container comparison-chart';
  container.appendChild(chartContainer);
  
  const categories = csvData['601'] || [];
  const datasetA = csvData['701'] || [];
  const datasetB = csvData['702'] || [];
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '비교 차트';
  const seriesLabels = csvData['603'] || ['제품 A', '제품 B'];
  
  // SVG 생성
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 500');
  chartContainer.appendChild(svg);
  
  // 타이틀 추가
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', '400');
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('font-size', '20');
  title.setAttribute('font-weight', 'bold');
  title.textContent = chartTitle;
  svg.appendChild(title);
  
  // 차트 영역 정의
  const margin = { top: 60, right: 60, bottom: 60, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  const barHeight = 30;
  const spaceBetweenGroups = 40;
  const spaceBetweenBars = 10;
  const numCategories = categories.length;
  
  // 최대값 계산
  const maxValue = Math.max(
    ...datasetA.map(val => Number(val) || 0),
    ...datasetB.map(val => Number(val) || 0)
  );
  
  // 차트 그리기
  const centerY = margin.top + height / 2;
  const chartStartY = centerY - (numCategories * (2 * barHeight + spaceBetweenBars) + (numCategories - 1) * spaceBetweenGroups) / 2;
  
  // 중앙 구분선
  const centerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  centerLine.setAttribute('x1', margin.left + width / 2);
  centerLine.setAttribute('y1', margin.top);
  centerLine.setAttribute('x2', margin.left + width / 2);
  centerLine.setAttribute('y2', margin.top + height);
  centerLine.setAttribute('stroke', '#ccc');
  centerLine.setAttribute('stroke-width', '1');
  svg.appendChild(centerLine);
  
  // 범례
  const legendY = margin.top - 20;
  
  // 범례 A
  const legendAtext = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  legendAtext.setAttribute('x', margin.left + width / 4);
  legendAtext.setAttribute('y', legendY);
  legendAtext.setAttribute('text-anchor', 'middle');
  legendAtext.setAttribute('font-size', '14');
  legendAtext.setAttribute('font-weight', 'bold');
  legendAtext.textContent = seriesLabels[0];
  svg.appendChild(legendAtext);
  
  // 범례 B
  const legendBtext = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  legendBtext.setAttribute('x', margin.left + width * 3 / 4);
  legendBtext.setAttribute('y', legendY);
  legendBtext.setAttribute('text-anchor', 'middle');
  legendBtext.setAttribute('font-size', '14');
  legendBtext.setAttribute('font-weight', 'bold');
  legendBtext.textContent = seriesLabels[1];
  svg.appendChild(legendBtext);
  
  // 범주 및 바 그리기
  for (let i = 0; i < numCategories; i++) {
    const groupY = chartStartY + i * (2 * barHeight + spaceBetweenBars + spaceBetweenGroups);
    
    // 범주 레이블
    const categoryLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    categoryLabel.setAttribute('x', margin.left + width / 2);
    categoryLabel.setAttribute('y', groupY + barHeight);
    categoryLabel.setAttribute('text-anchor', 'middle');
    categoryLabel.setAttribute('dominant-baseline', 'middle');
    categoryLabel.setAttribute('font-size', '14');
    categoryLabel.setAttribute('font-weight', 'bold');
    categoryLabel.textContent = categories[i] || `범주 ${i + 1}`;
    svg.appendChild(categoryLabel);
    
    // 첫 번째 데이터셋 바
    const valueA = datasetA[i] || 0;
    const barWidthA = (valueA / maxValue) * (width / 2 - 20);
    
    const barA = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    barA.setAttribute('x', margin.left + width / 2 - barWidthA);
    barA.setAttribute('y', groupY - spaceBetweenBars);
    barA.setAttribute('width', barWidthA);
    barA.setAttribute('height', barHeight);
    barA.setAttribute('fill', colorScheme[0]);
    svg.appendChild(barA);
    
    // 첫 번째 데이터셋 값 레이블
    const labelA = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelA.setAttribute('x', margin.left + width / 2 - barWidthA - 5);
    labelA.setAttribute('y', groupY - spaceBetweenBars + barHeight / 2);
    labelA.setAttribute('text-anchor', 'end');
    labelA.setAttribute('dominant-baseline', 'middle');
    labelA.setAttribute('font-size', '12');
    labelA.textContent = valueA;
    svg.appendChild(labelA);
    
    // 두 번째 데이터셋 바
    const valueB = datasetB[i] || 0;
    const barWidthB = (valueB / maxValue) * (width / 2 - 20);
    
    const barB = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    barB.setAttribute('x', margin.left + width / 2);
    barB.setAttribute('y', groupY - spaceBetweenBars);
    barB.setAttribute('width', barWidthB);
    barB.setAttribute('height', barHeight);
    barB.setAttribute('fill', colorScheme[1]);
    svg.appendChild(barB);
    
    // 두 번째 데이터셋 값 레이블
    const labelB = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelB.setAttribute('x', margin.left + width / 2 + barWidthB + 5);
    labelB.setAttribute('y', groupY - spaceBetweenBars + barHeight / 2);
    labelB.setAttribute('text-anchor', 'start');
    labelB.setAttribute('dominant-baseline', 'middle');
    labelB.setAttribute('font-size', '12');
    labelB.textContent = valueB;
    svg.appendChild(labelB);
  }
}// 레이더 차트 렌더링 함수
function renderRadarChart(container, csvData) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container radar-chart';
  container.appendChild(chartContainer);
  
  const dataLabels = csvData['601'] || [];
  const mainDataset = csvData['701'] || [];
  const secondaryDataset = csvData['702'];
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '레이더 차트';
  const seriesLabels = csvData['603'] || ['시리즈 1', '시리즈 2'];
  const scaleLabels = csvData['606'] || ['0', '1', '2', '3', '4', '5'];
  
  // 최대 척도 계산
  const maxScale = Math.max(
    ...mainDataset,
    ...(Array.isArray(secondaryDataset) ? secondaryDataset : [])
  );
  
  // SVG 생성
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 600');
  chartContainer.appendChild(svg);
  
  // 타이틀 추가
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', '400');
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('font-size', '20');
  title.setAttribute('font-weight', 'bold');
  title.textContent = chartTitle;
  svg.appendChild(title);
  
  // 레이더 차트 중심과 반지름
  const centerX = 400;
  const centerY = 300;
  const radius = 200;
  
  // 각 축 각도 계산
  const numAxes = dataLabels.length;
  const angleStep = (2 * Math.PI) / numAxes;
  
  // 배경 원 및 축 그리기
  const numCircles = 5; // 배경 동심원 수
  
  // 배경 동심원 그리기
  for (let i = 1; i <= numCircles; i++) {
    const circleRadius = (radius * i) / numCircles;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', centerX);
    circle.setAttribute('cy', centerY);
    circle.setAttribute('r', circleRadius);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', '#ddd');
    circle.setAttribute('stroke-width', '1');
    svg.appendChild(circle);
    
    // 척도 레이블
    if (i < numCircles) {
      const scaleValue = Math.round((maxScale * i) / numCircles);
      const scaleLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      scaleLabel.setAttribute('x', centerX);
      scaleLabel.setAttribute('y', centerY - circleRadius - 5);
      scaleLabel.setAttribute('text-anchor', 'middle');
      scaleLabel.setAttribute('font-size', '10');
      scaleLabel.textContent = scaleValue;
      svg.appendChild(scaleLabel);
    }
  }
  
  // 축 그리기
  const axisEndPoints = [];
  
  for (let i = 0; i < numAxes; i++) {
    const angle = i * angleStep - Math.PI / 2; // -90도부터 시작
    const axisX = centerX + radius * Math.cos(angle);
    const axisY = centerY + radius * Math.sin(angle);
    
    // 축 저장
    axisEndPoints.push({ x: axisX, y: axisY, angle: angle });
    
    // 축 선 그리기
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', centerX);
    line.setAttribute('y1', centerY);
    line.setAttribute('x2', axisX);
    line.setAttribute('y2', axisY);
    line.setAttribute('stroke', '#aaa');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
    
    // 축 레이블
    const labelRadius = radius + 20; // 레이블을 축 끝보다 약간 바깥에 배치
    const labelX = centerX + labelRadius * Math.cos(angle);
    const labelY = centerY + labelRadius * Math.sin(angle);
    
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', labelX);
    label.setAttribute('y', labelY);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'middle');
    label.setAttribute('font-size', '12');
    label.textContent = dataLabels[i] || `축 ${i + 1}`;
    svg.appendChild(label);
  }
  
  // 데이터 다각형 그리기 (첫 번째 데이터 세트)
  if (mainDataset.length > 0) {
    drawDataPolygon(mainDataset, colorScheme[0], 0.7, 2);
  }
  
  // 데이터 다각형 그리기 (두 번째 데이터 세트, 있을 경우)
  if (secondaryDataset && Array.isArray(secondaryDataset) && secondaryDataset.length > 0) {
    drawDataPolygon(secondaryDataset, colorScheme[1], 0.7, 2);
  }
  
  // 범례 그리기
  if (secondaryDataset && Array.isArray(secondaryDataset)) {
    const legendX = 650;
    const legendY = 100;
    const legendSpacing = 30;
    
    // 범례 항목 1
    const rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect1.setAttribute('x', legendX);
    rect1.setAttribute('y', legendY);
    rect1.setAttribute('width', 15);
    rect1.setAttribute('height', 15);
    rect1.setAttribute('fill', colorScheme[0]);
    rect1.setAttribute('fill-opacity', '0.7');
    svg.appendChild(rect1);
    
    const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text1.setAttribute('x', legendX + 25);
    text1.setAttribute('y', legendY + 12);
    text1.setAttribute('font-size', '12');
    text1.textContent = seriesLabels[0] || '시리즈 1';
    svg.appendChild(text1);
    
    // 범례 항목 2
    const rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect2.setAttribute('x', legendX);
    rect2.setAttribute('y', legendY + legendSpacing);
    rect2.setAttribute('width', 15);
    rect2.setAttribute('height', 15);
    rect2.setAttribute('fill', colorScheme[1]);
    rect2.setAttribute('fill-opacity', '0.7');
    svg.appendChild(rect2);
    
    const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text2.setAttribute('x', legendX + 25);
    text2.setAttribute('y', legendY + legendSpacing + 12);
    text2.setAttribute('font-size', '12');
    text2.textContent = seriesLabels[1] || '시리즈 2';
    svg.appendChild(text2);
  }
  
  // 데이터 다각형 그리기 함수
  function drawDataPolygon(dataset, color, opacity, strokeWidth) {
    // 데이터 포인트 좌표 계산
    const points = [];
    
    for (let i = 0; i < numAxes; i++) {
      // 해당 축의 값 (기본값 0)
      const value = i < dataset.length ? dataset[i] : 0;
      
      // 최대값 대비 비율로 위치 계산
      const ratio = value / maxScale;
      const limitedRatio = Math.min(ratio, 1); // 1을 초과하지 않게 제한
      
      const angle = axisEndPoints[i].angle;
      const x = centerX + limitedRatio * radius * Math.cos(angle);
      const y = centerY + limitedRatio * radius * Math.sin(angle);
      
      points.push({ x, y });
    }
    
    // 데이터 다각형 그리기
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    pathData += ' Z'; // 경로 닫기
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    polygon.setAttribute('d', pathData);
    polygon.setAttribute('fill', color);
    polygon.setAttribute('fill-opacity', opacity);
    polygon.setAttribute('stroke', color);
    polygon.setAttribute('stroke-width', strokeWidth);
    svg.appendChild(polygon);
    
    // 데이터 포인트 표시
    for (let i = 0; i < points.length; i++) {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', points[i].x);
      dot.setAttribute('cy', points[i].y);
      dot.setAttribute('r', 4);
      dot.setAttribute('fill', color);
      svg.appendChild(dot);
      
      // 값 레이블
      const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueLabel.setAttribute('x', points[i].x);
      valueLabel.setAttribute('y', points[i].y - 10);
      valueLabel.setAttribute('text-anchor', 'middle');
      valueLabel.setAttribute('font-size', '10');
      valueLabel.setAttribute('fill', color);
      valueLabel.textContent = dataset[i];
      svg.appendChild(valueLabel);
    }
  }
}setAttribute('cx', point.x);
      circle.// 인포그래픽 프레임워크 메인 앱 스크립트
// 전역 변수 및 상수
const HELP_DOC_URL = 'https://drive.google.com/file/d/1_mNPzUPtWtQAVRjxBCwEkZkxs3zApJzZ/view?usp=sharing'; // 도움말 문서 URL 설정
let currentInfographicData = null;

// 템플릿 데이터
const templates = {
  'bar-chart': `101,Bar Chart
102,Business Presentation
103,Executives
201,Numerical
202,Comparison
301,Vertical
302,Corporate
401,분기별 매출 실적
402,매 분기 꾸준한 성장세를 보이고 있습니다.
403,Values Only
501,SVG
601,["Q1", "Q2", "Q3", "Q4"]
602,"매출(백만원)"
701,[120, 150, 130, 180]
706,160`,

  'pie-chart': `101,Pie Chart
102,Report
103,Stakeholders
201,Categorical
202,Composition
301,Single Focus
302,Vibrant
401,지역별 매출 비중
403,Percentage
501,SVG
601,["서울", "부산", "인천", "대구", "광주"]
701,[40, 25, 15, 12, 8]`,

  'line-chart': `101,Line Chart
102,Business Presentation
201,Temporal
202,Trend
301,Horizontal
302,Corporate
401,분기별 매출 추이
501,SVG
601,["Q1", "Q2", "Q3", "Q4"]
602,"매출(백만원)"
701,[120, 150, 130, 180]`,

  'radar-chart': `101,Radar Chart
102,Comparison Analysis
202,Comparison
301,Single Focus
302,Brand Colors
401,제품 성능 비교
501,SVG
601,["성능", "가격", "디자인", "내구성", "사용성"]
602,"점수"
603,["제품 A", "제품 B"]
606,["0", "1", "2", "3", "4", "5"]
701,[4, 3, 5, 4, 3]
702,[3, 5, 2, 5, 4]`,

  'process-diagram': `101,Process Diagram
102,Educational
202,Sequential
301,Horizontal
302,Vibrant
304,Flat Icons
305,Arrows
306,Size Variation
401,5단계 제품 개발 프로세스
402,아이디어부터 출시까지의 주요 단계
501,SVG
504,Sequential Reveal
601,["아이디어 발굴", "컨셉 개발", "설계", "테스트", "출시"]
701,["새로운 시장 기회 탐색\\n경쟁사 분석\\n고객 니즈 파악", "제품 컨셉 정의\\n기능 명세\\n시장성 평가", "상세 설계\\n프로토타입 개발\\n생산 계획", "품질 테스트\\n사용자 테스트\\n피드백 수집", "마케팅 캠페인\\n판매 채널 확보\\n고객 지원 준비"]`,

  'comparison-chart': `101,Comparison Chart
102,Marketing
201,Numerical
202,Comparison
301,Split Screen
302,Brand Colors
401,제품 기능 비교
501,SVG
601,["크기", "속도", "성능", "가격", "디자인"]
603,["제품 A", "제품 B"]
701,[8, 6, 9, 5, 8]
702,[5, 9, 7, 7, 6]`,

  'timeline': `101,Timeline
102,Educational
201,Temporal
202,Sequential
301,Horizontal
302,Cool Tones
401,프로젝트 타임라인
501,SVG
601,["1월", "2월", "3월", "4월", "5월"]
602,"진행도"
701,["프로젝트 시작", "요구사항 분석", "디자인 완료", "개발 단계", "출시"]
702,["초기 계획 및 팀 구성", "사용자 요구사항 수집 및 분석", "UI/UX 디자인 완료", "코어 기능 개발", "제품 출시 및 마케팅"]`
};

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
  // 전역 변수로 원본 템플릿 저장
  window.originalTemplates = templates;
  
  // DOM 요소 참조
  const csvInput = document.getElementById('csv-input');
  const generateButton = document.getElementById('generate-button');
  const previewContainer = document.getElementById('preview-container');
  const downloadButton = document.getElementById('download-button');
  const errorContainer = document.getElementById('error-container');
  const templateSelector = document.getElementById('template-selector');
  
  // 이벤트 리스너 설정
  setupEventListeners();
  
  // 패널 토글 기능 설정
  setupPanelToggles();
  
  // 스프레드시트 초기화
  const spreadsheetContainer = document.getElementById('spreadsheet-container');
  if (spreadsheetContainer) {
    window.spreadsheetInstance = initSpreadsheet(spreadsheetContainer, {
      rows: 5,
      cols: 3,
      hasHeaders: true,
      headers: ['카테고리', '값 1', '값 2'],
      onChange: function(data) {
        console.log('스프레드시트 데이터 변경:', data);
      }
    });
  }
  
  // 파일 업로드 기능 초기화
  initFileUpload();
  
  // 템플릿 변경 이벤트 처리
  if (templateSelector) {
    templateSelector.addEventListener('change', function() {
      const selectedTemplate = this.value;
      if (templates[selectedTemplate]) {
        csvInput.value = templates[selectedTemplate];
      }
    });
  }
  
  // 인포그래픽 생성 버튼 클릭 이벤트
  if (generateButton) {
    generateButton.addEventListener('click', function() {
      generateInfographic();
    });
  }
  
  // 다운로드 버튼 클릭 이벤트
  if (downloadButton) {
    downloadButton.addEventListener('click', function() {
      downloadInfographic();
    });
  }
  
  // CSV 파싱 버튼
  const parseCSVBtn = document.getElementById('parseCSVBtn');
  if (parseCSVBtn) {
    parseCSVBtn.addEventListener('click', parseCSVData);
  }
  
  // 차트 유형 및 색상 스키마 선택기 이벤트
  const chartTypeSelector = document.getElementById('chart-type-selector');
  const colorSchemeSelector = document.getElementById('color-scheme-selector');
  
  if (chartTypeSelector) {
    chartTypeSelector.addEventListener('change', function() {
      updateCSVProperty('101', this.value);
    });
  }
  
  if (colorSchemeSelector) {
    colorSchemeSelector.addEventListener('change', function() {
      updateCSVProperty('302', this.value);
    });
  }
  
  // SVG 복사 버튼
  const copySVGButton = document.getElementById('copy-svg-button');
  if (copySVGButton) {
    copySVGButton.addEventListener('click', function() {
      copySVG();
    });
  }
  
  // JSON 복사 버튼
  const copyJSONButton = document.getElementById('copy-json-button');
  if (copyJSONButton) {
    copyJSONButton.addEventListener('click', function() {
      copyJSON();
    });
  }
  
  // 스프레드시트 데이터를 CSV로 변환 버튼
  const spreadsheetToCSVBtn = document.getElementById('spreadsheet-to-csv-btn');
  if (spreadsheetToCSVBtn && window.spreadsheetInstance) {
    spreadsheetToCSVBtn.addEventListener('click', function() {
      const csv = window.spreadsheetInstance.generateCSV();
      
      if (csvInput) {
        csvInput.value = csv;
        
        // CSV 탭으로 전환
        const csvTab = document.getElementById('csv-tab');
        if (csvTab) {
          const tabInstance = new bootstrap.Tab(csvTab);
          tabInstance.show();
        }
      }
    });
  }
  
  // 스프레드시트 데이터를 인포그래픽 데이터로 변환 버튼
  const dataToChartBtn = document.getElementById('data-to-chart-btn');
  if (dataToChartBtn && window.spreadsheetInstance) {
    dataToChartBtn.addEventListener('click', function() {
      try {
        const frameworkCSV = window.spreadsheetInstance.convertToFrameworkCSV();
        
        if (csvInput) {
          csvInput.value = frameworkCSV;
          
          // CSV 탭으로 전환
          const csvTab = document.getElementById('csv-tab');
          if (csvTab) {
            const tabInstance = new bootstrap.Tab(csvTab);
            tabInstance.show();
          }
          
          // 알림 표시
          if (errorContainer) {
            errorContainer.innerHTML = '<div class="alert alert-success">스프레드시트 데이터가 인포그래픽 형식으로 변환되었습니다.</div>';
            
            // 3초 후 알림 숨기기
            setTimeout(() => {
              errorContainer.innerHTML = '';
            }, 3000);
          }
        }
      } catch (error) {
        console.error('데이터 변환 오류:', error);
        
        if (errorContainer) {
          errorContainer.innerHTML = `<div class="alert alert-danger">변환 오류: ${error.message}</div>`;
        }
      }
    });
  }
  
  // 초기 템플릿 설정
  if (csvInput && templateSelector) {
    csvInput.value = templates['bar-chart'];
  }
  
  // 도움말 버튼
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', openHelpDocument);
  }
});

// 이벤트 리스너 설정 함수
function setupEventListeners() {
  // 이 함수는 DOM 로드 시 호출되며, 기본 이벤트 리스너를 설정합니다.
  // 많은 이벤트 리스너는 이미 DOMContentLoaded 이벤트 핸들러에서 설정됐습니다.
}

// 패널 토글 기능 설정
function setupPanelToggles() {
  const panelHeaders = document.querySelectorAll('.panel-header');
  
  panelHeaders.forEach(header => {
    const panelBody = header.nextElementSibling;
    
    header.addEventListener('click', () => {
      header.classList.toggle('collapsed');
      
      if (panelBody.style.maxHeight) {
        panelBody.style.maxHeight = null;
      } else {
        panelBody.style.maxHeight = panelBody.scrollHeight + 'px';
      }
    });
  });
}

// CSV 속성 업데이트 함수
function updateCSVProperty(id, value) {
  const csvInput = document.getElementById('csv-input');
  if (!csvInput) return;
  
  const lines = csvInput.value.trim().split('\n');
  let found = false;
  
  // 속성 ID가 있는지 확인하고 값 업데이트
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    
    if (parts[0] === id) {
      lines[i] = `${id},${value}`;
      found = true;
      break;
    }
  }
  
  // 속성이 없으면 추가
  if (!found) {
    lines.push(`${id},${value}`);
  }
  
  csvInput.value = lines.join('\n');
}

// CSV 데이터 파싱 함수
function parseCSVData() {
  const csvInput = document.getElementById('csv-input');
  const errorContainer = document.getElementById('error-container');
  
  if (!csvInput) return null;
  
  const csvText = csvInput.value.trim();
  
  if (!csvText) {
    if (errorContainer) {
      errorContainer.innerHTML = '<div class="alert alert-warning">CSV 데이터를 입력해주세요.</div>';
    }
    return null;
  }
  
  try {
    // 확장된 CSV 파서 사용
    const result = processCSV(csvText);
    const csvData = result.data;
    
    // 유효성 검사 오류 표시
    if (errorContainer && !result.validation.isValid) {
      errorContainer.innerHTML = '<div class="alert alert-warning">' + 
        result.validation.errors.join('<br>') + '</div>';
    }
    
    // 파싱된 데이터 저장
    currentInfographicData = csvData;
    
    // 데이터 표시
    displayParsedData(csvData);
    
    return csvData;
  } catch (error) {
    console.error('CSV 파싱 중 오류 발생:', error);
    if (errorContainer) {
      errorContainer.innerHTML = `<div class="alert alert-danger">CSV 데이터 파싱 중 오류가 발생했습니다: ${error.message}</div>`;
    }
    return null;
  }
}

// 파싱된 데이터 표시
function displayParsedData(data) {
  if (!data) return;
  
  // 레이어별 데이터 정리
  const metaLayer = {};
  const dataLayer = {};
  const designLayer = {};
  const contentLayer = {};
  const techLayer = {};
  const dataLabelLayer = {}; // 600번대
  const dataValueLayer = {}; // 700번대
  
  Object.keys(data).forEach(id => {
    const value = data[id];
    const firstDigit = id.charAt(0);
    
    switch (firstDigit) {
      case '1':
        metaLayer[id] = value;
        break;
      case '2':
        dataLayer[id] = value;
        break;
      case '3':
        designLayer[id] = value;
        break;
      case '4':
        contentLayer[id] = value;
        break;
      case '5':
        techLayer[id] = value;
        break;
      case '6':
        dataLabelLayer[id] = value;
        break;
      case '7':
        dataValueLayer[id] = value;
        break;
    }
  });
