import { Upload, Trash2, Download, Edit2, Check } from "lucide-react";

export default function ResumeUploadCard() {
  return (
    <div className=" border rounded-2xl bg-white shadow-sm p-6 mt-8">
      <h2 className="text-lg font-semibold mb-4">Resume</h2>

      {/* Uploaded File */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border">
        <div>
          <p className="font-medium text-gray-800">
            Software_Engineer_Resume_1.pdf
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Uploaded on Jul 02, 2025
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Edit2 className="w-4 h-4 text-gray-600 cursor-pointer" />
          <Check className="w-4 h-4 text-blue-600" />
          <Download className="w-5 h-5 text-gray-600 cursor-pointer" />
          <Trash2 className="w-5 h-5 text-red-500 cursor-pointer" />
        </div>
      </div>

      {/* Add Button Box */}
      <div className="mt-6 border border-dashed rounded-xl p-8 text-center">
        <button className="px-6 py-2 border rounded-full text-blue-600 hover:bg-blue-50 transition">
          add
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Supported Formats: doc, docx, rtf, pdf, upto 2 MB
        </p>
      </div>
    </div>
  );
}
