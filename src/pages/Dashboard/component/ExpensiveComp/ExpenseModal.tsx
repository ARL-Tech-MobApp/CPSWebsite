import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ExpenseModalProps } from '../../types/expense';
import { createWorker } from 'tesseract.js';
import '../../modal.css';

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  empId,
}) => {
  const [formData, setFormData] = useState({
    startReading: initialData?.startReading || 0,
    endReading: initialData?.endReading || 0,
    kilometers: initialData?.kilometers || 0,
    purpose: initialData?.purpose || '',
    date: initialData ? new Date(initialData.date).toISOString() : new Date().toISOString(),
    startImage: initialData?.startImage || '',
    endImage: initialData?.endImage || '',
    startMeterUrl: initialData?.startMeterUrl || null,
    endMeterUrl: initialData?.endMeterUrl || null,
  });

  const [fileStart, setFileStart] = useState<File | null>(null);
  const [fileEnd, setFileEnd] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const canvasRefStart = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;
  const canvasRefEnd = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;

  const dateOnly = formData.date.substring(0, 10);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        startMeterUrl: initialData.startMeterUrl || null,
        endMeterUrl: initialData.endMeterUrl || null,
      }));
    }
  }, [initialData]);

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const runOCRWithHighlight = async (
    imageUrl: string,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    field: 'startReading' | 'endReading'
  ) => {
    setLoading(true);
    const worker = await createWorker(['eng']);

    try {
      const {
        data: { text, blocks },
      } = await worker.recognize(imageUrl);

      const numbers = text.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        updateForm(field, parseInt(numbers[0], 10));
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          if (ctx) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.font = '16px Arial';
            ctx.fillStyle = 'red';
            blocks?.forEach(block => {
              block.paragraphs?.forEach(para => {
                para.lines?.forEach(line => {
                  line.words?.forEach(word => {
                    const { x0, y0, x1, y1 } = word.bbox;
                    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
                    ctx.fillText(word.text, x0, y0 - 5);
                  });
                });
              });
            });
          }
        };
      }
    } catch (err) {
      console.error('OCR Error', err);
    }

    await worker.terminate();
    setLoading(false);
  };

  useEffect(() => {
    if (formData.startReading && formData.endReading && formData.endReading > formData.startReading) {
      updateForm(
        'kilometers',
        Number(formData.endReading) - Number(formData.startReading)
      );
    }
  }, [formData.startReading, formData.endReading]);

  const onDropStart = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileStart(file);
    const imageUrl = URL.createObjectURL(file);
    updateForm('startMeterUrl', imageUrl);
    runOCRWithHighlight(imageUrl, canvasRefStart, 'startReading');
  }, []);

  const onDropEnd = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileEnd(file);
    const imageUrl = URL.createObjectURL(file);
    updateForm('endMeterUrl', imageUrl);
    runOCRWithHighlight(imageUrl, canvasRefEnd, 'endReading');
  }, []);

  const getFileName = (file: File | null) => {
    if (!file) return '';
    const extension = file.name.split('.').pop();
    const uuid = URL.createObjectURL(file).split('/').pop();
    return `${uuid}.${extension}`;
  };

  const handleSubmit = () => {
    if ((!fileStart || !fileEnd) && !initialData) {
      alert('Please upload both start and end meter images.');
      return;
    }

    onSubmit({
      employeeId: empId,
      startReading: String(formData.startReading),
      endReading: String(formData.endReading),
      kilometers: String(formData.kilometers),
      purpose: formData.purpose,
      date: formData.date,
      startImage: fileStart ? getFileName(fileStart) : formData.startImage,
      endImage: fileEnd ? getFileName(fileEnd) : formData.endImage,
    });

    handleClose();
  };

  const handleClose = () => {
    setFileStart(null);
    setFileEnd(null);
    setFormData({
      startReading: 0,
      endReading: 0,
      kilometers: 0,
      purpose: '',
      date: new Date().toISOString(),
      startImage: '',
      endImage: '',
      startMeterUrl: null,
      endMeterUrl: null,
    });
    onClose();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const oldTime = formData.date.substring(10);
    updateForm('date', newDate + oldTime);
  };

  const startDropzone = useDropzone({
    onDrop: onDropStart,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    multiple: false,
  });

  const endDropzone = useDropzone({
    onDrop: onDropEnd,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    multiple: false,
  });

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <h3>Add Bike Meter Reading</h3>

        {/* Start Reading */}
        <div className="form-group">
          <label>Start Reading By Image</label>
          <div {...startDropzone.getRootProps()} className="dropzone">
            <input {...startDropzone.getInputProps()} />
            {formData.startMeterUrl ? (
              <canvas ref={canvasRefStart} style={{ width: '100%', borderRadius: 10 }} />
            ) : (
              <p>Drag & drop or click to upload start reading image</p>
            )}
          </div>
          <input
            type="number"
            value={formData.startReading}
            onChange={(e) => updateForm('startReading', parseInt(e.target.value) || 0)}
            placeholder="Start Reading"
          />
        </div>

        {/* End Reading */}
        <div className="form-group">
          <label>End Reading By Image</label>
          <div {...endDropzone.getRootProps()} className="dropzone">
            <input {...endDropzone.getInputProps()} />
            {formData.endMeterUrl ? (
              <canvas ref={canvasRefEnd} style={{ width: '100%', borderRadius: 10 }} />
            ) : (
              <p>Drag & drop or click to upload end reading image</p>
            )}
          </div>
          <input
            type="number"
            value={formData.endReading}
            onChange={(e) => updateForm('endReading', parseInt(e.target.value) || 0)}
            placeholder="End Reading"
          />
        </div>

        {/* KM + Purpose + Date */}
        <div className="form-group">
          <label>Total KM</label>
          <input type="number" value={formData.kilometers} readOnly />
        </div>

        <div className="form-group">
          <label>Purpose</label>
          <input
            type="text"
            value={formData.purpose}
            onChange={(e) => updateForm('purpose', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" value={dateOnly} onChange={handleDateChange} />
        </div>

        <div className="modal-actions">
          <button onClick={handleClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
