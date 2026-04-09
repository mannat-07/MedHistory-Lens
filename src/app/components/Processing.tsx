import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { FileText, Upload, AlertCircle, CheckCircle } from "lucide-react";
export function Processing() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes("pdf") && !file.type.includes("image")) {
        setError("Please upload a PDF or image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate file upload and processing
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Navigate to dashboard after processing
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      setError("Failed to process file. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-600");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-blue-600");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-600");
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = fileInputRef.current;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (input) input.files = dataTransfer.files;
      handleFileSelect({ target: { files: dataTransfer.files } } as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="h-[72px] px-6 flex items-center border-b border-slate-200 bg-white">
        <div className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          MedHistory Lens
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[600px]">
          {!isProcessing && !selectedFile && (
            <>
              {/* Upload area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-[16px] p-12 bg-white cursor-pointer transition-colors group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Upload your lab report
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Drag and drop or click to select a PDF or image file
                  </p>
                  <p className="text-xs text-slate-500">
                    Supported formats: PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 rounded-[8px] border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Info cards */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-[8px] border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Supports</div>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Blood tests</li>
                    <li>• Labs & reports</li>
                    <li>• X-rays, scans</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-[8px] border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">We extract</div>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• All biomarkers</li>
                    <li>• Reference ranges</li>
                    <li>• Normal/abnormal</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {selectedFile && !isProcessing && (
            <>
              {/* Selected file preview */}
              <div className="bg-white rounded-[16px] border border-slate-200 p-6 mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-[8px] bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900 mb-1">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-slate-600">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpload}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-600/30 transition"
                  >
                    Process Report
                  </button>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-3 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:border-slate-300 transition"
                  >
                    Change
                  </button>
                </div>
              </div>
            </>
          )}

          {isProcessing && (
            <>
              {/* Processing card */}
              <div className="bg-white rounded-[16px] border border-slate-200 p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[8px] bg-blue-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {selectedFile?.name}
                    </div>
                    <div className="text-xs text-slate-600">
                      Processing...
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-600 text-center mb-6">
                  {progress}% - Extracting biomarkers and analyzing data...
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-slate-700">File uploaded</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${progress >= 50 ? "border-green-600" : "border-slate-300"}`}>
                      {progress >= 50 && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    <span className="text-sm text-slate-700">Extracting data</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${progress >= 80 ? "border-green-600" : "border-slate-300"}`}>
                      {progress >= 80 && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    <span className="text-sm text-slate-700">Analyzing results</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
