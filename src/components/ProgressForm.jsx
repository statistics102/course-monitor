import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { saveFormData, saveFile } from '../utils/storage';

function ProgressForm() {
  const [formData, setFormData] = useState({
    date: '',
    lecturerName: '',
    lecturerId: '',
    course: '',
    sectionNumber: '',
    totalStudents: '',
    duration: '',
    contentType: '',
    contentName: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contentTypes = [
    'Lecture',
    'Assignment',
    'Quiz',
    'Exam',
    'Report'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Save form data
      const entryId = saveFormData(formData);
      
      // Save file if uploaded
      if (file) {
        await saveFile(file, entryId);
      }

      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        date: '',
        lecturerName: '',
        lecturerId: '',
        course: '',
        sectionNumber: '',
        totalStudents: '',
        duration: '',
        contentType: '',
        contentName: '',
        description: ''
      });
      setFile(null);
      document.getElementById('file-upload').value = '';
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Course Progress Monitor
        </h1>
        <p className="text-lg text-neutral-600">
          Record daily course progress and assessments
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Report submitted successfully!</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">Error submitting report. Please try again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-neutral-900 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="lecturerName" className="block text-sm font-semibold text-neutral-900 mb-2">
                Lecturer Name *
              </label>
              <input
                type="text"
                id="lecturerName"
                name="lecturerName"
                value={formData.lecturerName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter lecturer name"
              />
            </div>

            <div>
              <label htmlFor="lecturerId" className="block text-sm font-semibold text-neutral-900 mb-2">
                Lecturer ID *
              </label>
              <input
                type="text"
                id="lecturerId"
                name="lecturerId"
                value={formData.lecturerId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter lecturer ID"
              />
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-semibold text-neutral-900 mb-2">
                Course *
              </label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter course name"
              />
            </div>

            <div>
              <label htmlFor="sectionNumber" className="block text-sm font-semibold text-neutral-900 mb-2">
                Section Number *
              </label>
              <input
                type="text"
                id="sectionNumber"
                name="sectionNumber"
                value={formData.sectionNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter section number"
              />
            </div>

            <div>
              <label htmlFor="totalStudents" className="block text-sm font-semibold text-neutral-900 mb-2">
                Total Students Present *
              </label>
              <input
                type="number"
                id="totalStudents"
                name="totalStudents"
                value={formData.totalStudents}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter number of students"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-semibold text-neutral-900 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter duration in minutes"
              />
            </div>

            <div>
              <label htmlFor="contentType" className="block text-sm font-semibold text-neutral-900 mb-2">
                Content Type *
              </label>
              <select
                id="contentType"
                name="contentType"
                value={formData.contentType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              >
                <option value="">Select content type</option>
                {contentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="contentName" className="block text-sm font-semibold text-neutral-900 mb-2">
              Content Name/Number *
            </label>
            <input
              type="text"
              id="contentName"
              name="contentName"
              value={formData.contentName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="Enter content name or number"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-neutral-900 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
              placeholder="Describe the content and activities"
            />
          </div>

          <div>
            <label htmlFor="file-upload" className="block text-sm font-semibold text-neutral-900 mb-2">
              Upload File (Doc or Data)
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-neutral-400" />
                <div className="flex text-sm text-neutral-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-neutral-500">
                  Accepted formats: any kind of files and formats
                </p>
                {file && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-sm text-green-600">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProgressForm;
