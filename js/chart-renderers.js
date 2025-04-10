/**
 * 차트 렌더링 모듈
 * 다양한 유형의 차트와 인포그래픽을 렌더링하는 함수들을 포함합니다.
 */

import { getColorScheme } from './utils.js';

/**
 * 인포그래픽 렌더링 (차트 유형에 따라 적절한 함수 호출)
 * @param {HTMLElement} container - 렌더링할 컨테이너
 * @param {Object} csvData - 파싱된 CSV 데이터
 */
export function renderInfographic(container, csvData) {
  if (!container || !csvData) return;
  
  container.innerHTML = ''; // 컨테이너 비우기
  
  // 시각화 타입에 따라 적절한 함수 호출
  const visualizationType = csvData['101'] ? csvData['101'].toLowerCase() : '';
  
  if (visualizationType.includes('bar chart')) {
    renderBarChart(container, csvData);
  } else if (visualizationType.includes('pie chart')) {
    renderPieChart(container, csvData);
  } else if (visualizationType.includes('line chart')) {
    renderLineChart(container, csvData);
  } else if (visualizationType.includes('radar chart')) {
    renderRadarChart(container, csvData);
  } else if (visualizationType.includes('process diagram')) {
    renderProcessDiagram(container, csvData);
  } else if (visualizationType.includes('timeline')) {
    renderTimeline(container, csvData);
  } else if (visualizationType.includes('comparison chart')) {
    renderComparisonChart(container, csvData);
  } else {
    // 지원되지 않는 차트 유형
    container.innerHTML = `
      <div class="text-center text-danger">
        <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
        <h3>지원되지 않는 시각화 유형</h3>
        <p>현재 '${csvData['101'] || '지정되지 않음'}' 유형은 지원되지 않습니다.</p>
      </div>
    `;
/**
 * 비교 차트 렌더링
 * @param {HTMLElement} container - 렌더링할 컨테이너
 * @param {Object} csvData - 파싱된 CSV 데이터
 */
export function renderComparisonChart(container, csvData) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container comparison-chart';
  container.appendChild(chartContainer);
  
  const categories = csvData['601'] || [];
  const datasetA = csvData['701'] || [];
  const datasetB = csvData['702'] || [];
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '비교 차트';
  const seriesLabels = csvData['603'] || ['제품 A', '제품 B'];
  
  // 데이터가 없으면 종료
  if (!categories.length || !datasetA.length || !datasetB.length) {
    chartContainer.innerHTML = '<div class="alert alert-warning">데이터가 부족합니다. 카테고리(601)와 두 개의 데이터셋(701, 702)이 필요합니다.</div>';
    return;
  }
  
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
}

/**
 * 레이더 차트 렌더링
 * @param {HTMLElement} container - 렌더링할 컨테이너
 * @param {Object} csvData - 파싱된 CSV 데이터
 */
export function renderRadarChart(container, csvData) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container radar-chart';
  container.appendChild(chartContainer);
  
  const dataLabels = csvData['601'] || [];
  const mainDataset = csvData['701'] || [];
  const secondaryDataset = csvData['702'];
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '레이더 차트';
  const seriesLabels = csvData['603'] || ['시리즈 1', '시리즈 2'];
  
  // 데이터가 없으면 종료
  if (!dataLabels.length || !mainDataset.length) {
    chartContainer.innerHTML = '<div class="alert alert-warning">데이터가 부족합니다. 축 레이블(601)과 최소 하나의 데이터셋(701)이 필요합니다.</div>';
    return;
  }
  
  // 최대 척도 계산
  const maxScale = Math.max(
    ...mainDataset.map(v => Number(v) || 0),
    ...(Array.isArray(secondaryDataset) ? secondaryDataset.map(v => Number(v) || 0) : [])
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
  
  // 데이터 다각형 그리기 함수
  function drawDataPolygon(dataset, color, opacity, strokeWidth) {
    // 데이터 포인트 좌표 계산
    const points = [];
    
    for (let i = 0; i < numAxes; i++) {
      // 해당 축의 값 (기본값 0)
      const value = i < dataset.length ? Number(dataset[i]) || 0 : 0;
      
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
}

/**
 * 막대 차트 렌더링
 * @param {HTMLElement} container - 렌더링할 컨테이너
 * @param {Object} csvData - 파싱된 CSV 데이터
 */
export function renderBarChart(container, csvData) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container bar-chart';
  container.appendChild(chartContainer);
  
  const xLabels = csvData['601'] || [];
  const datasets = [];
  
  // 데이터셋 수집 (701~705)
  for (let i = 701; i <= 705; i++) {
    if (csvData[i]) {
      datasets.push(csvData[i]);
    }
  }
  
  // 데이터가 없으면 종료
  if (!xLabels.length || !datasets.length) {
    chartContainer.innerHTML = '<div class="alert alert-warning">데이터가 부족합니다. 레이블(601)과 데이터셋(701~705)이 필요합니다.</div>';
    return;
  }
  
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '막대 차트';
  const seriesLabels = csvData['603'] || datasets.map((_, i) => `시리즈 ${i + 1}`);
  const isVertical = !csvData['301'] || csvData['301'].toLowerCase().includes('vertical');
  
  // 데이터 값의 범위 계산
  const allValues = datasets.flat();
  const maxValue = Math.max(...allValues.map(v => Number(v) || 0));
  
  // SVG 생성
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 500');
  chartContainer.appendChild(svg);
  
  // 차트 여백
  const margin = { top: 60, right: 60, bottom: 60, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  // 차트 제목
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', '400');
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('font-size', '20');
  title.setAttribute('font-weight', 'bold');
  title.textContent = chartTitle;
  svg.appendChild(title);
  
  if (isVertical) {
    // 수직 막대 차트 (X축이 카테고리)
    const barWidth = Math.min(50, (width / xLabels.length) * 0.8);
    const groupWidth = barWidth * datasets.length;
    const categorySpacing = width / xLabels.length;
    
    // X축
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top + height);
    xAxis.setAttribute('x2', 800 - margin.right);
    xAxis.setAttribute('y2', margin.top + height);
    xAxis.setAttribute('stroke', '#000');
    xAxis.setAttribute('stroke-width', '1');
    svg.appendChild(xAxis);
    
    // X축 레이블
    xLabels.forEach((label, i) => {
      const x = margin.left + (i + 0.5) * categorySpacing;
      const y = margin.top + height + 20;
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.textContent = label;
      svg.appendChild(text);
    });
    
    // Y축
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + height);
    yAxis.setAttribute('stroke', '#000');
    yAxis.setAttribute('stroke-width', '1');
    svg.appendChild(yAxis);
    
    // Y축 눈금 및 레이블
    const numTicks = 5;
    for (let i = 0; i <= numTicks; i++) {
      const y = margin.top + height - (i / numTicks) * height;
      const value = (i / numTicks) * maxValue;
      
      // 눈금 선
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', margin.left - 5);
      tick.setAttribute('y1', y);
      tick.setAttribute('x2', margin.left);
      tick.setAttribute('y2', y);
      tick.setAttribute('stroke', '#000');
      tick.setAttribute('stroke-width', '1');
      svg.appendChild(tick);
      
      // 눈금 레이블
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', margin.left - 10);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-size', '12');
      text.textContent = value.toFixed(0);
      svg.appendChild(text);
      
      // 그리드 선
      const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      grid.setAttribute('x1', margin.left);
      grid.setAttribute('y1', y);
      grid.setAttribute('x2', 800 - margin.right);
      grid.setAttribute('y2', y);
      grid.setAttribute('stroke', '#eee');
      grid.setAttribute('stroke-width', '1');
      svg.appendChild(grid);
    }
    
    // 범례
    if (datasets.length > 1) {
      const legendX = 800 - margin.right - 150;
      const legendY = margin.top;
      
      seriesLabels.forEach((label, i) => {
        if (i >= datasets.length) return;
        
        const y = legendY + i * 25;
        
        // 범례 색상 박스
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', legendX);
        rect.setAttribute('y', y);
        rect.setAttribute('width', '15');
        rect.setAttribute('height', '15');
        rect.setAttribute('fill', colorScheme[i % colorScheme.length]);
        svg.appendChild(rect);
        
        // 범례 텍스트
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', legendX + 25);
        text.setAttribute('y', y + 12);
        text.setAttribute('font-size', '12');
        text.textContent = label;
        svg.appendChild(text);
      });
    }
    
    // 데이터 세트별 막대 그리기
    datasets.forEach((dataset, datasetIndex) => {
      dataset.forEach((value, i) => {
        if (i >= xLabels.length) return;
        
        const barValue = Number(value) || 0;
        const barHeight = (barValue / maxValue) * height;
        const barX = margin.left + i * categorySpacing + (datasetIndex - datasets.length / 2 + 0.5) * barWidth;
        const barY = margin.top + height - barHeight;
        
        // 막대
        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bar.setAttribute('x', barX);
        bar.setAttribute('y', barY);
        bar.setAttribute('width', barWidth);
        bar.setAttribute('height', barHeight);
        bar.setAttribute('fill', colorScheme[datasetIndex % colorScheme.length]);
        svg.appendChild(bar);
        
        // 값 레이블
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', barX + barWidth / 2);
        text.setAttribute('y', barY - 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12');
        text.textContent = barValue;
        svg.appendChild(text);
      });
    });
  } else {
    // 수평 막대 차트 (Y축이 카테고리)
    const barHeight = Math.min(40, (height / xLabels.length) * 0.8);
    const groupHeight = barHeight * datasets.length;
    const categorySpacing = height / xLabels.length;
    
    // X축
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top + height);
    xAxis.setAttribute('x2', 800 - margin.right);
    xAxis.setAttribute('y2', margin.top + height);
    xAxis.setAttribute('stroke', '#000');
    xAxis.setAttribute('stroke-width', '1');
    svg.appendChild(xAxis);
    
    // X축 눈금 및 레이블
    const numTicks = 5;
    for (let i = 0; i <= numTicks; i++) {
      const x = margin.left + (i / numTicks) * width;
      const value = (i / numTicks) * maxValue;
      
      // 눈금 선
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', x);
      tick.setAttribute('y1', margin.top + height);
      tick.setAttribute('x2', x);
      tick.setAttribute('y2', margin.top + height + 5);
      tick.setAttribute('stroke', '#000');
      tick.setAttribute('stroke-width', '1');
      svg.appendChild(tick);
      
      // 눈금 레이블
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', margin.top + height + 20);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.textContent = value.toFixed(0);
      svg.appendChild(text);
      
      // 그리드 선
      const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      grid.setAttribute('x1', x);
      grid.setAttribute('y1', margin.top);
      grid.setAttribute('x2', x);
      grid.setAttribute('y2', margin.top + height);
      grid.setAttribute('stroke', '#eee');
      grid.setAttribute('stroke-width', '1');
      svg.appendChild(grid);
    }
    
    // Y축
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + height);
    yAxis.setAttribute('stroke', '#000');
    yAxis.setAttribute('stroke-width', '1');
    svg.appendChild(yAxis);
    
    // Y축 레이블
    xLabels.forEach((label, i) => {
      const y = margin.top + (i + 0.5) * categorySpacing;
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', margin.left - 10);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-size', '12');
      text.textContent = label;
      svg.appendChild(text);
    });
    
    // 범례
    if (datasets.length > 1) {
      const legendX = margin.left + 100;
      const legendY = margin.top - 30;
      
      seriesLabels.forEach((label, i) => {
        if (i >= datasets.length) return;
        
        const x = legendX + i * 120;
        
        // 범례 색상 박스
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', legendY);
        rect.setAttribute('width', '15');
        rect.setAttribute('height', '15');
        rect.setAttribute('fill', colorScheme[i % colorScheme.length]);
        svg.appendChild(rect);
        
        // 범례 텍스트
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + 25);
        text.setAttribute('y', legendY + 12);
        text.setAttribute('font-size', '12');
        text.textContent = label;
        svg.appendChild(text);
      });
    }
    
    // 데이터 세트별 막대 그리기
    datasets.forEach((dataset, datasetIndex) => {
      dataset.forEach((value, i) => {
        if (i >= xLabels.length) return;
        
        const barValue = Number(value) || 0;
        const barWidth = (barValue / maxValue) * width;
        const barX = margin.left;
        const barY = margin.top + i * categorySpacing + (datasetIndex - datasets.length / 2 + 0.5) * barHeight;
        
        // 막대
        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bar.setAttribute('x', barX);
        bar.setAttribute('y', barY);
        bar.setAttribute('width', barWidth);
        bar.setAttribute('height', barHeight);
        bar.setAttribute('fill', colorScheme[datasetIndex % colorScheme.length]);
        svg.appendChild(bar);
        
        // 값 레이블
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', barX + barWidth + 5);
        text.setAttribute('y', barY + barHeight / 2);
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', '12');
        text.textContent = barValue;
        svg.appendChild(text);
      });
    });
  }
}

