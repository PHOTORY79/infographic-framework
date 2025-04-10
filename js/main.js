/**
 * 인포그래픽 프레임워크 메인 모듈
 * 애플리케이션의 기본 로직과 이벤트 핸들러를 포함합니다.
 */

import { openHelpDocument } from './utils.js';
import { processCSV } from './csv-parser.js';
import { initSpreadsheet } from './spreadsheet.js';
import { initFileUpload } from './file-upload.js';
import { renderInfographic } from './chart-renderers.js';

// 전역 변수 및 상수
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
  
  // 패널 토글 기능 설정
  setupPanelToggles();
  
  // 스프레드시트 초기화
  const spreadsheetContainer = document.getElementById('spreadsheet-container');
  if (spreadsheetContainer) {
    try {
      window.spreadsheetInstance = initSpreadsheet(spreadsheetContainer, {
        rows: 5,
        cols: 3,
        hasHeaders: true,
        headers: ['카테고리', '값 1', '값 2'],
        onChange: function(data) {
          console.log('스프레드시트 데이터 변경:', data);
        }
      });
      console.log('스프레드시트 초기화 성공');
    } catch (error) {
      console.error('스프레드시트 초기화 오류:', error);
      if (spreadsheetContainer) {
        spreadsheetContainer.innerHTML = `
          <div class="alert alert-danger">
            스프레드시트 초기화 중 오류가 발생했습니다: ${error.message}
          </div>`;
      }
    }
  } else {
    console.error('스프레드시트 컨테이너 요소를 찾을 수 없습니다.');
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
        // 기존 데이터 확인
        if (csvInput && !csvInput.value.trim()) {
          showError('기본 인포그래픽 속성(101-500번대)을 먼저 입력해주세요.');
          return;
        }
        
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
          showSuccess('스프레드시트 데이터가 인포그래픽 형식으로 변환되었습니다.');
        }
      } catch (error) {
        console.error('데이터 변환 오류:', error);
        showError(`변환 오류: ${error.message}`);
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
  
  // CSS 탭에 사용자 가이드 추가
  addUserGuide();
});

/**
 * 패널 토글 기능 설정
 */
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

/**
 * CSV 속성 업데이트
 * @param {string} id - 속성 ID
 * @param {string} value - 속성 값
 */
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

/**
 * CSV 데이터 파싱
 * @returns {Object|null} 파싱된 CSV 데이터 또는 오류 시 null
 */
function parseCSVData() {
  const csvInput = document.getElementById('csv-input');
  const errorContainer = document.getElementById('error-container');
  
  if (!csvInput) return null;
  
  const csvText = csvInput.value.trim();
  
  if (!csvText) {
    showWarning('CSV 데이터를 입력해주세요.');
    return null;
  }
  
  try {
    // 확장된 CSV 파서 사용
    const result = processCSV(csvText);
    const csvData = result.data;
    
    // 유효성 검사 오류 표시
    if (errorContainer && !result.validation.isValid) {
      const warnings = result.validation.errors.join('<br>');
      showWarning(warnings);
    }
    
    // 파싱된 데이터 저장
    currentInfographicData = csvData;
    
    // 데이터 표시
    displayParsedData(csvData);
    
    return csvData;
  } catch (error) {
    console.error('CSV 파싱 중 오류 발생:', error);
    showError(`CSV 데이터 파싱 중 오류가 발생했습니다: ${error.message}`);
    return null;
  }
}

/**
 * 파싱된 데이터 표시
 * @param {Object} data - 파싱된 CSV 데이터
 */
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
  
  // 레이어별 데이터 표시
  displayLayerData('metaLayerData', metaLayer);
  displayLayerData('dataLayerData', dataLayer);
  displayLayerData('designLayerData', designLayer);
  displayLayerData('contentLayerData', contentLayer);
  displayLayerData('techLayerData', techLayer);
  displayLayerData('dataLabelLayerData', dataLabelLayer);
  displayLayerData('dataValueLayerData', dataValueLayer);
  
  // 인포그래픽 정보 표시
  displayInfographicInfo(data);
}

/**
 * 레이어 데이터 표시
 * @param {string} elementId - 데이터를 표시할 요소 ID
 * @param {Object} layerData - 레이어 데이터
 */
function displayLayerData(elementId, layerData) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  if (Object.keys(layerData).length === 0) {
    element.textContent = '데이터가 없습니다.';
    return;
  }
  
  let html = '';
  Object.keys(layerData).sort().forEach(id => {
    const value = layerData[id];
    if (Array.isArray(value)) {
      html += `<div><strong>${id}:</strong> ${JSON.stringify(value)}</div>`;
    } else {
      html += `<div><strong>${id}:</strong> ${value}</div>`;
    }
  });
  
  element.innerHTML = html;
}

/**
 * 인포그래픽 정보 표시
 * @param {Object} data - 파싱된 CSV 데이터
 */
