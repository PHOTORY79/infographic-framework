// 전역 변수 및 상수
const HELP_DOC_URL = 'https://drive.google.com/file/d/1_mNPzUPtWtQAVRjxBCwEkZkxs3zApJzZ/view?usp=sharing'; // 도움말 문서 URL 설정
let currentInfographicData = null;

// 템플릿 데이터
const templates = {
  'bar-chart': `101,Bar Chart
102,Business Presentation
201,Numerical
202,Comparison
301,Vertical
302,Corporate
401,Quarterly Performance
501,SVG`,

  'pie-chart': `101,Pie Chart
102,Marketing
201,Categorical
202,Composition
301,Circular
302,Vibrant
401,Market Share Analysis
501,SVG`,

  'line-chart': `101,Line Chart
102,Business Presentation
201,Temporal
202,Trend
301,Horizontal
302,Corporate
401,Annual Growth Trends
501,SVG`,

  'process-diagram': `101,Process Diagram
102,Educational
201,Categorical
202,Sequential
301,Horizontal
302,Vibrant
304,Flat Icons
401,Product Development Process
501,SVG`,

  'comparison-chart': `101,Comparison Chart
102,Marketing
201,Numerical
202,Comparison
301,Split Screen
302,Brand Colors
401,Product Comparison
501,PNG`,

  'timeline': `101,Timeline
102,Educational
201,Temporal
202,Sequential
301,Horizontal
302,Cool Tones
401,Project Timeline
501,SVG`
};

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  // 이벤트 리스너 설정
  setupEventListeners();
  
  // 패널 토글 기능 설정
  setupPanelToggles();
});

// 이벤트 리스너 설정 함수
function setupEventListeners() {
  // 템플릿 버튼 이벤트
  document.querySelectorAll('.template-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const templateName = btn.dataset.template;
      if (templates[templateName]) {
        document.getElementById('csvData').value = templates[templateName];
        parseCSVData();
      }
    });
  });
  
  // CSV 파싱 버튼
  document.getElementById('parseCSVBtn').addEventListener('click', parseCSVData);
  
  // 인포그래픽 생성 버튼
  document.getElementById('generateBtn').addEventListener('click', generateInfographic);
  
  // 내보내기 버튼들
  document.getElementById('svgExportBtn').addEventListener('click', exportAsSVG);
  document.getElementById('pngExportBtn').addEventListener('click', exportAsPNG);
  document.getElementById('jsonExportBtn').addEventListener('click', exportAsJSON);
  
  // 도움말 버튼
  document.getElementById('helpBtn').addEventListener('click', openHelpDocument);
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

// CSV 데이터 파싱 함수
function parseCSVData() {
  const csvText = document.getElementById('csvData').value.trim();
  
  if (!csvText) {
    alert('CSV 데이터를 입력해주세요.');
    return;
  }
  
  try {
    const lines = csvText.split('\n');
    const parsedData = {};
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const firstComma = trimmedLine.indexOf(',');
        if (firstComma > 0) {
          const id = trimmedLine.substring(0, firstComma).trim();
          const value = trimmedLine.substring(firstComma + 1).trim();
          
          if (id && id.length === 3 && !isNaN(id)) {
            parsedData[id] = value;
          } else {
            console.warn(`유효하지 않은 ID 형식: ${id}`);
          }
        }
      }
    });
    
    // 파싱된 데이터 저장
    currentInfographicData = parsedData;
    
    // 데이터 표시
    displayParsedData(parsedData);
    
    return parsedData;
  } catch (error) {
    console.error('CSV 파싱 중 오류 발생:', error);
    alert('CSV 데이터 파싱 중 오류가 발생했습니다.');
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
    }
  });
  
  // 각 레이어 데이터 표시
  document.getElementById('metaLayerData').textContent = formatLayerData(metaLayer);
  document.getElementById('dataLayerData').textContent = formatLayerData(dataLayer);
  document.getElementById('designLayerData').textContent = formatLayerData(designLayer);
  document.getElementById('contentLayerData').textContent = formatLayerData(contentLayer);
  document.getElementById('techLayerData').textContent = formatLayerData(techLayer);
}

