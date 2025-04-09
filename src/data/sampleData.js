// 다양한 차트 유형에 사용할 샘플 데이터
export const SAMPLE_DATA = {
  // 막대 차트용 데이터
  bar: [
    { name: '1분기', value: 400 },
    { name: '2분기', value: 300 },
    { name: '3분기', value: 200 },
    { name: '4분기', value: 278 }
  ],
  
  // 파이/도넛 차트용 데이터
  pie: [
    { name: '그룹 A', value: 400 },
    { name: '그룹 B', value: 300 },
    { name: '그룹 C', value: 300 },
    { name: '그룹 D', value: 200 }
  ],
  
  // 선 그래프용 데이터
  line: [
    { name: '1월', value: 400 },
    { name: '2월', value: 300 },
    { name: '3월', value: 200 },
    { name: '4월', value: 278 },
    { name: '5월', value: 189 },
    { name: '6월', value: 239 }
  ],
  
  // 영역 차트용 데이터
  area: [
    { name: '1월', value: 400 },
    { name: '2월', value: 300 },
    { name: '3월', value: 200 },
    { name: '4월', value: 278 },
    { name: '5월', value: 189 },
    { name: '6월', value: 239 }
  ],
  
  // 산점도용 데이터
  scatter: [
    { x: 10, y: 30, z: 100, name: '항목 1' },
    { x: 40, y: 50, z: 200, name: '항목 2' },
    { x: 70, y: 20, z: 300, name: '항목 3' },
    { x: 30, y: 80, z: 150, name: '항목 4' },
    { x: 50, y: 60, z: 250, name: '항목 5' }
  ],
  
  // 프로세스 다이어그램용 데이터
  process: [
    { id: '1', name: '계획', description: '목표 설정 및 전략 수립' },
    { id: '2', name: '개발', description: '제품 디자인 및 개발' },
    { id: '3', name: '테스트', description: '품질 검증 및 개선' },
    { id: '4', name: '출시', description: '마케팅 및 배포' },
    { id: '5', name: '유지보수', description: '지속적인 개선 및 지원' }
  ],
  
  // 타임라인용 데이터
  timeline: [
    { date: '2023-01', event: '프로젝트 시작', description: '기획 및 팀 구성' },
    { date: '2023-03', event: '1차 개발', description: '핵심 기능 구현' },
    { date: '2023-06', event: '베타 테스트', description: '사용자 피드백 수집' },
    { date: '2023-09', event: '정식 출시', description: '제품 출시 및 마케팅' },
    { date: '2023-12', event: '기능 업데이트', description: '신규 기능 추가' }
  ],
  
  // 비교 차트용 데이터
  comparison: [
    { category: '특성 A', product1: 80, product2: 60 },
    { category: '특성 B', product1: 65, product2: 75 },
    { category: '특성 C', product1: 50, product2: 85 },
    { category: '특성 D', product1: 90, product2: 40 },
    { category: '특성 E', product1: 70, product2: 70 }
  ],

 // 다중 데이터 시리즈
  multiSeries: [
    { name: '1월', series1: 400, series2: 300, series3: 200 },
    { name: '2월', series1: 300, series2: 250, series3: 220 },
    { name: '3월', series1: 200, series2: 300, series3: 250 },
    { name: '4월', series1: 278, series2: 280, series3: 300 },
    { name: '5월', series1: 189, series2: 220, series3: 270 },
    { name: '6월', series1: 239, series2: 250, series3: 280 }
  ],
  
  // 트리맵용 데이터
  treemap: [
    {
      name: 'A',
      children: [
        { name: 'A1', size: 100 },
        { name: 'A2', size: 60 },
        { name: 'A3', size: 30 }
      ]
    },
    {
      name: 'B',
      children: [
        { name: 'B1', size: 90 },
        { name: 'B2', size: 70 }
      ]
    },
    {
      name: 'C',
      children: [
        { name: 'C1', size: 80 },
        { name: 'C2', size: 50 },
        { name: 'C3', size: 40 }
      ]
    }
  ]
};

// 예시 CSV 데이터
export const EXAMPLE_CSV = {
  barchart: 
`101,Bar Chart
102,Business Presentation
103,Executives
201,Numerical
202,Comparison
301,Vertical
302,Corporate
303,Sans Serif Clean
305,Grid Lines
401,분기별 매출 실적 2024
402,Brief Overview
403,Values Only
405,Internal Company Data
501,SVG
502,Responsive Width`,

  piechart: 
`101,Pie Chart
102,Marketing
201,Categorical
202,Composition
301,Circular
302,Vibrant
303,Bold Headlines
401,시장 점유율 분석
402,Key Insights
501,SVG
505,Presentation Slide`,

  linechart: 
`101,Line Chart
102,Report
201,Numerical
202,Trend
301,Vertical
302,Corporate
305,Grid Lines
401,월별 성장 추이
402,Data Interpretation
501,SVG
505,Dashboard Tile`,

  process: 
`101,Process Diagram
102,Educational
201,Categorical
202,Sequential
301,Horizontal
302,Vibrant
304,Flat Icons
305,Arrows
306,Color Highlighting
401,제품 개발 프로세스
402,Step-by-Step Guide
501,SVG
504,Sequential Reveal`,

  comparison: 
`101,Comparison Chart
102,Marketing
201,Categorical
202,Comparison
301,Split Screen
302,Brand Colors
304,Filled Icons
401,제품 A vs 제품 B 비교
402,Key Differences
501,PNG
505,Social Media`,

  timeline: 
`101,Timeline
102,Project Planning
201,Temporal
202,Sequential
301,Horizontal
302,Cool Tones
304,Minimalist Icons
401,프로젝트 진행 일정
402,Step-by-Step Guide
501,SVG
504,Sequential Reveal`
};