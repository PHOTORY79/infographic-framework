/**
 * 파일 업로드 모듈
 * 파일 업로드 및 처리 기능을 포함합니다.
 */

import { readCSVFile, readExcelFile, displayCSVPreview, displayExcelPreview, generateFrameworkCSV } from './csv-parser.js';

/**
 * 파일 업로드 기능 초기화
 */
export function initFileUpload() {
  const fileUploadInput = document.getElementById('file-upload');
  const uploadPreview = document.getElementById('upload-preview');
  const csvInput = document.getElementById('csv-input');
  
  if (!fileUploadInput) {
    console.error('파일 업로드 초기화 오류: file-upload 요소를 찾을 수 없습니다.');
    return;
  }
  
  if (!uploadPreview) {
    console.error('파일 업로드 초기화 오류: upload-preview 요소를 찾을 수 없습니다.');
    return;
  }
  
  fileUploadInput.addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      // 기본 인포그래픽 속성이 있는지 확인
      if (csvInput && !csvInput.value.trim()) {
        uploadPreview.innerHTML = '<div class="alert alert-warning">기본 인포그래픽 속성(101-500번대)을 먼저 입력해주세요.</div>';
        return;
      }
      
      uploadPreview.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">로딩 중...</span></div>';
      
      // 파일 확장자 확인
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let fileData;
      
      if (fileExtension === 'csv') {
        // CSV 파일 처리
        fileData = await readCSVFile(file);
        displayCSVPreview(fileData, uploadPreview);
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        // Excel 파일 처리
        fileData = await readExcelFile(file);
        displayExcelPreview(fileData, uploadPreview);
      } else {
        throw new Error('지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일만 업로드해주세요.');
      }
      
    } catch (error) {
      console.error('파일 처리 오류:', error);
      uploadPreview.innerHTML = `<div class="alert alert-danger">오류: ${error.message}</div>`;
    }
  });
  
  // 업로드된 데이터를 CSV로 변환 버튼
  const dataToCSVBtn = document.createElement('button');
  dataToCSVBtn.textContent = '인포그래픽 데이터로 변환';
  dataToCSVBtn.className = 'btn btn-primary mt-2';
  dataToCSVBtn.style.display = 'none';
  uploadPreview.after(dataToCSVBtn);
  
  dataToCSVBtn.addEventListener('click', function() {
    if (window.uploadedData) {
      try {
        // 기존 데이터 확인
        if (csvInput && !csvInput.value.trim()) {
          uploadPreview.innerHTML = '<div class="alert alert-warning">기본 인포그래픽 속성(101-500번대)을 먼저 입력해주세요.</div>';
          return;
        }
        
        csvInput.value = generateFrameworkCSV(window.uploadedData);
        
        // 파일 업로드 결과 메시지
        uploadPreview.innerHTML += '<div class="alert alert-success mt-2">데이터가 인포그래픽 형식으로 변환되었습니다.</div>';
        
        // CSV 탭으로 전환
        const csvTab = document.getElementById('csv-tab');
        if (csvTab) {
          const tabInstance = new bootstrap.Tab(csvTab);
          tabInstance.show();
        }
      } catch (error) {
        console.error('데이터 변환 오류:', error);
        uploadPreview.innerHTML = `<div class="alert alert-danger">변환 오류: ${error.message}</div>`;
      }
    }
  });
  
  // 전역 변수에 버튼 저장 (표시/숨김을 위해)
  window.dataToCSVBtn = dataToCSVBtn;
}