// 레이어 데이터 포맷팅
function formatLayerData(layerData) {
  if (Object.keys(layerData).length === 0) return '데이터가 없습니다.';
  
  return Object.keys(layerData)
    .map(id => `${id}: ${layerData[id]}`)
    .join('\n');
}

// 인포그래픽 생성 함수
function generateInfographic() {
  const data = parseCSVData();
  
  if (!data) return;
  
  // 인포그래픽 유형 확인
  const visualizationType = data['101'] || 'Bar Chart';
  
  // 인포그래픽 생성 (여기서는 예시 데이터 사용)
  let infographicHTML = '';
  
  // 현재는 간단한 예시 데이터만 사용, 실제로는 더 복잡한 로직 필요
  const sampleData = [
    { name: '1분기', 값: 400 },
    { name: '2분기', 값: 300 },
    { name: '3분기', 값: 200 },
    { name: '4분기', 값: 280 }
  ];
  
  // 인포그래픽 유형에 따라 다른 시각화 생성
  switch (visualizationType) {
    case 'Bar Chart':
      infographicHTML = generateBarChart(sampleData, data);
      break;
    case 'Pie Chart':
      infographicHTML = generatePieChart(sampleData, data);
      break;
    case 'Line Chart':
      infographicHTML = generateLineChart(sampleData, data);
      break;
    case 'Process Diagram':
      infographicHTML = generateProcessDiagram(data);
      break;
    case 'Timeline':
      infographicHTML = generateTimeline(data);
      break;
    default:
      infographicHTML = generateBarChart(sampleData, data);
  }
  
  // 인포그래픽 표시
  document.getElementById('infographicPreview').innerHTML = infographicHTML;
  
  // 인포그래픽 세부 정보 표시
  displayInfographicDetails(data);
  
  // 내보내기 버튼 표시
  document.getElementById('exportButtons').style.display = 'flex';
  document.getElementById('previewInfo').style.display = 'block';
}

// 막대 차트 생성
function generateBarChart(data, settings) {
  const title = settings['401'] || '분기별 매출 실적 2024';
  const colorScheme = getColorForScheme(settings['302'] || 'Corporate');
  const layout = settings['301'] || 'Vertical';
  
  return `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h3 style="text-align: center; margin-bottom: 20px;">${title}</h3>
      <svg width="100%" height="400" viewBox="0 0 800 400">
        ${generateBarChartSVG(data, colorScheme, layout)}
      </svg>
    </div>
  `;
}

// 막대 차트 SVG 생성
function generateBarChartSVG(data, colorScheme, layout) {
  const isVertical = layout === 'Vertical';
  const chartWidth = 700;
  const chartHeight = 350;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  
  // 데이터 최댓값
  const maxValue = Math.max(...data.map(d => d.값));
  
  // 스케일 설정
  const barWidth = isVertical ? 
    (chartWidth / data.length) * 0.7 : 
    chartHeight / data.length * 0.7;
  
  let bars = '';
  let xAxis = '';
  let yAxis = '';
  
  if (isVertical) {
    // 수직 막대 차트
    data.forEach((d, i) => {
      const barHeight = (d.값 / maxValue) * chartHeight;
      const x = margin.left + (chartWidth / data.length) * (i + 0.15);
      const y = margin.top + chartHeight - barHeight;
      
      bars += `
        <rect 
          x="${x}" 
          y="${y}" 
          width="${barWidth}" 
          height="${barHeight}" 
          fill="${colorScheme}"
        />
        <text 
          x="${x + barWidth/2}" 
          y="${y - 5}" 
          text-anchor="middle" 
          font-size="12"
        >${d.값}</text>
      `;
      
      xAxis += `
        <text 
          x="${x + barWidth/2}" 
          y="${margin.top + chartHeight + 15}" 
          text-anchor="middle" 
          font-size="12"
        >${d.name}</text>
      `;
    });
    
    // Y축
    for (let i = 0; i <= 4; i++) {
      const value = Math.round(maxValue * i / 4);
      const y = margin.top + chartHeight - (chartHeight * i / 4);
      
      yAxis += `
        <line 
          x1="${margin.left}" 
          y1="${y}" 
          x2="${margin.left + chartWidth}" 
          y2="${y}" 
          stroke="#e5e7eb" 
          stroke-dasharray="2,2"
        />
        <text 
          x="${margin.left - 10}" 
          y="${y + 5}" 
          text-anchor="end" 
          font-size="12"
        >${value}</text>
      `;
    }
  } else {
    // 수평 막대 차트
    data.forEach((d, i) => {
      const barWidth = (d.값 / maxValue) * chartWidth;
      const x = margin.left;
      const y = margin.top + (chartHeight / data.length) * (i + 0.15);
      
      bars += `
        <rect 
          x="${x}" 
          y="${y}" 
          width="${barWidth}" 
          height="${barWidth}" 
          fill="${colorScheme}"
        />
        <text 
          x="${x + barWidth + 5}" 
          y="${y + barWidth/2 + 5}" 
          font-size="12"
        >${d.값}</text>
      `;
      
      yAxis += `
        <text 
          x="${margin.left - 10}" 
          y="${y + barWidth/2 + 5}" 
          text-anchor

    text-anchor="end" 
          font-size="12"
        >${d.name}</text>
      `;
    });
    
    // X축
    for (let i = 0; i <= 4; i++) {
      const value = Math.round(maxValue * i / 4);
      const x = margin.left + (chartWidth * i / 4);
      
      xAxis += `
        <line 
          x1="${x}" 
          y1="${margin.top}" 
          x2="${x}" 
          y2="${margin.top + chartHeight}" 
          stroke="#e5e7eb" 
          stroke-dasharray="2,2"
        />
        <text 
          x="${x}" 
          y="${margin.top + chartHeight + 15}" 
          text-anchor="middle" 
          font-size="12"
        >${value}</text>
      `;
    }
  }
  
  return `
    <g class="chart">
      ${yAxis}
      ${xAxis}
      ${bars}
    </g>
  `;
}

