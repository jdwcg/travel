import { useState } from "react";

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState(""); // 업로드 상태 메시지

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("파일을 선택해주세요!");
      return;
    }

    setUploadStatus("업로드 중...");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(
          `업로드 성공! 파일명: ${data.filename}, URL: ${data.path}`
        );
        console.log("업로드 성공 응답:", data);
      } else {
        const errorText = await response.text();
        setUploadStatus(`업로드 실패: ${response.status} - ${errorText}`);
        console.error("업로드 실패 응답:", response.status, errorText);
      }
    } catch (error: any) {
      setUploadStatus(`네트워크 오류: ${error.message}`);
      console.error("업로드 중 네트워크 오류 발생:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && <p>선택된 파일: {selectedFile.name}</p>}
      <button onClick={handleUpload}>파일 업로드</button>
      <p>{uploadStatus}</p>
    </div>
  );
}

export default ImageUploader;
