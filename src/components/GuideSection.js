import React from 'react';
import { EXAMPLE_CSV } from '../data/sampleData';

const GuideSection = ({ onInsertExample }) => {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">인포그래픽 프레임워크 가이드</h2>
      <p className="mb-4">인포그래픽 프레임워크는 데이터 시각화와 정보 디자인을 체계적으로 만들기 위한 구조화된 접근 방식입니다.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mt-4 mb-2">최소 필수 속성</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>101</strong>: 시각화 유형 (예: Bar Chart, Process Diagram)</li>
            <li><strong>301</strong>: 레이아웃 (예: Vertical, Grid)</li>
            <li><strong>302</strong>: 색상 스키마 (예: Corporate, Vibrant)</li>
            <li><strong>401</strong>: 제목 (인포그래픽 제목)</li>
            <li><strong>501</strong>: 출력 형식 (예: SVG, PNG)</li>
          </ul>
          
          <h3 className="font-bold mt-4 mb-2">CSV 형식</h3>
          <p className="mb-2">각 행은 3자리 ID와 관련 키워드로 구성됩니다:</p>
          <pre className="bg-gray-100 p-2 rounded mb-4 text-sm">
            101,Bar Chart<br/>
            102,Business Presentation<br/>
            301,Vertical<br/>
            302,Corporate
          </pre>
        </div>
        
        <div>
          <h3 className="font-bold mt-4 mb-2">레이어 구조</h3>
          <ul className="space-y-2">
            <li>
              <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              <strong>메타 레이어 (100번대)</strong>: 전체적인 유형, 목적, 대상
            </li>
            <li>
              <span className="inline-block w-4 h-4 bg-red-500 rounded-full mr-2"></span>
              <strong>데이터 레이어 (200번대)</strong>: 데이터 특성과 구조
            </li>
            <li>
              <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              <strong>디자인 레이어 (300번대)</strong>: 시각적 구성 요소
            </li>
            <li>
              <span className="inline-block w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
              <strong>콘텐츠 레이어 (400번대)</strong>: 텍스트 및 컨텍스트
            </li>
            <li>
              <span className="inline-block w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
              <strong>기술 레이어 (500번대)</strong>: 구현 관련 속성
            </li>
          </ul>
          
          <h3 className="font-bold mt-4 mb-2">예시 템플릿</h3>
          <p className="mb-2">아래 버튼을 클릭하여 미리 정의된 CSV 예시를 이용하세요:</p>
          <div className="flex flex-wrap gap-2">
            <TemplateButton 
              label="막대 차트" 
              onClick={() => onInsertExample(EXAMPLE_CSV.barchart)} 
              color="blue" 
            />
            <TemplateButton 
              label="파이 차트" 
              onClick={() => onInsertExample(EXAMPLE_CSV.piechart)} 
              color="red" 
            />
            <TemplateButton 
              label="선 그래프" 
              onClick={() => onInsertExample(EXAMPLE_CSV.linechart)} 
              color="green" 
            />
            <TemplateButton 
              label="프로세스 다이어그램" 
              onClick={() => onInsertExample(EXAMPLE_CSV.process)} 
              color="purple" 
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 text-blue-700 rounded">
        <p className="font-medium">팁:</p>
        <ul className="list-disc ml-5 mt-1 text-sm">
          <li>레이아웃(301)과 색상 스키마(302)는 시각화 유형에 따라 조화롭게 선택하세요.</li>
          <li>너무 많은 데이터 포인트는 시각적 복잡성을 증가시킬 수 있습니다.</li>
          <li>출력 형식(501)은 사용 목적에 따라 선택하세요. 프레젠테이션에는 SVG가 적합합니다.</li>
        </ul>
      </div>
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

export default GuideSection;