// 파이 차트 생성
function generatePieChart(data, settings) {
  const title = settings['401'] || '분기별 매출 비중';
  const colorScheme = settings['302'] || 'Vibrant';
  
  const colors = getMultipleColors(colorScheme, data.length);
  
  return `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h3 style="text-align: center; margin-bottom: 20px;">${title}</h3>
      <svg width="100%" height="400" viewBox="0 0 800 400">
        ${generatePieChartSVG(data, colors)}
      </svg>
    </div>
  `;
}

// 파이 차트 SVG 생성
function generatePieChartSVG(data, colors) {
  const total = data.reduce((sum, d) => sum + d.값, 0);
  
  const centerX = 400;
  const centerY = 200;
  const radius = 150;
  
  let startAngle = 0;
  let paths = '';
  let labels = '';
  let legend = '';
  
  data.forEach((d, i) => {
    const percentage = d.값 / total;
    const angle = percentage * 2 * Math.PI;
    const endAngle = startAngle + angle;
    
    // 원호 좌표 계산
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    
    // 호가 180도 이상인지 여부
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    
    // 파이 조각 경로
    paths += `
      <path 
        d="M ${centerX},${centerY} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z" 
        fill="${colors[i]}"
        stroke="white"
        stroke-width="1"
      />
    `;
    
    // 레이블 위치 계산 (중심점과 원주 사이의 중간 지점)
    const labelAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);
    
    // 퍼센트 레이블
    labels += `
      <text 
        x="${labelX}" 
        y="${labelY}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        fill="white"
        font-weight="bold"
        font-size="14"
      >${Math.round(percentage * 100)}%</text>
    `;
    
    // 범례
    legend += `
      <g transform="translate(650, ${100 + i * 30})">
        <rect width="15" height="15" fill="${colors[i]}" />
        <text x="25" y="12" font-size="12">${d.name} (${d.값})</text>
      </g>
    `;
    
    startAngle = endAngle;
  });
  
  return `
    <g class="pie-chart">
      ${paths}
      ${labels}
      ${legend}
    </g>
  `;
}

// 선 그래프 생성
function generateLineChart(data, settings) {
  const title = settings['401'] || '분기별 추세 분석';
  const colorScheme = getColorForScheme(settings['302'] || 'Corporate');
  
  return `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h3 style="text-align: center; margin-bottom: 20px;">${title}</h3>
      <svg width="100%" height="400" viewBox="0 0 800 400">
        ${generateLineChartSVG(data, colorScheme)}
      </svg>
    </div>
  `;
}

