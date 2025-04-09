import React, { useState } from 'react';
import { FileText, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const CsvInputPanel = ({ csvInput, onCSVChange, onSubmit, onCopy, copied, onInsertExample }) => {
  const [expanded, setExpanded] = useState(true);
  
  // 섹션 토글
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div 
        className="bg-blue-50 p-4 flex justify-between items-center cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <FileText className="mr-2 text-blue-500" size={20} />
          <h2 className="text-lg font-bold">CSV 데이터 입력</h2>
        </div>
        {expanded ? 
          <ChevronUp size={20} /> : 
          <ChevronDown size={20} />
        }
      </div>
      
      {expanded && (
        <div className="p-4">
          <div className="mb-2 text-sm text-gray-600">
            <p>3자리 ID와 키워드를 쉼표로 구분하여 입력하세요. 각 항목은 새 줄에 입력합니다.</p>
            <p className="mt-1">예: <code className="bg-gray-100 px-1 py-0.5 rounded">101,Bar Chart</code></p>
          </div>
          
          <textarea
            className="w-full h-64 p-3 border rounded-lg mb-4 font-mono text-sm"
            placeholder="CSV 데이터를 입력하세요 (예: 101,Bar Chart)"
            value={csvInput}
            onChange={(e) => onCSVChange(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center"
              onClick={onSubmit}
            >
              <FileText className="mr-2" size={18} />
              인포그래픽 생성
            </button>
            
            {csvInput && (
              <button 
                className={`px-4 py-2 rounded transition flex items-center ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={onCopy}
              >
                {copied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
                {copied ? '복사됨' : 'CSV 복사'}
              </button>
            )}
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">또는 예시 템플릿을 선택하세요:</p>
            <div className="flex flex-wrap gap-2">
              <TemplateButton 
                label="막대 차트" 
                onClick={() => onInsertExample('barchart')} 
                color="blue" 
              />
              <TemplateButton 
                label="파이 차트" 
                onClick={() => onInsertExample('piechart')} 
                color="red" 
              />
              <TemplateButton 
                label="선 그래프" 
                onClick={() => onInsertExample('linechart')} 
                color="green" 
              />
              <TemplateButton 
                label="프로세스 다이어그램" 
                onClick={() => onInsertExample('process')} 
                color="purple" 
              />
              <TemplateButton 
                label="비교 차트" 
                onClick={() => onInsertExample('comparison')} 
                color="orange" 
              />
              <TemplateButton 
                label="타임라인" 
                onClick={() => onInsertExample('timeline')} 
                color="teal" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 템플릿 버튼 컴포넌트
const TemplateButton = ({ label, onClick, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    red: 'bg-red-100 text-red-800 hover:bg-red-200',
    green: 'bg-green-100 text-green-800 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    teal: 'bg-teal-100 text-teal-800 hover:bg-teal-200'
  };
  
  return (
    <button 
      onClick={onClick} 
      className={`px-3 py-1 rounded transition ${colors[color] || colors.blue}`}
    >
      {label}
    </button>
  );
};

export default CsvInputPanel;
