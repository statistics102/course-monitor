// Local storage utilities for demo purposes
export const saveFormData = (formData) => {
  const existingData = getFormData();
  const newEntry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...formData
  };
  existingData.push(newEntry);
  localStorage.setItem('courseProgressData', JSON.stringify(existingData));
  return newEntry.id;
};

export const getFormData = () => {
  const data = localStorage.getItem('courseProgressData');
  return data ? JSON.parse(data) : [];
};

export const saveFile = (file, entryId) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        id: entryId,
        name: file.name,
        type: file.type,
        data: e.target.result,
        timestamp: new Date().toISOString()
      };
      
      const existingFiles = getFiles();
      existingFiles.push(fileData);
      localStorage.setItem('courseProgressFiles', JSON.stringify(existingFiles));
      resolve(fileData);
    };
    reader.readAsDataURL(file);
  });
};

export const getFiles = () => {
  const files = localStorage.getItem('courseProgressFiles');
  return files ? JSON.parse(files) : [];
};

export const downloadFile = (fileId) => {
  const files = getFiles();
  const file = files.find(f => f.id === fileId);
  if (file) {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