// 선 그래프 SVG 생성
function generateLineChartSVG(data, color) {
  const chartWidth = 700;
  const chartHeight = 350;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  
  // 데이터 최댓값
  const maxValue = Math.max(...data.map(d => d.값));
  
  // 각 데이터 포인트의 x, y 좌표 계산
  const points = data.map((d, i) => {
    const x = margin.left + (chartWidth / (data.length - 1)) * i;
    const y = margin.top + chartHeight - (d.값 / maxValue) * chartHeight;
    return { x, y, value: d.값, name: d.name };
  });
  
  // 선 경로 생성
  let pathD = `M ${points[0].x},${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x},${points[i].y}`;
  }
  
  let dots = '';
  let labels = '';
  let xAxis = '';
  let yAxis = '';
  
  // 데이터 포인트와 레이블
  points.forEach(p => {
    dots += `
      <circle 
        cx="${p.x}" 
        cy="${p.y}" 
        r="5" 
        fill="${color}" 
        stroke="white" 
        stroke-width="2"
      />
    `;
    
    labels += `
      <text 
        x="${p.x}" 
        y="${p.y - 15}" 
        text-anchor="middle" 
        font-size="12"
      >${p.value}</text>
    `;
    
    xAxis += `
      <text 
        x="${p.x}" 
        y="${margin.top + chartHeight + 15}" 
        text-anchor="middle" 
        font-size="12"
      >${p.name}</text>
    `;
  });
  
  // Y축
  for (let i = 0; i <= 4; i++) {
    const value = Math.round(maxValue * i / 4);
    const y = margin.top + chartHeight - (chartHeight * i / 4);
    
    yAxis += `
      <line 
        x1="${margin.left}" 
        y1="${y}" 
        x2="${margin.left + chartWidth}" 
        y2="${y}" 
        stroke="#e5e7eb" 
        stroke-dasharray="2,2"
      />
      <text 
        x="${margin.left - 10}" 
        y="${y + 5}" 
        text-anchor="end" 
        font-size="12"
      >${value}</text>
    `;
  }
  
  return `
    <g class="line-chart">
      ${yAxis}
      ${xAxis}
      <path 
        d="${pathD}" 
        fill="none" 
        stroke="${color}" 
        stroke-width="3"
      />
      ${dots}
      ${labels}
    </g>
  `;
}

// 프로세스 다이어그램 생성
function generateProcessDiagram(settings) {
  const title = settings['401'] || '프로세스 다이어그램';
  const colorScheme = settings['302'] || 'Vibrant';
  
  const steps = [
    '계획',
    '분석',
    '디자인',
    '개발',
    '테스트',
    '배포'
  ];
  
  const colors = getMultipleColors(colorScheme, steps.length);
  
  return `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h3 style="text-align: center; margin-bottom: 20px;">${title}</h3>
      <div style="display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap;">
        ${steps.map((step, i) => `
          <div style="display: flex; flex-direction: column; align-items: center; margin: 10px;">
            <div style="width: 60px; height: 60px; background-color: ${colors[i]}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
              ${i + 1}
            </div>
            <div style="margin-top: 10px; text-align: center; font-weight: bold;">${step}</div>
          </div>
          ${i < steps.length - 1 ? `
            <div style="display: flex; align-items: center; margin: 10px;">
              <svg width="30" height="20" viewBox="0 0 30 20">
                <path d="M0,10 L25,10 M20,5 L25,10 L20,15" stroke="#888" stroke-width="2" fill="none" />
              </svg>
            </div>
          ` : ''}
        `).join('')}
      </div>
    </div>
  `;
}

