import React, { useState } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, message } from 'antd';
import dayjs from 'dayjs';
import GenericTable from '../../components/GenericTable';
import { CheckCircleTwoTone, ClockCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';


const { RangePicker } = DatePicker;
const { TextArea } = Input;
interface LeaveData {
    key: number;
    title: string;
    leaveType: string;
    from: string;
    to: string;
    days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    toWhom: string[]; // <- New field
  }
  
  interface ApplyLeaveFormValues {
    title: string;
    leaveType: string;
    dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    reason: string;
    toWhom: string[]; // <- New field
  }
  

const leaveTypes = [
  { label: 'Sick Leave', value: 'sick' },
  { label: 'Casual Leave', value: 'casual' },
  { label: 'Earned Leave', value: 'earned' },
];

// Simulate admin auth (adjust based on real auth)
const isAdmin = true;

const ApplyLeave: React.FC = () => {
  const [form] = Form.useForm();
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [leaveDuration, setLeaveDuration] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [viewingLeave, setViewingLeave] = useState<LeaveData | null>(null);

  const handleDateChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    if (
      dates &&
      dates.length === 2 &&
      dates[0] !== null &&
      dates[1] !== null
    ) {
      const duration = dates[1].diff(dates[0], 'day') + 1;
      setLeaveDuration(duration);
    } else {
      setLeaveDuration(0);
    }
  };

  const onFinish = (values: ApplyLeaveFormValues) => {
    const { title, leaveType, dateRange, reason, toWhom } = values;
    const newLeave: LeaveData = {
      key: Date.now(),
      title,
      leaveType,
      from: dateRange[0].format('YYYY-MM-DD'),
      to: dateRange[1].format('YYYY-MM-DD'),
      days: dateRange[1].diff(dateRange[0], 'day') + 1,
      reason,
      toWhom,
      status: 'pending',
    };
    setLeaveData([...leaveData, newLeave]);
    message.success('Leave applied successfully!');
    form.resetFields();
    setLeaveDuration(0);
    setShowForm(false);
  };
  

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' as keyof LeaveData },
    { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType' as keyof LeaveData },
    { title: 'From', dataIndex: 'from', key: 'from' as keyof LeaveData },
    { title: 'To', dataIndex: 'to', key: 'to' as keyof LeaveData },
    { title: 'To Whom', dataIndex: 'toWhom', key: 'toWhom' as keyof LeaveData, render: (row: LeaveData) => row.toWhom.join(', ') },
    { title: "Applied Date", dataIndex: "appliedDate", key: "appliedDate" as keyof LeaveData, render: () => new Date().toLocaleDateString() }, // Assuming applied date is today
    { title: 'Days', dataIndex: 'days', key: 'days' as keyof LeaveData },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status' as keyof LeaveData,
        render: (row: LeaveData) => {
          switch (row.status) {
            case 'approved':
              return (
                <span style={{ color: 'green' }}>
                  <CheckCircleTwoTone twoToneColor="#52c41a" /> Approved
                </span>
              );
            case 'rejected':
              return (
                <span style={{ color: 'red' }}>
                  <CloseCircleTwoTone twoToneColor="#ff4d4f" /> Rejected
                </span>
              );
            case 'pending':
            default:
              return (
                <span style={{ color: 'orange' }}>
                  <ClockCircleTwoTone twoToneColor="#faad14" /> Pending
                </span>
              );
          }
        }
      }
      ,
   
  ];
