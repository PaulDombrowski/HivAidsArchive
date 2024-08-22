import React, { useState } from 'react';
import { db, storage } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './UploadForm.css';

function UploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState([]);  // Kategorie-Feld als Array initialisieren
  const [type, setType] = useState(''); 
  const [source, setSource] = useState('');
  const [files, setFiles] = useState([]);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [externalLink, setExternalLink] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState(['']);
  const [uploader, setUploader] = useState('');
  const [motivation, setMotivation] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);

  // ... weitere Funktionen wie handleFileChange, handleAdditionalInfoChange, etc.


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
    if (!title || !description || !category.length || !type || !uploader || !motivation || !mood) {
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
        category,  // Kategorie wird als Array gespeichert
        type,
        source,
        fileURLs,
        thumbnailURL,
        externalLink,
        additionalInfo: additionalInfo.filter(info => info.trim() !== ''),
        uploader,
        motivation,
        mood,
        tags: tags.split(',').map(tag => tag.trim()),
        createdAt: new Date(),
      });

      // Formular zurücksetzen nach erfolgreichem Upload
      setTitle('');
      setDescription('');
      setCategory([]);  // Kategorie zurücksetzen
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
            "BEAUTY", "COMFORT", "DENIAL", "FEAR", "HOPE", "INSPIRATION",
            "LOSS", "LOVE", "MOURNING", "LIBERATION", "PAIN", "PASSION",
            "SEX", "SHAME", "STIGMA", "STRENGTH", "TRACES", "VIOLENCE"
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
        Type: <span className="required">*</span>  {/* Type-Feld */}
        <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="Advertisement">Advertisement</option>
<option value="Article">Article</option>
<option value="Artwork">Artwork</option>
<option value="Audio">Audio</option>
<option value="Book">Book</option>
<option value="Blogpost">Blogpost</option>
<option value="Case Study">Case Study</option>
<option value="Collected Volume">Collected Volume</option>
<option value="Conference Paper">Conference Paper</option>
<option value="Dataset">Dataset</option>
<option value="Diary">Diary</option>
<option value="Documentary">Documentary</option>
<option value="Essay">Essay</option>
<option value="Exhibition">Exhibition</option>
<option value="Film">Film</option>
<option value="Flyer">Flyer</option>
<option value="Interview">Interview</option>
<option value="Journal">Journal</option>
<option value="Legal Document">Legal Document</option>
<option value="Letter">Letter</option>
<option value="Magazine">Magazine</option>
<option value="Memoir">Memoir</option>
<option value="Monograph">Monograph</option>
<option value="Music Video">Music Video</option>
<option value="Newspaper">Newspaper</option>
<option value="News Clip">News Clip</option>
<option value="Newsletter">Newsletter</option>
<option value="Novel">Novel</option>
<option value="Official Document">Official Document</option>
<option value="Oral History">Oral History</option>
<option value="Pamphlet">Pamphlet</option>
<option value="Photograph">Photograph</option>
<option value="Podcast">Podcast</option>
<option value="Poster">Poster</option>
<option value="Presentation">Presentation</option>
<option value="Research Paper">Research Paper</option>
<option value="Screenshot">Screenshot</option>
<option value="Short Story">Short Story</option>
<option value="Social Media Comment">Social Media Comment</option>
<option value="Social Media Post">Social Media Post</option>
<option value="Speech">Speech</option>
<option value="Survey">Survey</option>
<option value="Testimony">Testimony</option>
<option value="Thesis">Thesis</option>
<option value="Video">Video</option>
<option value="Website">Website</option>
<option value="Other">Other</option>


        </select>
      </label>
      <label>
        Source (optional):  {/* Quelle-Feld */}
        <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
      </label>
      <label>
        Upload Thumbnail (optional):  {/* Thumbnail-Upload vor Thumbnail-URL */}
        <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} disabled={thumbnailUrl} />
      </label>
      <label>
        Thumbnail URL (optional):  {/* Thumbnail-URL nach Thumbnail-Upload */}
        <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} disabled={thumbnail} />
      </label>
      <label>
        Files (up to 4, max 1MB each):  {/* Pflichtfeld bei Files entfernt */}
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
        Uploader: 
        <input type="text" value={uploader} onChange={(e) => setUploader(e.target.value)} />
      </label>
      <label>
        Motivation: 
        <textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} ></textarea>
      </label>
      <label>
        Mood:
        <textarea value={mood} onChange={(e) => setMood(e.target.value)} ></textarea>
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
