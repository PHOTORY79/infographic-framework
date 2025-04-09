import React, { useState } from 'react';
import { Layout, ChevronDown, ChevronUp } from 'lucide-react';

const FrameworkDataViewer = ({ data }) => {
  const [expanded, setExpanded] = useState(true);
  
  // 섹션 토글
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // 각 레이어의 설정
  const layerConfig = {
    meta: {
      title: '메타 레이어',
      description: '인포그래픽의 전체적인 목적, 유형, 대상을 정의',
      color: 'border-blue-500 bg-blue-50',
      idColor: 'bg-blue-100'
    },
    data: {
      title: '데이터 레이어',
      description: '인포그래픽에 표현될 데이터의 특성과 구조',
      color: 'border-red-500 bg-red-50',
      idColor: 'bg-red-100'
    },
    design: {
      title: '디자인 레이어',
      description: '인포그래픽의 시각적 구성 요소',
      color: 'border-green-500 bg-green-50',
      idColor: 'bg-green-100'
    },
    content: {
      title: '콘텐츠 레이어',
      description: '인포그래픽에 포함될 텍스트 및 컨텍스트 정보',
      color: 'border-purple-500 bg-purple-50',
      idColor: 'bg-purple-100'
    },
    technical: {
      title: '기술 레이어',
      description: '인포그래픽의 기술적 구현 관련 속성',
      color: 'border-yellow-500 bg-yellow-50',
      idColor: 'bg-yellow-100'
    }
  };
  
  // 속성 ID에 대한 설명
  const getAttributeDescription = (id) => {
    const attributeDescriptions = {
      '101': '시각화 유형 - 인포그래픽의 기본 형태',
      '102': '목적/용도 - 인포그래픽의 사용 목적',
      '103': '대상 청중 - 인포그래픽의 주요 타겟 오디언스',
      '201': '데이터 유형 - 데이터의 기본 유형',
      '202': '데이터 관계 - 데이터 간의 관계 유형',
      '203': '계층 구조 - 데이터의 계층적 관계 표현 방식',
      '204': '규모/범위 - 데이터의 수량 및 범위 특성',
      '205': '데이터 하이라이트 - 강조하고자 하는 데이터 포인트',
      '301': '레이아웃 - 전체적인 배치 구조',
      '302': '색상 스키마 - 주요 색상 팔레트 및 사용법',
      '303': '타이포그래피 - 폰트 스타일 및 텍스트 계층 구조',
      '304': '아이콘/심볼 - 사용할 아이콘 스타일 및 유형',
      '305': '그래픽 요소 - 배경, 테두리, 구분선 등 추가 시각 요소',
      '306': '강조 기법 - 중요 정보 강조를 위한 디자인 기법',
      '401': '제목/소제목 - 메인 타이틀 및 섹션 제목',
      '402': '설명 텍스트 - 주요 설명 및 컨텍스트 제공 텍스트',
      '403': '데이터 레이블 - 데이터 포인트 레이블링 방식',
      '404': '주석/참고 - 추가 정보 및 참고사항',
      '405': '출처/인용 - 데이터 출처 및 인용 정보',
      '501': '출력 형식 - 최종 출력 형식',
      '502': '반응형 설정 - 다양한 화면 크기 대응 방식',
      '503': '상호작용 - 인터랙티브 요소',
      '504': '애니메이션 - 움직임 효과',
      '505': '해상도/크기 - 출력물의 크기 및 해상도 설정'
    };
    
    return attributeDescriptions[id] || '';
  };
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div 
        className="bg-green-50 p-4 flex justify-between items-center cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <Layout className="mr-2 text-green-500" size={20} />
          <h2 className="text-lg font-bold">프레임워크 데이터</h2>
        </div>
        {expanded ? 
          <ChevronUp size={20} /> : 
          <ChevronDown size={20} />
        }
      </div>
      
      {expanded && (
        <div className="p-4">
          <div className="space-y-6">
            {Object.entries(data).map(([layer, layerData]) => {
              if (Object.keys(layerData).length === 0) return null;
              
              const config = layerConfig[layer];
              
              return (
                <div key={layer} className={`border-l-4 pl-4 rounded-r-lg ${config.color}`}>
                  <h3 className="font-bold mb-1">{config.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(layerData).map(([id, value]) => (
                      <div key={id} className="group">
                        <div className="flex">
                          <span className={`font-mono ${config.idColor} px-2 mr-2 rounded-md`} title={getAttributeDescription(id)}>
                            {id}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                        
                        {getAttributeDescription(id) && (
                          <div className="text-xs text-gray-500 mt-1 ml-10 hidden group-hover:block">
                            {getAttributeDescription(id)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          {Object.values(data).every(layer => Object.keys(layer).length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>프레임워크 데이터가 없습니다. CSV 데이터를 입력하고 "인포그래픽 생성" 버튼을 클릭하세요.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FrameworkDataViewer;