const toWhom=[
    { label: 'HR', value: 'hr' },
    { label: 'Manager', value: 'manager' },
    { label: 'Team Lead', value: 'teamlead' },
    { label: 'Department Head', value: 'depthead' },
    { label: 'Project Manager', value: 'pm' },
    { label: 'Admin', value: 'admin' },
    { label: 'Director', value: 'director' },
    { label: 'CEO', value: 'ceo' },
]

  // Handle View button
  const handleView = (record: LeaveData) => {
    if (isAdmin) {
      setViewingLeave(record); // Show details panel instead of modal
    } else {
      message.info(`Leave titled "${record.title}" is currently "${record.status}".`);
    }
  };
  const updateStatus = (newStatus: 'approved' | 'rejected') => {
    if (!viewingLeave) return;
    const updated = leaveData.map((leave) =>
      leave.key === viewingLeave.key ? { ...leave, status: newStatus } : leave
    );
    setLeaveData(updated);
    message.success(`Leave ${newStatus}`);
    setViewingLeave(null);
  };
  
  // When viewing details, hide the table and form for focus, or you can do a side by side layout
  return (
    <>
      {!showForm && !viewingLeave && (
        <GenericTable
          btnTitle="Apply New"
          onAdd={() => setShowForm(true)}
          rowsPerPage={5}
          columns={columns}
          data={leaveData}
          onView={handleView}
        />
      )}

      {showForm && (
        <Card
          title="Apply for Leave"
          style={{
            width: '100%',
            margin: 'auto',
            marginTop: 40,
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ marginBottom: 32 }}
          >
            <Form.Item
  name="toWhom"
  label="To Whom (Select Recipients)"
  rules={[{ required: true, message: 'Please select at least one recipient' }]}
>
  <Select
    mode="multiple"
    placeholder="Select people to send leave to"
    options={toWhom}
  />
</Form.Item>

            <Form.Item
              name="title"
              label="Leave Title"
              rules={[{ required: true, message: 'Please enter a title for your leave' }]}
            >
              <Input placeholder="Enter title (e.g., Medical Emergency)" />
            </Form.Item>

            <Form.Item
              name="leaveType"
              label="Leave Type"
              rules={[{ required: true, message: 'Please select a leave type' }]}
            >
              <Select placeholder="Select leave type" options={leaveTypes} />
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Leave Dates"
              rules={[{ required: true, message: 'Please select leave dates' }]}
            >
              <RangePicker onChange={handleDateChange} style={{ width: '100%' }} />
            </Form.Item>

            {leaveDuration > 0 && (
              <div style={{ marginBottom: 16, color: '#1890ff' }}>
                You are applying for <strong>{leaveDuration}</strong> day(s).
              </div>
            )}

            <Form.Item
              name="reason"
              label="Reason for Leave"
              rules={[{ required: true, message: 'Please enter reason' }]}
            >
              <TextArea rows={8} placeholder="Enter reason for leave" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Apply Leave
              </Button>
            </Form.Item>

            <Form.Item>
              <Button block onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {viewingLeave && (
        <Card
          title={`${viewingLeave.title} (${viewingLeave.status.toUpperCase()})`}
          style={{
            width: "100%",
            margin: '40px auto',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            backgroundColor: '#fafafa',
            padding: '24px',
          }}
          extra={
            <Button type="default" onClick={() => setViewingLeave(null)}>
              Back to List
            </Button>
          }
        > <p><strong>Dear Respected</strong> {viewingLeave.toWhom.join(', ')}</p>
        <p><strong>Leave Type:</strong> {viewingLeave.leaveType}</p>
        <p><strong>From:</strong> {viewingLeave.from}</p>
        <p><strong>To:</strong> {viewingLeave.to}</p>
        <p><strong>Days:</strong> {viewingLeave.days}</p>
        <p><strong>Status:</strong> {viewingLeave.status}</p>
        <p><strong>Reason:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap', backgroundColor: '#fff', padding: 12, borderRadius: 8, border: '1px solid #ddd' }}>
          {viewingLeave.reason}
        </p>
      
        {viewingLeave.status === 'pending' && (
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <Button type="primary" onClick={() => updateStatus('approved')}>
              Approve
            </Button>
            <Button danger onClick={() => updateStatus('rejected')}>
              Reject
            </Button>
          </div>
        )}
        </Card>
      )}
    </>
  );
};

export default ApplyLeave;
