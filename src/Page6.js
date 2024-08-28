import React, { useState } from 'react';
import { db, storage } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './UploadForm.css';

function UploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState([]);
  const [type, setType] = useState(''); 
  const [source, setSource] = useState('');
  const [files, setFiles] = useState([]);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [externalLink, setExternalLink] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState(['']);
  const [uploader, setUploader] = useState('');
  const [motivation, setMotivation] = useState('');  // Motivation ist optional
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);

  // handleFileChange Definition
  const handleFileChange = (e) => {
    if (e.target.files.length > 4) {
      setError('You can upload up to 4 files only.');
      return;
    }
    const newFiles = Array.from(e.target.files).filter(file => file.size <= 1048576); 
    if (newFiles.length !== e.target.files.length) {
      setError('Each file must be 1MB or less.');
      return;
    }
    setFiles(newFiles);
  };

  // handleAdditionalInfoChange Definition
  const handleAdditionalInfoChange = (index, value) => {
    const newAdditionalInfo = [...additionalInfo];
    newAdditionalInfo[index] = value;
    setAdditionalInfo(newAdditionalInfo);
  };

  // addMoreInfoField Definition
  const addMoreInfoField = () => {
    setAdditionalInfo([...additionalInfo, '']);
  };

  // handleSubmit Definition
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category.length || !type || !uploader || !mood) {  // Motivation wird hier nicht als Pflichtfeld geprüft
      setError("Please fill in all required fields.");
      return;
    }

    try {
      let fileURLs = [];
      for (const file of files) {
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const fileURL = await getDownloadURL(uploadResult.ref);
        fileURLs.push(fileURL);
      }

      let thumbnailURL = thumbnailUrl;
      if (!thumbnailUrl && thumbnail) {
        const thumbnailRef = ref(storage, `thumbnails/${thumbnail.name}`);
        const thumbnailUploadResult = await uploadBytes(thumbnailRef, thumbnail);
        thumbnailURL = await getDownloadURL(thumbnailUploadResult.ref);
      }

      await addDoc(collection(db, 'uploads'), {
        title,
        description,
        category,  
        type,
        source,
        fileURLs,
        thumbnailURL,
        externalLink,
        additionalInfo: additionalInfo.filter(info => info.trim() !== ''),
        uploader,
        motivation,  // Motivation wird hier optional gespeichert
        mood,
        tags: tags.split(',').map(tag => tag.trim()),
        createdAt: new Date(),
      });

      setTitle('');
      setDescription('');
      setCategory([]);  
      setType('');
      setSource('');
      setFiles([]);
      setThumbnail(null);
      setThumbnailUrl('');
      setExternalLink('');
      setAdditionalInfo(['']);
      setUploader('');
      setMotivation('');  
      setMood('');
      setTags('');
      setError(null);
      alert("Upload successful!");
    } catch (err) {
      console.error("Error uploading file: ", err);
      setError("Error uploading file");
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <label>
          Title: <span className="required">*</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description: <span className="required">*</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </label>
        <label>
          Category: <span className="required">*</span>
          <div className="category-checkboxes">
            {[
              "ANGER","BEAUTY", "COMFORT", "DENIAL", "FEAR", "HOPE", "INSPIRATION",
              "LOSS", "LOVE", "MOURNING", "LIBERATION", "PAIN", "PASSION",
              "SEX", "SHAME", "STIGMA", "STRENGTH", "TRACES ", "VIOLENCE ", 
            ].map((cat) => (
              <div key={cat}>
                <input
                  type="checkbox"
                  value={cat}
                  checked={category.includes(cat)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategory([...category, cat]);
                    } else {
                      setCategory(category.filter(c => c !== cat));
                    }
                  }}
                />
                {cat}
              </div>
            ))}
          </div>
        </label>
        <label>
          Type: <span className="required">*</span>
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">Select Type</option>
            {/* Weitere Optionen hier... */}
          </select>
        </label>
        <label>
          Source (optional):
          <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
        </label>
        <label>
          Upload Thumbnail (optional):
          <input type="file" onChange={handleFileChange} disabled={thumbnailUrl} />
        </label>
        <label>
          Thumbnail URL (optional):
          <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} disabled={thumbnail} />
        </label>
        <label>
          Files (up to 4, max 1MB each):
          <input type="file" onChange={handleFileChange} multiple />
        </label>
        <label>
          Linked Resources:
          {additionalInfo.map((info, index) => (
            <input
              key={index}
              type="url"
              value={info}
              onChange={(e) => handleAdditionalInfoChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addMoreInfoField}>Add Another URL</button>
        </label>
        <label>
          Uploader: <span className="required">*</span>
          <input type="text" value={uploader} onChange={(e) => setUploader(e.target.value)} required />
        </label>
        <label>
          Motivation:
          <textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} ></textarea>
        </label>
        <label>
          Mood: <span className="required">*</span>
          <textarea value={mood} onChange={(e) => setMood(e.target.value)} required></textarea>
        </label>
        <label>
          Tags (comma separated):
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadForm;
