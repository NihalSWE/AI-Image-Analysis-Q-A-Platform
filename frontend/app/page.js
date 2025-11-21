"use client";
import { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) router.push("/login");
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    router.push("/login");
  };

  // --- File Handling ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setAnnotatedImage(null);
    setDetections([]);
    setChatHistory([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setAnnotatedImage(null);
    setDetections([]);
    setChatHistory([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- API Logic ---
  const handleDetect = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await api.post("/detect/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setAnnotatedImage(`http://localhost:8000${res.data.annotated_image_url}`);
      setDetections(res.data.detections);
    } catch (err) { alert("Detection failed."); } finally { setLoading(false); }
  };

  const handleAsk = async () => {
    if (!question) return;
    setChatLoading(true);
    const newHistory = [...chatHistory, { role: "user", text: question }];
    setChatHistory(newHistory);
    try {
      const res = await api.post("/qa/chat/", { question, detections });
      setChatHistory([...newHistory, { role: "ai", text: res.data.answer }]);
      setQuestion("");
    } catch (err) { alert("Chat failed"); } finally { setChatLoading(false); }
  };

  // --- Sorting Logic ---
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedDetections = [...detections].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    
    if (sortConfig.key === 'confidence') {
      // Numeric sort
      return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
    } else {
      // String sort
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
      if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    }
  });

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </div>
            <h1>AI Vision Platform</h1>
          </div>
          <div className="user-menu">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="upload-section">
          <h2 className="section-title">Upload Image for Detection</h2>
          <p className="section-subtitle">Upload an image to detect objects using our advanced YOLO model</p>
          
          {/* Drag and Drop Area */}
          {!preview && (
            <div 
              className="upload-area" 
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <div className="upload-text">Drop your image here</div>
              <div className="upload-subtext">or click to browse (PNG, JPG, JPEG)</div>
              <button className="upload-btn">Select Image</button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{display: 'none'}}
              />
            </div>
          )}

          {/* Image Preview & Actions */}
          <div className={`image-preview ${preview ? 'active' : ''}`}>
            <div className="preview-container">
              <div className="preview-image-wrapper">
                <img src={preview} alt="Preview" className="preview-image" />
              </div>
              <div className="preview-actions">
                <button className="action-btn detect-btn" onClick={handleDetect} disabled={loading}>
                  {loading ? "Processing..." : "Detect Objects"}
                </button>
                <button className="action-btn remove-btn" onClick={handleRemoveImage}>
                  Remove Image
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <div className={`results-section ${detections.length > 0 ? 'active' : ''}`}>
          <div className="results-grid">
            {/* Annotated Image Card */}
            <div className="result-card">
              <div className="card-header">
                <h3 className="card-title">Annotated Image</h3>
                <span className="card-badge">{detections.length} Objects</span>
              </div>
              <div className="annotated-image-wrapper">
                {annotatedImage && <img src={annotatedImage} alt="Annotated" className="annotated-image" />}
              </div>
            </div>

            {/* Detection Table Card */}
            <div className="result-card">
              <div className="card-header">
                <h3 className="card-title">Detection Results</h3>
                <span className="card-badge">Sortable</span>
              </div>
              <div className="table-wrapper">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th onClick={() => requestSort('class')}>Object {sortConfig.key === 'class' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                      <th onClick={() => requestSort('confidence')}>Confidence {sortConfig.key === 'confidence' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                      <th>Bounding Box</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDetections.map((d, i) => (
                      <tr key={i}>
                        <td><span className="object-class">{d.class}</span></td>
                        <td>
                          <div className="confidence-bar">
                            <div className="confidence-progress">
                              <div className="confidence-fill" style={{ width: `${d.confidence * 100}%` }}></div>
                            </div>
                            <span className="confidence-value">{(d.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td><span className="bbox-coords">[{d.bbox.join(', ')}]</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Chat / QA Section */}
          <div className="qa-section">
            <div className="qa-header">
              <div className="qa-icon">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path></svg>
              </div>
              <div>
                <h3 className="card-title">Ask Questions About Results</h3>
                <p className="section-subtitle" style={{margin: 0}}>Powered by Gemini AI</p>
              </div>
            </div>

            <div className="chat-container">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  <div className={`message-avatar ${msg.role}`}>{msg.role === 'user' ? 'Me' : 'AI'}</div>
                  <div className="message-content">{msg.text}</div>
                </div>
              ))}
            </div>

            <div className="qa-input-wrapper">
              <input 
                type="text" 
                className="qa-input" 
                placeholder="Ask a question about the detected objects..." 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button className="qa-submit" onClick={handleAsk} disabled={chatLoading}>
                {chatLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}