/**
 * 파이 차트 렌더링
 * @param {HTMLElement} container - 렌더링할 컨테이너
 * @param {Object} csvData - 파싱된 CSV 데이터
 */
export function renderPieChart(container, csvData) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container pie-chart';
  container.appendChild(chartContainer);
  
  const labels = csvData['601'] || [];
  const values = csvData['701'] || [];
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '파이 차트';
  
  // 데이터가 없으면 종료
  if (!labels.length || !values.length) {
    chartContainer.innerHTML = '<div class="alert alert-warning">데이터가 부족합니다. 레이블(601)과 데이터셋(701)이 필요합니다.</div>';
    return;
  }
  
  // SVG 생성
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 500');
  chartContainer.appendChild(svg);
  
  // 차트 제목
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', '400');
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('font-size', '20');
  title.setAttribute('font-weight', 'bold');
  title.textContent = chartTitle;
  svg.appendChild(title);
  
  // 차트 크기와 위치
  const radius = 150;
  const centerX = 300;
  const centerY = 250;
  
  // 원형 차트 생성
  const total = values.reduce((sum, value) => sum + (Number(value) || 0), 0);
  let startAngle = 0;
  
  values.forEach((value, i) => {
    const numValue = Number(value) || 0;
    if (numValue <= 0) return;
    
    const percentage = (numValue / total) * 100;
    const angle = (numValue / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    
    // 원형 차트 조각 그리기
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    const slice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    slice.setAttribute('d', `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`);
    slice.setAttribute('fill', colorScheme[i % colorScheme.length]);
    svg.appendChild(slice);
    
    // 레이블 위치 계산 (조각 중앙)
    const labelAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);
    
    // 퍼센트 레이블
    const percentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    percentText.setAttribute('x', labelX);
    percentText.setAttribute('y', labelY);
    percentText.setAttribute('text-anchor', 'middle');
    percentText.setAttribute('dominant-baseline', 'middle');
    percentText.setAttribute('fill', 'white');
    percentText.setAttribute('font-size', '14');
    percentText.setAttribute('font-weight', 'bold');
    percentText.textContent = `${percentage.toFixed(1)}%`;
    svg.appendChild(percentText);
    
    startAngle = endAngle;
  });
  
  // 범례
  const legendX = 500;
  const legendY = 100;
  
  labels.forEach((label, i) => {
    if (i >= values.length) return;
    
    const numValue = Number(values[i]) || 0;
    if (numValue <= 0) return;
    
    const percentage = (numValue / total) * 100;
    const y = legendY + i * 30;
    
    // 범례 색상 상자
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', legendX);
    rect.setAttribute('y', y);
    rect.setAttribute('width', '15');
    rect.setAttribute('height', '15');
    rect.setAttribute('fill', colorScheme[i % colorScheme.length]);
    svg.appendChild(rect);
    
    // 범례 레이블
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', legendX + 25);
    text.setAttribute('y', y + 12);
    text.setAttribute('font-size', '12');
    text.textContent = `${label}: ${numValue} (${percentage.toFixed(1)}%)`;
    svg.appendChild(text);
  });
}

