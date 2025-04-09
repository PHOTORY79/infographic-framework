import React from 'react';
import { Download, FileCode, Copy, Check } from 'lucide-react';
import { downloadSvg, downloadPng } from '../utils/chartUtils';

const ExportPanel = ({ title, type, csvData }) => {
  const [copied, setCopied] = React.useState(false);
  
  // SVG 다운로드 핸들러
  const handleSvgDownload = () => {
    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) return;
    
    const svgElement = chartContainer.querySelector('svg');
    if (!svgElement) {
      alert('SVG 요소를 찾을 수 없습니다.');
      return;
    }
    
    const filename = `${title || 'infographic'}.svg`.replace(/\s+/g, '_');
    downloadSvg(svgElement, title, filename);
  };
  
  // PNG 다운로드 핸들러
  const handlePngDownload = () => {
    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) return;
    
    const svgElement = chartContainer.querySelector('svg');
    if (!svgElement) {
      alert('SVG 요소를 찾을 수 없습니다.');
      return;
    }
    
    const filename = `${title || 'infographic'}.png`.replace(/\s+/g, '_');
    downloadPng(svgElement, title, filename);
  };
  
  // 클립보드에 복사
  const handleCopyAsPng = () => {
    navigator.clipboard.writeText(JSON.stringify(csvData, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('클립보드 복사 실패:', err);
        alert('클립보드 복사 중 오류가 발생했습니다.');
      });
  };
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-gray-50 p-4">
        <h2 className="text-lg font-bold flex items-center">
          <FileCode className="mr-2 text-gray-700" size={20} />
          인포그래픽 내보내기
        </h2>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">
          생성된 인포그래픽을 다양한 형식으로 내보낼 수 있습니다.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleSvgDownload}
            className="flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
          >
            <Download size={18} className="mr-2" />
            SVG 다운로드
          </button>
          
          <button
            onClick={handlePngDownload}
            className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded hover:bg-green-100 transition"
          >
            <Download size={18} className="mr-2" />
            PNG 다운로드
          </button>
          
          <button
            onClick={handleCopyAsPng}
            className={`flex items-center justify-center p-3 rounded transition sm:col-span-2 ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
          >
            {copied ? (
              <>
                <Check size={18} className="mr-2" />
                복사됨
              </>
            ) : (
              <>
                <Copy size={18} className="mr-2" />
                JSON 형식으로 복사
              </>
            )}
          </button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>* SVG는 벡터 형식으로, 크기 조절에 따른 품질 저하가 없습니다.</p>
          <p>* PNG는 래스터 이미지로, 대부분의 프로그램에서 사용 가능합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
