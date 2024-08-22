import React, { useState } from 'react';
import { db, storage } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './UploadForm.css';

function UploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [externalLink, setExternalLink] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState(['']);
  const [uploader, setUploader] = useState('');
  const [motivation, setMotivation] = useState('');
  const [mood, setMood] = useState('');
  const [category, setCategory] = useState('');
  const [objectType, setObjectType] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 4) {
      setError('You can upload up to 4 files only.');
      return;
    }
    const newFiles = Array.from(e.target.files).filter(file => file.size <= 1048576); // 1MB = 1048576 bytes
    if (newFiles.length !== e.target.files.length) {
      setError('Each file must be 1MB or less.');
      return;
    }
    setFiles(newFiles);
  };

  const handleAdditionalInfoChange = (index, value) => {
    const newAdditionalInfo = [...additionalInfo];
    newAdditionalInfo[index] = value;
    setAdditionalInfo(newAdditionalInfo);
  };

  const addMoreInfoField = () => {
    setAdditionalInfo([...additionalInfo, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !files.length || !uploader || !motivation || !mood || !category || !objectType) {
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
        fileURLs,
        thumbnailURL,
        externalLink,
        additionalInfo: additionalInfo.filter(info => info.trim() !== ''),
        uploader,
        motivation,
        mood,
        category,
        objectType,
        tags: tags.split(',').map(tag => tag.trim()),
        createdAt: new Date(),
      });

      setTitle('');
      setDescription('');
      setFiles([]);
      setThumbnail(null);
      setThumbnailUrl('');
      setExternalLink('');
      setAdditionalInfo(['']);
      setUploader('');
      setMotivation('');
      setMood('');
      setCategory('');
      setObjectType('');
      setTags('');
      setError(null);
      alert("Upload successful!");
    } catch (err) {
      console.error("Error uploading file: ", err);
      setError("Error uploading file");
    }
  };

  return (
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
        Files (up to 4, max 1MB each): <span className="required">*</span>
        <input type="file" onChange={handleFileChange} multiple required />
      </label>
      <label>
        Thumbnail URL (optional):
        <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} disabled={thumbnail} />
      </label>
      <label>
        Upload Thumbnail (optional):
        <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} disabled={thumbnailUrl} />
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
        Motivation: <span className="required">*</span>
        <textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} required></textarea>
      </label>
      <label>
        Mood: <span className="required">*</span>
        <textarea value={mood} onChange={(e) => setMood(e.target.value)} required></textarea>
      </label>
      <label>
        Category: <span className="required">*</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="scientific_study">Scientific Study</option>
          <option value="personal_story">Personal Story</option>
          <option value="public_health">Public Health</option>
          <option value="policy_and_law">Policy and Law</option>
          <option value="cultural_contributions">Cultural Contributions</option>
          <option value="educational_resources">Educational Resources</option>
          {/* Weitere Kategorien hier */}
        </select>
      </label>
      <label>
        Object Type: <span className="required">*</span>
        <select value={objectType} onChange={(e) => setObjectType(e.target.value)} required>
          <option value="">Select Object Type</option>
          <option value="social_media_post">Social Media Post</option>
          <option value="article">Article</option>
          <option value="monograph">Monograph</option>
          <option value="film">Film</option>
          <option value="letter">Letter</option>
          <option value="interview">Interview</option>
          <option value="podcast">Podcast</option>
          <option value="news_clip">News Clip</option>
          <option value="artwork">Artwork</option>
          <option value="research_paper">Research Paper</option>
          <option value="presentation">Presentation</option>
          <option value="photograph">Photograph</option>
          <option value="flyer">Flyer</option>
          <option value="poster">Poster</option>
          <option value="speech">Speech</option>
          <option value="testimony">Testimony</option>
          <option value="official_document">Official Document</option>
          <option value="website_screenshot">Website Screenshot</option>
          <option value="case_study">Case Study</option>
          <option value="legal_document">Legal Document</option>
          <option value="music_video">Music Video</option>
          <option value="conference_paper">Conference Paper</option>
          <option value="dataset">Dataset</option>
          <option value="survey">Survey</option>
          <option value="advertisement">Advertisement</option>
          <option value="newsletter">Newsletter</option>
          {/* Weitere Typen hier */}
        </select>
      </label>
      <label>
        Tags (comma separated):
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
      </label>
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadForm;