function displayInfographicInfo(data) {
  const infoElement = document.getElementById('previewInfo');
  const detailsElement = document.getElementById('infographicDetails');
  
  if (!infoElement || !detailsElement) return;
  
  infoElement.style.display = 'block';
  
  const visualizationType = data['101'] || '지정되지 않음';
  const purpose = data['102'] || '지정되지 않음';
  const audience = data['103'] || '지정되지 않음';
  const layout = data['301'] || '지정되지 않음';
  const colorScheme = data['302'] || '지정되지 않음';
  const title = data['401'] || '지정되지 않음';
  
  let html = '';
  html += `<li><strong>시각화 유형:</strong> ${visualizationType}</li>`;
  html += `<li><strong>용도:</strong> ${purpose}</li>`;
  if (audience !== '지정되지 않음') {
    html += `<li><strong>대상 청중:</strong> ${audience}</li>`;
  }
  html += `<li><strong>레이아웃:</strong> ${layout}</li>`;
  html += `<li><strong>색상 스키마:</strong> ${colorScheme}</li>`;
  html += `<li><strong>제목:</strong> ${title}</li>`;
  
  detailsElement.innerHTML = html;
}

/**
 * 인포그래픽 생성
 */
function generateInfographic() {
  const previewContainer = document.getElementById('preview-container');
  const downloadButton = document.getElementById('download-button');
  
  if (!previewContainer) return;
  
  const csvData = parseCSVData();
  if (!csvData) return;
  
  try {
    // 컨테이너 내용 초기화 및 인포그래픽 렌더링
    previewContainer.innerHTML = '';
    renderInfographic(previewContainer, csvData);
    
    // 다운로드 버튼 활성화
    if (downloadButton) {
      downloadButton.disabled = false;
    }
    
    // 성공 메시지 표시
    showSuccess('인포그래픽이 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('인포그래픽 생성 오류:', error);
    showError(`인포그래픽 생성 중 오류가 발생했습니다: ${error.message}`);
  }
}

/**
 * 인포그래픽 다운로드
 */
function downloadInfographic() {
  const previewContainer = document.getElementById('preview-container');
  
  if (!previewContainer) return;
  
  const svg = previewContainer.querySelector('svg');
  if (!svg) {
    showWarning('다운로드할 SVG가 없습니다. 먼저 인포그래픽을 생성해주세요.');
    return;
  }
  
  try {
    // SVG를 문자열로 변환
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);
    
    // SVG 네임스페이스 추가
    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    // SVG 선언 추가
    if (!svgString.match(/^<\?xml/)) {
      svgString = '<?xml version="1.0" standalone="no"?>\r\n' + svgString;
    }
    
    // SVG를 Blob으로 변환
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    
    // 다운로드 링크 생성 및 클릭
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentInfographicData['401'] || 'infographic'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('SVG 다운로드 오류:', error);
    showError(`SVG 다운로드 중 오류가 발생했습니다: ${error.message}`);
  }
}

/**
 * SVG 코드 복사
 */
function copySVG() {
  const previewContainer = document.getElementById('preview-container');
  
  if (!previewContainer) return;
  
  const svg = previewContainer.querySelector('svg');
  if (!svg) {
    showWarning('복사할 SVG가 없습니다. 먼저 인포그래픽을 생성해주세요.');
    return;
  }
  
  try {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    
    navigator.clipboard.writeText(svgString).then(() => {
      showSuccess('SVG 코드가 클립보드에 복사되었습니다.');
    });
  } catch (error) {
    console.error('SVG 복사 오류:', error);
    showError(`SVG 복사 중 오류가 발생했습니다: ${error.message}`);
  }
}

/**
 * JSON 데이터 복사
 */
function copyJSON() {
  if (!currentInfographicData) {
    showWarning('복사할 데이터가 없습니다. 먼저 인포그래픽을 생성해주세요.');
    return;
  }
  
  try {
    const jsonString = JSON.stringify(currentInfographicData, null, 2);
    
    navigator.clipboard.writeText(jsonString).then(() => {
      showSuccess('JSON 데이터가 클립보드에 복사되었습니다.');
    });
  } catch (error) {
    console.error('JSON 복사 오류:', error);
    showError(`JSON 복사 중 오류가 발생했습니다: ${error.message}`);
  }
}

/**
 * 성공 메시지 표시
 * @param {string} message - 표시할 메시지
 */
function showSuccess(message) {
  const errorContainer = document.getElementById('error-container');
  if (!errorContainer) return;
  
  errorContainer.innerHTML = `<div class="alert alert-success">${message}</div>`;
  
  // 3초 후 메시지 숨기기
  setTimeout(() => {
    errorContainer.innerHTML = '';
  }, 3000);
}

/**
 * 오류 메시지 표시
 * @param {string} message - 표시할 메시지
 */