/**
 * 선 그래프 렌더링
 * @param {HTMLElement} container - 렌더링할 컨테이너
 * @param {Object} csvData - 파싱된 CSV 데이터
 */
export function renderLineChart(container, csvData) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container line-chart';
  container.appendChild(chartContainer);
  
  const xLabels = csvData['601'] || [];
  const datasets = [];
  
  // 데이터셋 수집 (701~705)
  for (let i = 701; i <= 705; i++) {
    if (csvData[i]) {
      datasets.push(csvData[i]);
    }
  }
  
  // 데이터가 없으면 종료
  if (!xLabels.length || !datasets.length) {
    chartContainer.innerHTML = '<div class="alert alert-warning">데이터가 부족합니다. 레이블(601)과 데이터셋(701~705)이 필요합니다.</div>';
    return;
  }
  
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '선 그래프';
  const seriesLabels = csvData['603'] || datasets.map((_, i) => `시리즈 ${i + 1}`);
  
  // 데이터 값의 범위 계산
  const allValues = datasets.flat();
  const maxValue = Math.max(...allValues.map(v => Number(v) || 0));
  const minValue = Math.min(...allValues.map(v => Number(v) || 0));
  const valueRange = maxValue - minValue;
  
  // SVG 생성
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 500');
  chartContainer.appendChild(svg);
  
  // 차트 여백
  const margin = { top: 60, right: 60, bottom: 60, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  // 차트 제목
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', '400');
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('font-size', '20');
  title.setAttribute('font-weight', 'bold');
  title.textContent = chartTitle;
  svg.appendChild(title);
  
  // X축
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', margin.left);
  xAxis.setAttribute('y1', margin.top + height);
  xAxis.setAttribute('x2', 800 - margin.right);
  xAxis.setAttribute('y2', margin.top + height);
  xAxis.setAttribute('stroke', '#000');
  xAxis.setAttribute('stroke-width', '1');
  svg.appendChild(xAxis);
  
  // X축 레이블
  xLabels.forEach((label, i) => {
    const x = margin.left + (i / (xLabels.length - 1)) * width;
    const y = margin.top + height + 20;
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.textContent = label;
    svg.appendChild(text);
    
    // X축 눈금
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', x);
    tick.setAttribute('y1', margin.top + height);
    tick.setAttribute('x2', x);
    tick.setAttribute('y2', margin.top + height + 5);
    tick.setAttribute('stroke', '#000');
    tick.setAttribute('stroke-width', '1');
    svg.appendChild(tick);
  });
  
  // Y축
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', margin.left);
  yAxis.setAttribute('y1', margin.top);
  yAxis.setAttribute('x2', margin.left);
  yAxis.setAttribute('y2', margin.top + height);
  yAxis.setAttribute('stroke', '#000');
  yAxis.setAttribute('stroke-width', '1');
  svg.appendChild(yAxis);
  
  // Y축 눈금 및 레이블
  const numTicks = 5;
  for (let i = 0; i <= numTicks; i++) {
    const y = margin.top + height - (i / numTicks) * height;
    const value = minValue + (i / numTicks) * valueRange;
    
    // 눈금 선
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', margin.left - 5);
    tick.setAttribute('y1', y);
    tick.setAttribute('x2', margin.left);
    tick.setAttribute('y2', y);
    tick.setAttribute('stroke', '#000');
    tick.setAttribute('stroke-width', '1');
    svg.appendChild(tick);
    
    // 눈금 레이블
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', margin.left - 10);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '12');
    text.textContent = value.toFixed(0);
    svg.appendChild(text);
    
    // 그리드 선
    const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    grid.setAttribute('x1', margin.left);
    grid.setAttribute('y1', y);
    grid.setAttribute('x2', 800 - margin.right);
    grid.setAttribute('y2', y);
    grid.setAttribute('stroke', '#eee');
    grid.setAttribute('stroke-width', '1');
    svg.appendChild(grid);
  }
  
  // 범례
  if (datasets.length > 1) {
    const legendX = 800 - margin.right - 150;
    const legendY = margin.top;
    
    seriesLabels.forEach((label, i) => {
      if (i >= datasets.length) return;
      
      const y = legendY + i * 25;
      
      // 범례 색상 박스
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', legendX);
      rect.setAttribute('y', y);
      rect.setAttribute('width', '15');
      rect.setAttribute('height', '3');
      rect.setAttribute('fill', colorScheme[i % colorScheme.length]);
      svg.appendChild(rect);
      
      // 범례 텍스트
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', legendX + 25);
      text.setAttribute('y', y + 5);
      text.setAttribute('font-size', '12');
      text.textContent = label;
      svg.appendChild(text);
    });
  }
  
  // 데이터셋별 선 그리기
  datasets.forEach((dataset, datasetIndex) => {
    // 경로 데이터 생성
    let pathData = '';
    
    dataset.forEach((value, i) => {
      if (i >= xLabels.length) return;
      
      const x = margin.left + (i / (xLabels.length - 1)) * width;
      const normalizedValue = (Number(value) - minValue) / valueRange;
      const y = margin.top + height - normalizedValue * height;
      
      if (i === 0) {
        pathData += `M ${x},${y}`;
      } else {
        pathData += ` L ${x},${y}`;
      }
    });
    
    // 선 그리기
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', colorScheme[datasetIndex % colorScheme.length]);
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);
    
    // 데이터 포인트 그리기
    dataset.forEach((value, i) => {
      if (i >= xLabels.length) return;
      
      const x = margin.left + (i / (xLabels.length - 1)) * width;
      const normalizedValue = (Number(value) - minValue) / valueRange;
      const y = margin.top + height - normalizedValue * height;
      
      // 데이터 포인트 원
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', colorScheme[datasetIndex % colorScheme.length]);
      svg.appendChild(circle);
      
      // 데이터 값 레이블
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y - 10);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '10');
      text.textContent = value;
      svg.appendChild(text);
    });
  });
}

