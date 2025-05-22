import React, { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactQuill from 'react-quill';
import {
  Typography, Collapse, Button, Divider, Space, Tabs, Modal, Input, message, Card,
} from 'antd';
import {
  BookOutlined, ClockCircleOutlined, UserSwitchOutlined,
  SafetyOutlined, SmileOutlined, CheckCircleOutlined,
  EditOutlined, FilePdfOutlined, PlusOutlined, DeleteOutlined,
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';  // npm install uuid

const { Title } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { confirm } = Modal;

const isAdmin = true;
const languages = ['en', 'hi'] as const;
type Language = typeof languages[number];

type Section = {
  id: string;
  titleEn: string;
  titleHi: string;
  contentEn: string;
  contentHi: string;
};

const defaultSections: Section[] = [
  {
    id: uuidv4(),
    titleEn: 'Company Overview',
    titleHi: 'कंपनी अवलोकन',
    contentEn: 'Welcome to **BhawanCare**! We’re building better societies.',
    contentHi: 'BhawanCare में आपका स्वागत है! हम बेहतर समाज बना रहे हैं।',
  },
  {
    id: uuidv4(),
    titleEn: 'Work Hours & Attendance',
    titleHi: 'काम के घंटे और उपस्थिति',
    contentEn: 'Work from **9:00 AM to 6:00 PM**, Monday to Friday.',
    contentHi: 'काम के घंटे: **सुबह 9 से शाम 6**, सोमवार से शुक्रवार।',
  },
  {
    id: uuidv4(),
    titleEn: 'Leave Policy',
    titleHi: 'अवकाश नीति',
    contentEn: '18 paid leaves per year. Notify in advance.',
    contentHi: 'प्रति वर्ष **18 पेड लीव**। पहले से सूचित करें।',
  },
  {
    id: uuidv4(),
    titleEn: 'Code of Conduct',
    titleHi: 'आचरण संहिता',
    contentEn: 'Respect everyone. Zero tolerance for harassment.',
    contentHi: 'हर किसी का सम्मान करें। उत्पीड़न के लिए जीरो टॉलरेंस।',
  },
  {
    id: uuidv4(),
    titleEn: 'Dress Code',
    titleHi: 'ड्रेस कोड',
    contentEn: 'Wear **smart-casual** or prescribed uniform.',
    contentHi: '**स्मार्ट-कैजुअल** या निर्धारित यूनिफॉर्म पहनें।',
  },
  {
    id: uuidv4(),
    titleEn: 'Performance & Evaluation',
    titleHi: 'प्रदर्शन और मूल्यांकन',
    contentEn: 'Evaluated **every 6 months**. Top performers get bonuses.',
    contentHi: '**हर 6 महीने** में मूल्यांकन। सर्वश्रेष्ठ को बोनस।',
  },
];

const STORAGE_KEY = 'employee_handbook_sections';

const EmployeeHandbook = () => {
  const [lang, setLang] = useState<Language>('en');
  const [editing, setEditing] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);

  // Load from localStorage or fallback to default
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSections(JSON.parse(saved));
      } catch {
        setSections(defaultSections);
      }
    } else {
      setSections(defaultSections);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  }, [sections]);

  // Download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Employee Handbook', 20, 20);

    let y = 30;
    sections.forEach(({ titleEn, titleHi, contentEn, contentHi }) => {
      doc.setFontSize(12);
      doc.text(lang === 'en' ? titleEn : titleHi, 20, y);
      y += 10;
      doc.setFontSize(10);
      const text = lang === 'en' ? contentEn : contentHi;
      doc.text(text.replace(/\*\*/g, ''), 20, y);
      y += 20;
    });

    doc.save('employee_handbook.pdf');
    message.success('Downloaded PDF');
  };

  // Update section content or titles
  const updateSection = useCallback((id: string, field: keyof Section, value: string) => {
    setSections(prev =>
      prev.map(s => s.id === id ? { ...s, [field]: value } : s)
    );
  }, []);

  // Validate title uniqueness (case insensitive)
  const isTitleUnique = (id: string, titleField: 'titleEn' | 'titleHi', value: string) => {
    return !sections.some(
      s => s.id !== id && s[titleField].trim().toLowerCase() === value.trim().toLowerCase()
    );
  };

  // Add new empty section
  const addSection = () => {
    const newSection: Section = {
      id: uuidv4(),
      titleEn: '',
      titleHi: '',
      contentEn: '',
      contentHi: '',
    };
    setSections(prev => [...prev, newSection]);
  };

  // Delete section with confirmation modal
  const deleteSection = (id: string) => {
    const section = sections.find(s => s.id === id);
    if (!section) return;
    confirm({
      title: `Delete section "${lang === 'en' ? section.titleEn : section.titleHi}"?`,
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setSections(prev => prev.filter(s => s.id !== id));
        message.success('Section deleted');
      },
    });
  };

  return (
    <div style={{ width: "90%", margin: 'auto', padding: 40 }}>
      <Card bordered style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={3}>🧾 Employee Handbook</Title>
          <Space>
            <Button icon={<FilePdfOutlined />} onClick={handleDownloadPDF}>
              Download PDF
            </Button>
            {isAdmin && (
              <Button
                icon={<EditOutlined />}
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel Edit' : 'Edit'}
              </Button>
            )}
          </Space>
        </div>

        <Divider />

        <Tabs activeKey={lang} onChange={(activeKey) => setLang(activeKey as Language)} style={{ marginBottom: 20 }}>
          {languages.map(l => (
            <TabPane tab={l.toUpperCase()} key={l} />
          ))}
        </Tabs>

        {editing && isAdmin && (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addSection}
            style={{ marginBottom: 16 }}
          >
            Add New Section
          </Button>
        )}

        <Collapse accordion bordered={false}>
          {sections.map(({ id, titleEn, titleHi, contentEn, contentHi }, i) => {
            // Icons for each section by index, fallback icon if more than default 6
            const icons = [
              <BookOutlined />,
              <ClockCircleOutlined />,
              <UserSwitchOutlined />,
              <SafetyOutlined />,
              <SmileOutlined />,
              <CheckCircleOutlined />,
            ];
            const icon = icons[i] || <BookOutlined />;

            // Get title and content based on current language
            const title = lang === 'en' ? titleEn : titleHi;
            const content = lang === 'en' ? contentEn : contentHi;

            return (
              <Panel
                header={
                  <Space>
                    {icon}
                    {editing ? (
                      <Input
                        value={title}
                        onChange={e => {
                          const val = e.target.value;
                          // Validate uniqueness of title
                          if (!val.trim()) {
                            message.error('Title cannot be empty');
                            return;
                          }
                          if (!isTitleUnique(id, lang === 'en' ? 'titleEn' : 'titleHi', val)) {
                            message.error('Title must be unique');
                            return;
                          }
                          updateSection(id, lang === 'en' ? 'titleEn' : 'titleHi', val);
                        }}
                        style={{ width: 250 }}
                      />
                    ) : (
                      <strong>{title}</strong>
                    )}

                    {editing && (
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={e => {
                          e.stopPropagation(); // prevent collapse toggle
                          deleteSection(id);
                        }}
                      />
                    )}
                  </Space>
                }
                key={id}
                style={{ backgroundColor: '#fafafa', borderRadius: 8, marginBottom: 12 }}
              >
                {editing && isAdmin ? (
                  <ReactQuill
                    key={`${lang}-${id}`}
                    value={content}
                    theme="snow"
                    onChange={(val) => {
                      updateSection(id, lang === 'en' ? 'contentEn' : 'contentHi', val);
                    }}
                    style={{ background: 'white' }}
                  />
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: content }} />

                )}
              </Panel>
            );
          })}
        </Collapse>
      </Card>
    </div>
  );
};

export default EmployeeHandbook;