// 타임라인 생성
function generateTimeline(settings) {
  const title = settings['401'] || '프로젝트 타임라인';
  const colorScheme = settings['302'] || 'Cool Tones';
  
  const events = [
    { date: '2024년 1월', title: '프로젝트 시작', description: '초기 계획 및 팀 구성' },
    { date: '2024년 3월', title: '디자인 완료', description: '디자인 검토 및 승인' },
    { date: '2024년 5월', title: '개발 단계', description: '코어 기능 개발' },
    { date: '2024년 8월', title: '테스트', description: '품질 보증 및 사용자 테스트' },
    { date: '2024년 10월', title: '출시', description: '제품 출시 및 마케팅' }
  ];
  
  const colors = getMultipleColors(colorScheme, events.length);
  
  return `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h3 style="text-align: center; margin-bottom: 20px;">${title}</h3>
      <div style="position: relative; padding-left: 20px;">
        <div style="position: absolute; left: 10px; top: 0; bottom: 0; width: 4px; background-color: #e5e7eb;"></div>
        ${events.map((event, i) => `
          <div style="position: relative; margin-bottom: 30px; padding-left: 30px;">
            <div style="position: absolute; left: -5px; width: 16px; height: 16px; border-radius: 50%; background-color: ${colors[i]};"></div>
            <div style="color: #6b7280; font-size: 14px;">${event.date}</div>
            <div style="font-weight: bold; font-size: 18px; margin: 5px 0; color: ${colors[i]};">${event.title}</div>
            <div>${event.description}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 인포그래픽 세부 정보 표시
function displayInfographicDetails(data) {
  if (!data) return;
  
  const detailsList = document.getElementById('infographicDetails');
  detailsList.innerHTML = '';
  
  // 시각화 유형
  if (data['101']) {
    const li = document.createElement('li');
    li.textContent = `시각화 유형: ${data['101']}`;
    detailsList.appendChild(li);
  }
  
  // 레이아웃
  if (data['301']) {
    const li = document.createElement('li');
    li.textContent = `레이아웃: ${data['301']}`;
    detailsList.appendChild(li);
  }
  
  // 색상 스키마
  if (data['302']) {
    const li = document.createElement('li');
    li.textContent = `색상 스키마: ${data['302']}`;
    detailsList.appendChild(li);
  }
  
  // 출력 형식
  if (data['501']) {
    const li = document.createElement('li');
    li.textContent = `출력 형식: ${data['501']}`;
    detailsList.appendChild(li);
  }
}

// SVG로 내보내기
function exportAsSVG() {
  const infographicElement = document.getElementById('infographicPreview');
  const svgElement = infographicElement.querySelector('svg');
  
  if (!svgElement) {
    alert('내보낼 SVG가 없습니다.');
    return;
  }
  
  // SVG 문자열 생성
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  // 다운로드 링크 생성
  const a = document.createElement('a');
  a.href = url;
  a.download = 'infographic.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// PNG로 내보내기
function exportAsPNG() {
  const infographicElement = document.getElementById('infographicPreview');
  const svgElement = infographicElement.querySelector('svg');
  
  if (!svgElement) {
    alert('내보낼 이미지가 없습니다.');
    return;
  }
  
  // SVG를 이미지로 변환
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 800;
  canvas.height = 400;
  
  const img = new Image();
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    
    // PNG 다운로드
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'infographic.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

// JSON으로 내보내기
function exportAsJSON() {
  if (!currentInfographicData) {
    alert('내보낼 데이터가 없습니다.');
    return;
  }
  
  const jsonStr = JSON.stringify(currentInfographicData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'infographic_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 도움말 문서 열기
function openHelpDocument() {
  window.open(HELP_DOC_URL, '_blank');
}

// 색상 스키마에 따른 색상 반환
function getColorForScheme(schemeName) {
  const colorSchemes = {
    'Corporate': '#3b82f6',  // 파랑
    'Vibrant': '#8b5cf6',    // 보라
    'Cool Tones': '#0ea5e9', // 하늘
    'Warm Tones': '#f59e0b', // 주황
    'Brand Colors': '#10b981', // 녹색
    'High Contrast': '#ef4444', // 빨강
    'Monochromatic': '#4b5563' // 회색
  };
  
  return colorSchemes[schemeName] || colorSchemes['Corporate'];
}

// 색상 스키마에 따른 여러 색상 반환
function getMultipleColors(schemeName, count) {
  const baseColors = {
    'Corporate': ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
    'Vibrant': ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    'Cool Tones': ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'],
    'Warm Tones': ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
    'Brand Colors': ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
    'High Contrast': ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
    'Monochromatic': ['#111827', '#1f2937', '#374151', '#4b5563', '#6b7280']
  };
  
  const colors = baseColors[schemeName] || baseColors['Corporate'];
  
  // 요청된 색상 수에 맞게 색상 배열 조정
  if (count <= colors.length) {
    return colors.slice(0, count);
  } else {
    // 색상이 부족하면 반복
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  }
}