/**
 * 프로세스 다이어그램 렌더링
 * @param {HTMLElement} container - 렌더링할 컨테이너
 * @param {Object} csvData - 파싱된 CSV 데이터
 */
export function renderProcessDiagram(container, csvData) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container process-diagram';
  container.appendChild(chartContainer);
  
  const steps = csvData['601'] || [];
  const descriptions = csvData['701'] || [];
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '프로세스 다이어그램';
  
  // 데이터가 없으면 종료
  if (!steps.length) {
    chartContainer.innerHTML = '<div class="alert alert-warning">데이터가 부족합니다. 단계(601)가 필요합니다.</div>';
    return;
  }
  
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

/**
 * 타임라인 렌더링
 * @param {HTMLElement} container - 렌더링할 컨테이너
 * @param {Object} csvData - 파싱된 CSV 데이터
 */
/**
 * 비교 차트 렌더링
 * @param {HTMLElement} container - 렌더링할 컨테이너
 * @param {Object} csvData - 파싱된 CSV 데이터
 */
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container timeline';
  container.appendChild(chartContainer);
  
  const events = csvData['601'] || [];
  const descriptions = csvData['702'] || [];
  const titles = csvData['701'] || [];
  const colorScheme = getColorScheme(csvData['302']);
  const chartTitle = csvData['401'] || '타임라인';
  const isVertical = csvData['301'] && csvData['301'].toLowerCase().includes('vertical');
  
  // 데이터가 없으면 종료
  if (!events.length) {
    chartContainer.innerHTML = '<div class="alert alert-warning">데이터가 부족합니다. 이벤트(601)가 필요합니다.</div>';
    return;
  }
  
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
    const eventSpacing = timelineLength / (numEvents - 1 || 1);
    
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
      
      // 이벤트 날짜/시간
      const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      dateText.setAttribute('x', timelineX - 20);
      dateText.setAttribute('y', eventY);
      dateText.setAttribute('text-anchor', 'end');
      dateText.setAttribute('dominant-baseline', 'middle');
      dateText.setAttribute('font-size', '14');
      dateText.textContent = events[i] || `이벤트 ${i + 1}`;
      svg.appendChild(dateText);
      
      // 이벤트 제목
      const eventTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      eventTitle.setAttribute('x', timelineX + 20);
      eventTitle.setAttribute('y', eventY);
      eventTitle.setAttribute('dominant-baseline', 'middle');
      eventTitle.setAttribute('font-size', '14');
      eventTitle.setAttribute('font-weight', 'bold');
      eventTitle.textContent = titles[i] || '';
      svg.appendChild(eventTitle);
      
      // 이벤트 설명
      if (descriptions && descriptions[i]) {
        const descText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        descText.setAttribute('x', timelineX + 20);
        descText.setAttribute('y', eventY + 20);
        descText.setAttribute('font-size', '12');
        descText.textContent = descriptions[i];
        svg.appendChild(descText);
      }
    }
  } else {
    // 수평 타임라인
    const timelineY = 250;
    const startX = 50;
    const endX = 750;
    const timelineLength = endX - startX;
    const eventSpacing = timelineLength / (numEvents - 1 || 1);
    
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
      const textY = isEven ? timelineY - 50 : timelineY + 50;
      const descY = isEven ? timelineY - 30 : timelineY + 70;
      
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
      
      // 이벤트 설명
      if (descriptions && descriptions[i]) {
        const descText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        descText.setAttribute('x', eventX);
        descText.setAttribute('y', descY);
        descText.setAttribute('text-anchor', 'middle');
        descText.setAttribute('font-size', '12');
        descText.textContent = descriptions[i];
        svg.appendChild(descText);
      }
      
      // 연결선
      const connector = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      connector.setAttribute('x1', eventX);
      connector.setAttribute('y1', timelineY);
      connector.setAttribute('x2', eventX);
      connector.setAttribute('y2', isEven ? timelineY - 30 : timelineY + 30);
      connector.setAttribute('stroke', colorScheme[i % colorScheme.length]);
      connector.setAttribute('stroke-width', '2');
      svg.appendChild(connector);
    }
  }
}
