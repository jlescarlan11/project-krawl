"use client";

import { useState } from "react";
import { uploadSingleFile } from "@/lib/cloudinary/upload";

/**
 * Test Upload Page
 *
 * Simple page to test Cloudinary upload configuration
 * Navigate to /test-upload to use this page
 */
export default function TestUploadPage() {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("Uploading...");
    setError("");
    setUploadedUrl("");
    setProgress(0);

    try {
      const result = await uploadSingleFile(file, 0, {
        onProgress: (prog) => {
          setProgress(prog.progress);
          console.log("Progress:", prog);
        },
        onError: (err) => {
          console.error("Upload error:", err);
          setError(err);
        },
      });

      if (result.success) {
        setStatus("Upload successful!");
        setUploadedUrl(result.url);
      } else {
        setStatus("Upload failed");
        setError(result.error || "Unknown error");
      }
    } catch (err) {
      console.error("Upload exception:", err);
      setStatus("Upload failed");
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Cloudinary Upload Test</h1>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h2 className="font-semibold mb-2">Configuration Check:</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(
              {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                hasCloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                hasPreset: !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select an image to test upload:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {progress > 0 && progress < 100 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">{progress}%</p>
          </div>
        )}

        {status && (
          <div
            className={`p-4 rounded mb-4 ${
              status.includes("success")
                ? "bg-green-50 text-green-800"
                : "bg-gray-50 text-gray-800"
            }`}
          >
            {status}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {uploadedUrl && (
          <div className="mb-4">
            <p className="font-semibold mb-2">Uploaded Image:</p>
            <img
              src={uploadedUrl}
              alt="Uploaded"
              className="max-w-full h-auto rounded border"
            />
            <p className="text-xs text-gray-600 mt-2 break-all">
              URL: {uploadedUrl}
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold mb-2">Troubleshooting:</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Check browser console (F12) for detailed errors</li>
            <li>Verify upload preset "krawl-gems" exists in Cloudinary</li>
            <li>Ensure preset is set to "Unsigned" mode</li>
            <li>Check CORS settings in Cloudinary dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
