import React, { useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  Table,
  Tag,
} from 'antd';
import { DownloadOutlined, FileAddOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';

const SalarySlip = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  type Slip = {
    id: number;
    name: string;
    months: string[];
    amounts: { [key: string]: number };
    status: string;
    pdfLinks?: { [key: string]: string };
  };

  const [slips, setSlips] = useState<Slip[]>([]);
  const [role, setRole] = useState('Employee');
  const [selectedSlip, setSelectedSlip] = useState<Slip | null>(null);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  interface HandleSubmitValues {
    name: string;
    months: dayjs.Dayjs[];
  }

  interface NewSlip {
    id: number;
    name: string;
    months: string[];
    amounts: { [key: string]: number };
    status: string;
  }

  interface HandleSubmitFormValues {
    name: string;
    mode: 'single' | 'multiple';
    months: dayjs.Dayjs[] | dayjs.Dayjs;
  }

  interface NewSlipType {
    id: number;
    name: string;
    months: string[];
    amounts: { [key: string]: number };
    status: string;
  }

  const handleSubmit = (values: HandleSubmitFormValues): void => {
    const { mode } = values;
    const months: string[] =
      mode === 'multiple'
        ? (values.months as dayjs.Dayjs[]).map((m) => dayjs(m).format('YYYY-MM'))
        : [dayjs(values.months as dayjs.Dayjs).format('YYYY-MM')];

    const newSlip: NewSlipType = {
      id: Date.now(),
      name: values.name,
      months,
      amounts: {},
      status: 'Pending',
    };

    setSlips([...slips, newSlip]);
    form.resetFields();
    setIsModalOpen(false);
  };
  
  interface GeneratePdfParams {
    name: string;
    month: string;
    amount: number;
  }

  const generatePdf = (name: string, month: string, amount: number): string => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Real Company Pvt Ltd', 20, 20);
    doc.setFontSize(14);
    doc.text(`Salary Slip`, 20, 40);
    doc.text(`Employee: ${name}`, 20, 50);
    doc.text(`Month: ${month}`, 20, 60);
    doc.text(`Amount: ₹${amount}`, 20, 70);
    doc.text(`Date: ${dayjs().format('YYYY-MM-DD')}`, 20, 80);

    const blob: Blob = doc.output('blob');
    return URL.createObjectURL(blob);
  };

  interface HandleApproveSlip extends Slip {}

  interface HandleApprove {
    (slip: HandleApproveSlip): void;
  }

  const handleApprove: HandleApprove = (slip) => {
    const newPdfLinks: { [key: string]: string } = {};
    for (const month of slip.months) {
      const amount = selectedSlip?.amounts?.[month] || 0;
      newPdfLinks[month] = generatePdf(slip.name, month, amount);
    }

    const updatedSlip: Slip = {
      ...slip,
      amounts: selectedSlip?.amounts || {},
      status: 'Approved',
      pdfLinks: newPdfLinks,
    };
    setSlips((prev: Slip[]) => prev.map((s: Slip) => (s.id === slip.id ? updatedSlip : s)));
    setSelectedSlip(null);
  };

  interface PdfLinks {
    [key: string]: string;
  }


  interface ColumnsProps {
    title: string;
    dataIndex?: string;
    render?: (value: any, record: Slip, index: number) => React.ReactNode;
  }

  const columns: ColumnsProps[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Months',
      dataIndex: 'months',
      render: (months: string[]) => months.map((m: string) => <Tag key={m}>{m}</Tag>),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'Approved' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Action',
      render: (_: any, slip: Slip) => (
        <Space>
          {role === 'Admin' && slip.status === 'Pending' && (
            <Button
              type="primary"
              onClick={() => setSelectedSlip(slip)}
            >
              Approve
            </Button>
          )}
          {role === 'Employee' && slip.status === 'Approved' &&
            slip.pdfLinks &&
            Object.entries(slip.pdfLinks).map(([month, url]) => (
              <Button
                icon={<DownloadOutlined />}
                href={url as string}
                download={`SalarySlip-${slip.name}-${month}.pdf`}
                key={month}
              >
                {month}
              </Button>
            ))}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<FileAddOutlined />} onClick={showModal}>
          Request Slip
        </Button>
        <Button onClick={() => setRole(role === 'Employee' ? 'Admin' : 'Employee')} style={{ marginLeft: 8 }}>
          Switch to {role === 'Employee' ? 'Admin' : 'Employee'} View
        </Button>
      </div>

      <Table columns={columns} dataSource={slips} rowKey="id" />

      <Modal
        title="Request Salary Slip"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Submit"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}> 
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item label="Select Mode" name="mode" initialValue="single">
  <Radio.Group>
    <Radio value="single">One Month</Radio>
    <Radio value="multiple">Multiple Months</Radio>
  </Radio.Group>
</Form.Item>

<Form.Item
  shouldUpdate={(prev, curr) => prev.mode !== curr.mode}
  noStyle
>
  {({ getFieldValue }) => {
    const mode = getFieldValue('mode');
    return (
      <Form.Item
        label="Select Month(s)"
        name="months"
        rules={[{ required: true, message: 'Please select month(s)' }]}
      >
        {mode === 'multiple' ? (
          <DatePicker.RangePicker picker="month" style={{ width: '100%' }} />
        ) : (
          <DatePicker picker="month" style={{ width: '100%' }} />
        )}
      </Form.Item>
    );
  }}
</Form.Item>

        </Form>
      </Modal>

      <Modal
        title="Approve Salary Slip"
        open={!!selectedSlip}
        onCancel={() => setSelectedSlip(null)}
        onOk={() => selectedSlip && handleApprove(selectedSlip)}
        okText="Approve"
      >
        <Form
          layout="vertical"
          onValuesChange={(changed, all) =>
            setSelectedSlip((prev) =>
              prev
                ? { ...prev, amounts: all.amounts }
                : null
            )
          }
        >
          {selectedSlip?.months.map((month) => (
            <Form.Item
              key={month}
              label={`Amount for ${month}`}
              name={['amounts', month]}
              rules={[{ required: true, message: 'Enter amount' }]}
            >
              <Input type="number" placeholder="e.g. 25000" />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
};

export default SalarySlip;
