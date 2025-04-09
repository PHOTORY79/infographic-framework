import React, { useState } from 'react';
import { FileText, Image, Download, Copy, Check, Info, AlertTriangle } from 'lucide-react';
import CsvInputPanel from './components/CsvInputPanel';
import FrameworkDataViewer from './components/FrameworkDataViewer';
import ChartPreview from './components/ChartPreview';
import GuideSection from './components/GuideSection';
import ExportPanel from './components/ExportPanel';
import ValidationPanel from './components/ValidationPanel';
import { parseCSV, organizeFrameworkData, validateCSV } from './utils/csvUtils';
import { COLOR_PALETTES } from './data/colorPalettes';
import { prepareChartData } from './utils/chartUtils';
import './App.css';

function App() {
  // 상태 관리
  const [csvInput, setCsvInput] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [frameworkData, setFrameworkData] = useState({});
  const [infographicType, setInfographicType] = useState('');
  const [colorScheme, setColorScheme] = useState('');
  const [layout, setLayout] = useState('');
  const [title, setTitle] = useState('');
  const [chartData, setChartData] = useState([]);
  const [validationMessages, setValidationMessages] = useState([]);
  const [exportReady, setExportReady] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // CSV 입력 처리
  const handleCSVSubmit = () => {
    if (!csvInput.trim()) return;
    
    const parsed = parseCSV(csvInput);
    if (parsed.length > 0) {
      setCsvData(parsed);
      const organized = organizeFrameworkData(parsed);
      setFrameworkData(organized);
      
      // 시각화 타입, 색상 스키마, 레이아웃 설정
      const visualType = parsed.find(item => item.id === '101')?.value || '';
      const colorScheme = parsed.find(item => item.id === '302')?.value || 'Corporate';
      const layout = parsed.find(item => item.id === '301')?.value || 'Vertical';
      const chartTitle = parsed.find(item => item.id === '401')?.value || '인포그래픽 제목';
      
      setInfographicType(visualType);
      setColorScheme(colorScheme in COLOR_PALETTES ? colorScheme : 'Corporate');
      setLayout(layout);
      setTitle(chartTitle);
      
      // 차트 데이터 설정
      setChartData(prepareChartData(visualType));
      
      // 데이터 검증
      const validationResults = validateCSV(parsed);
      setValidationMessages(validationResults);
      
      // 내보내기 준비 상태 설정
      setExportReady(true);
    }
  };

  // CSV 텍스트 핸들러
  const handleCSVChange = (text) => {
    setCsvInput(text);
  };

  // 클립보드에 복사 함수
  const handleCopyCSV = () => {
    navigator.clipboard.writeText(csvInput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 예시 CSV 삽입 핸들러
  const handleInsertExample = (exampleText) => {
    setCsvInput(exampleText);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">인포그래픽 프레임워크</h1>
        <p className="text-gray-600">CSV 데이터를 구조화된 인포그래픽으로 변환하는 도구</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 패널: CSV 입력 및 설정 */}
        <div className="lg:col-span-2 space-y-4">
          {/* CSV 입력 패널 */}
          <CsvInputPanel 
            csvInput={csvInput}
            onCSVChange={handleCSVChange}
            onSubmit={handleCSVSubmit}
            onCopy={handleCopyCSV}
            copied={copied}
            onInsertExample={handleInsertExample}
          />
          
          {/* 검증 메시지 */}
          {validationMessages.length > 0 && (
            <ValidationPanel messages={validationMessages} />
          )}
          
          {/* 프레임워크 데이터 뷰어 */}
          {csvData.length > 0 && (
            <FrameworkDataViewer data={frameworkData} />
          )}
          
          {/* 가이드 섹션 */}
          <GuideSection onInsertExample={handleInsertExample} />
        </div>
        
        {/* 오른쪽 패널: 미리보기 및 내보내기 */}
        <div className="space-y-4">
          {/* 차트 미리보기 */}
          <ChartPreview 
            chartType={infographicType}
            colorScheme={colorScheme}
            layout={layout}
            title={title}
            data={chartData}
            ready={csvData.length > 0}
          />
          
          {/* 내보내기 패널 */}
          {exportReady && (
            <ExportPanel 
              title={title}
              type={infographicType}
              csvData={csvData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
