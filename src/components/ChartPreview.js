import React from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Image } from 'lucide-react';
import { COLOR_PALETTES } from '../data/colorPalettes';

const ChartPreview = ({ chartType, colorScheme, layout, title, data, ready }) => {
  // 색상 팔레트 가져오기
  const colors = COLOR_PALETTES[colorScheme] || COLOR_PALETTES['Corporate'];
  
  // 차트 렌더링 함수
  const renderChart = () => {
    const lowerType = (chartType || '').toLowerCase();
    
    // 막대 차트
    if (lowerType.includes('bar chart')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data} 
            layout={layout === 'Horizontal' ? 'vertical' : 'horizontal'}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={colors[0]} name="값" />
          </BarChart>
        </ResponsiveContainer>
      );
    } 
    
    // 파이 차트
    else if (lowerType.includes('pie chart')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    } 
    
    // 도넛 차트
    else if (lowerType.includes('donut chart')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    } 
    
    // 선 그래프
    else if (lowerType.includes('line chart')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              activeDot={{ r: 8 }}
              name="값" 
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } 
    
    // 영역 차트
    else if (lowerType.includes('area chart')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="value" 
              fill={colors[0]} 
              stroke={colors[0]} 
              name="값" 
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    } 
    
    // 프로세스 다이어그램 
    else if (lowerType.includes('process') || lowerType.includes('flow')) {
      return (
        <div className="h-64 flex flex-col md:flex-row justify-between items-center gap-4 p-4">
          {data.map((step, index) => (
            <div key={index} className="flex flex-col items-center max-w-xs text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold mb-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              >
                {step.id}
              </div>
              <h3 className="font-bold">{step.name}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
              {index < data.length - 1 && (
                <div className="hidden md:block w-8 h-1 bg-gray-300 rotate-90 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // 그 외 차트 유형에 대한 플레이스홀더
    else {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">
            {chartType ? `${chartType} 미리보기` : '인포그래픽 유형을 선택하세요'}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-purple-50 p-4">
        <h2 className="text-lg font-bold flex items-center">
          <Image className="mr-2 text-purple-500" size={20} />
          인포그래픽 미리보기
        </h2>
      </div>
      
      <div className="p-4">
        {/* 차트 정보 표시 */}
        {ready && (
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">시각화 유형</p>
                <p className="font-medium truncate">{chartType || '미정의'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">색상 스키마</p>
                <p className="font-medium truncate">{colorScheme || '미정의'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">레이아웃</p>
                <p className="font-medium truncate">{layout || '미정의'}</p>
              </div>
            </div>
            
            {/* 색상 팔레트 미리보기 */}
            <div className="mt-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">색상 팔레트</p>
              <div className="flex space-x-1">
                {colors.map((color, i) => (
                  <div 
                    key={i}
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* 차트 컨테이너 */}
        <div className="border rounded-lg p-4 bg-white" id="chart-container">
          {ready ? (
            <div>
              <h3 className="text-center font-bold mb-4">{title || '인포그래픽 제목'}</h3>
              {renderChart()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <p className="text-gray-500">CSV 데이터를 입력하고 "인포그래픽 생성" 버튼을 클릭하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartPreview;
