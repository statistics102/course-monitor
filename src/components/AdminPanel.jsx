import React, { useState, useEffect } from 'react';
import { Download, FileText, Eye, Trash2, Calendar, User, BookOpen } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getFormData, getFiles, downloadFile } from '../utils/storage';

function AdminPanel() {
  const [submissions, setSubmissions] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSubmissions(getFormData());
    setFiles(getFiles());
  };

  const exportToExcel = () => {
    if (submissions.length === 0) {
      alert('No data to export.');
      return;
    }

    const exportData = submissions.map(submission => ({
      'Submission ID': submission.id,
      'Date': submission.date,
      'Lecturer Name': submission.lecturerName,
      'Lecturer ID': submission.lecturerId,
      'Course': submission.course,
      'Section Number': submission.sectionNumber,
      'Total Students Present': submission.totalStudents,
      'Duration (minutes)': submission.duration,
      'Content Type': submission.contentType,
      'Content Name/Number': submission.contentName,
      'Description': submission.description,
      'Submitted At': new Date(submission.timestamp).toLocaleString(),
      'Attached File': (() => {
        const file = files.find(f => f.id === submission.id);
        return file ? file.name : 'No file attached';
      })(),
      'File Type': (() => {
        const file = files.find(f => f.id === submission.id);
        return file ? file.type : 'N/A';
      })(),
      'Download Instructions': (() => {
        const file = files.find(f => f.id === submission.id);
        if (file) {
          return `Go to admin panel → Select submission #${submission.id} → Click Download button`;
        }
        return 'No file to download';
      })()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Course Progress Reports');
    
    XLSX.writeFile(wb, `course-progress-reports-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete all submissions and files? This action cannot be undone.')) {
      localStorage.removeItem('courseProgressData');
      localStorage.removeItem('courseProgressFiles');
      loadData();
      setSelectedSubmission(null);
    }
  };

  const getFileForSubmission = (submissionId) => {
    return files.find(f => f.id === submissionId);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Admin Panel
        </h1>
        <p className="text-lg text-neutral-600">
          Review submissions and download reports
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-neutral-200">
            <span className="text-sm font-medium text-neutral-600">Total Submissions: </span>
            <span className="text-lg font-bold text-primary-600">{submissions.length}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            disabled={submissions.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4" />
            Export to Excel
          </button>
          <button
            onClick={clearAllData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200">
          <FileText className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No submissions yet</h3>
          <p className="text-neutral-600">Submissions will appear here once users submit their reports.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">All Submissions</h2>
            {submissions.map((submission, index) => {
              const associatedFile = getFileForSubmission(submission.id);
              return (
                <div
                  key={submission.id}
                  className={`bg-white p-6 rounded-xl border transition-all cursor-pointer ${
                    selectedSubmission?.id === submission.id
                      ? 'border-primary-300 ring-2 ring-primary-100'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary-600" />
                      <span className="font-semibold text-neutral-900">#{submission.id}</span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {new Date(submission.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3 text-neutral-400" />
                      <span className="text-neutral-600">{submission.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-neutral-400" />
                      <span className="text-neutral-600">{submission.lecturerName}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-neutral-600">{submission.course} - Section {submission.sectionNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      submission.contentType === 'Lecture' ? 'bg-blue-100 text-blue-800' :
                      submission.contentType === 'Assignment' ? 'bg-green-100 text-green-800' :
                      submission.contentType === 'Quiz' ? 'bg-yellow-100 text-yellow-800' :
                      submission.contentType === 'Exam' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {submission.contentType}
                    </span>
                    {associatedFile && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <FileText className="h-3 w-3" />
                        File attached
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-8">
            {selectedSubmission ? (
              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-neutral-900">
                    Submission Details
                  </h3>
                  <span className="text-sm text-neutral-500">
                    #{selectedSubmission.id}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                        Date
                      </label>
                      <p className="text-sm text-neutral-900">{selectedSubmission.date}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                        Duration
                      </label>
                      <p className="text-sm text-neutral-900">{selectedSubmission.duration} minutes</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                        Lecturer Name
                      </label>
                      <p className="text-sm text-neutral-900">{selectedSubmission.lecturerName}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                        Lecturer ID
                      </label>
                      <p className="text-sm text-neutral-900">{selectedSubmission.lecturerId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                        Course
                      </label>
                      <p className="text-sm text-neutral-900">{selectedSubmission.course}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                        Section
                      </label>
                      <p className="text-sm text-neutral-900">{selectedSubmission.sectionNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                        Students Present
                      </label>
                      <p className="text-sm text-neutral-900">{selectedSubmission.totalStudents}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                        Content Type
                      </label>
                      <p className="text-sm text-neutral-900">{selectedSubmission.contentType}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                      Content Name/Number
                    </label>
                    <p className="text-sm text-neutral-900">{selectedSubmission.contentName}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                      Description
                    </label>
                    <p className="text-sm text-neutral-900">{selectedSubmission.description}</p>
                  </div>

                  {(() => {
                    const associatedFile = getFileForSubmission(selectedSubmission.id);
                    return associatedFile ? (
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                          Attached File
                        </label>
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-neutral-600" />
                            <span className="text-sm text-neutral-900">{associatedFile.name}</span>
                          </div>
                          <button
                            onClick={() => downloadFile(associatedFile.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                          Attached File
                        </label>
                        <p className="text-sm text-neutral-400 italic">No file attached</p>
                      </div>
                    );
                  })()}

                  <div className="pt-4 border-t border-neutral-200">
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                      Submitted At
                    </label>
                    <p className="text-sm text-neutral-900">
                      {new Date(selectedSubmission.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-neutral-200 text-center">
                <Eye className="mx-auto h-8 w-8 text-neutral-400 mb-3" />
                <p className="text-neutral-600">Select a submission to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
