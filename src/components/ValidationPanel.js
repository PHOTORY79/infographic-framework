import React, { useState } from 'react';
import { AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';

const ValidationPanel = ({ messages }) => {
  const [expanded, setExpanded] = useState(true);
  
  // 메시지 수 계산
  const errorCount = messages.filter(msg => msg.type === 'error').length;
  const warningCount = messages.filter(msg => msg.type === 'warning').length;
  
  // 확장/축소 토글
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // 배경색 설정
  const getBackgroundColor = () => {
    if (errorCount > 0) return 'bg-red-50';
    if (warningCount > 0) return 'bg-yellow-50';
    return 'bg-blue-50';
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm ${errorCount > 0 ? 'border-red-200' : (warningCount > 0 ? 'border-yellow-200' : 'border-blue-200')}`}>
      <div 
        className={`${getBackgroundColor()} p-4 flex justify-between items-center cursor-pointer`}
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          {errorCount > 0 ? (
            <AlertTriangle className="mr-2 text-red-500" size={20} />
          ) : (
            <Info className="mr-2 text-yellow-500" size={20} />
          )}
          <h2 className="text-lg font-bold">
            검증 메시지 
            {(errorCount > 0 || warningCount > 0) && (
              <span className="text-sm font-normal ml-2">
                {errorCount > 0 && <span className="text-red-600">{errorCount}개 오류</span>}
                {errorCount > 0 && warningCount > 0 && ", "}
                {warningCount > 0 && <span className="text-yellow-600">{warningCount}개 경고</span>}
              </span>
            )}
          </h2>
        </div>
        {expanded ? 
          <ChevronUp size={20} /> : 
          <ChevronDown size={20} />
        }
      </div>
      
      {expanded && (
        <div className="p-4">
          <ul className="space-y-3">
            {messages.map((message, index) => (
              <li 
                key={index}
                className={`p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'}`}
              >
                <div className="flex items-start">
                  {message.type === 'error' ? (
                    <AlertTriangle className="mr-2 text-red-500 mt-0.5 flex-shrink-0" size={16} />
                  ) : (
                    <Info className="mr-2 text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
                  )}
                  <div>
                    <p className={`font-medium ${message.type === 'error' ? 'text-red-700' : 'text-yellow-700'}`}>
                      {message.message}
                    </p>
                    {message.details && (
                      <p className="mt-1 text-sm text-gray-600">
                        {message.details}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {messages.length === 0 && (
            <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg">
              <Info className="mr-2" size={16} />
              <p>모든 검증을 통과했습니다. 인포그래픽을 생성할 준비가 되었습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;