function showError(message) {
  const errorContainer = document.getElementById('error-container');
  if (!errorContainer) return;
  
  errorContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}

/**
 * 경고 메시지 표시
 * @param {string} message - 표시할 메시지
 */
function showWarning(message) {
  const errorContainer = document.getElementById('error-container');
  if (!errorContainer) return;
  
  errorContainer.innerHTML = `<div class="alert alert-warning">${message}</div>`;
}

/**
 * 사용자 가이드 추가
 */
function addUserGuide() {
  const csvPanel = document.getElementById('csv-panel');
  if (!csvPanel) return;
  
  const guideElement = document.createElement('div');
  guideElement.className = 'alert alert-info mb-3';
  guideElement.innerHTML = `
    <h5><i class="fas fa-info-circle"></i> 사용 가이드</h5>
    <ol class="mb-0">
      <li><strong>기본 데이터 정의</strong>: CSV 입력 탭에서 기본 데이터(101-500번대) 입력 또는 템플릿 선택</li>
      <li><strong>데이터 추가/업데이트</strong>: 
        <ul>
          <li>스프레드시트 탭에서 데이터를 입력하거나</li>
          <li>파일 업로드 탭에서 CSV/Excel 파일 업로드</li>
        </ul>
      </li>
      <li><strong>인포그래픽 생성</strong>: "인포그래픽 생성" 버튼 클릭</li>
      <li><strong>내보내기</strong>: SVG 다운로드 또는 코드 복사</li>
    </ol>
  `;
  
  // 템플릿 선택기 앞에 삽입
  const toolbarSection = csvPanel.querySelector('.toolbar-section');
  if (toolbarSection) {
    csvPanel.querySelector('.panel-body').insertBefore(guideElement, toolbarSection);
  } else {
    csvPanel.querySelector('.panel-body').appendChild(guideElement);
  }
  
  // 템플릿 섹션 강조
  const templateSection = csvPanel.querySelector('.toolbar-section');
  if (templateSection) {
    templateSection.innerHTML = `
      <div class="card mb-3">
        <div class="card-header bg-light">
          <h5 class="mb-0"><i class="fas fa-magic me-2"></i>인포그래픽 예제</h5>
        </div>
        <div class="card-body">
          <p class="text-muted">예제를 선택한 후 '인포그래픽 생성' 버튼을 클릭하면 샘플을 볼 수 있습니다.</p>
          <select id="template-selector" class="form-select mb-3">
            <option value="bar-chart">막대 차트</option>
            <option value="pie-chart">파이 차트</option>
            <option value="line-chart">선 그래프</option>
            <option value="radar-chart">레이더 차트</option>
            <option value="process-diagram">프로세스 다이어그램</option>
            <option value="comparison-chart">비교 차트</option>
            <option value="timeline">타임라인</option>
          </select>
          
          <div class="row">
            <div class="col-md-6">
              <label for="chart-type-selector" class="form-label">차트 유형:</label>
              <select id="chart-type-selector" class="form-select mb-2">
                <option value="Bar Chart">막대 차트</option>
                <option value="Pie Chart">파이 차트</option>
                <option value="Line Chart">선 그래프</option>
                <option value="Radar Chart">레이더 차트</option>
                <option value="Process Diagram">프로세스 다이어그램</option>
                <option value="Timeline">타임라인</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="color-scheme-selector" class="form-label">색상 스키마:</label>
              <select id="color-scheme-selector" class="form-select mb-2">
                <option value="Corporate">Corporate</option>
                <option value="Vibrant">Vibrant</option>
                <option value="Monochromatic">Monochromatic</option>
                <option value="Cool Tones">Cool Tones</option>
                <option value="Warm Tones">Warm Tones</option>
                <option value="Brand Colors">Brand Colors</option>
                <option value="High Contrast">High Contrast</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 템플릿 선택기 이벤트 리스너 다시 설정
    const templateSelector = document.getElementById('template-selector');
    const csvInput = document.getElementById('csv-input');
    
    if (templateSelector && csvInput) {
      templateSelector.addEventListener('change', function() {
        const selectedTemplate = this.value;
        if (templates[selectedTemplate]) {
          csvInput.value = templates[selectedTemplate];
        }
      });
    }
    
    // 차트 유형 및 색상 스키마 선택기 이벤트 다시 설정
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
  }
  
  // 스프레드시트 패널 업데이트
  const spreadsheetPanel = document.querySelector('#spreadsheet-panel .panel-body');
  if (spreadsheetPanel) {
    const buttons = spreadsheetPanel.querySelector('.d-flex');
    if (buttons) {
      // "일반 CSV로 변환" 버튼 제거
      const csvButton = document.getElementById('spreadsheet-to-csv-btn');
      if (csvButton) {
        csvButton.style.display = 'none';
      }
    }
  }
}
