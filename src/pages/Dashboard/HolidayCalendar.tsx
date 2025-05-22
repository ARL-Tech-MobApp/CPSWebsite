import React, { useState } from 'react';
import {
  Calendar,
  Badge,
  Popover,
  Typography,
  Card,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Popconfirm,
  message,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface Holiday {
  id: number;
  title: string;
  description: string;
  date: string;
  category: 'national' | 'religious' | 'regional' | 'festival' | 'working';
}

const getBadgeStatus = (category: string): any => {
  switch (category) {
    case 'national':
      return 'processing';
    case 'religious':
      return 'success';
    case 'regional':
      return 'warning';
    case 'festival':
      return 'error';
    case 'working':
      return 'default';
    default:
      return 'default';
  }
};

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [form] = Form.useForm();

  const isAdmin = true;

  const handleSubmit = (values: any) => {
    const newHoliday: Holiday = {
      id: editingHoliday ? editingHoliday.id : holidays.length + 1,
      title: values.title,
      description: values.description,
      date: values.date.format('YYYY-MM-DD'),
      category: values.category,
    };

    if (editingHoliday) {
      setHolidays((prev) =>
        prev.map((h) => (h.id === editingHoliday.id ? newHoliday : h))
      );
      message.success('Holiday updated successfully!');
    } else {
      setHolidays([...holidays, newHoliday]);
      message.success('Holiday added successfully!');
    }

    setModalOpen(false);
    form.resetFields();
    setEditingHoliday(null);
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    form.setFieldsValue({
      ...holiday,
      date: dayjs(holiday.date),
    });
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
    message.success('Holiday deleted!');
  };

  const getListData = (date: dayjs.Dayjs) => {
    const currentDate = date.format('YYYY-MM-DD');
    return holidays.filter((holiday) => holiday.date === currentDate);
  };

  const isThirdSaturday = (date: dayjs.Dayjs): boolean => {
    const day = date.date();
    const isSaturday = date.day() === 6;
    let saturdayCount = 0;

    for (let i = 1; i <= day; i++) {
      if (dayjs(date).date(i).day() === 6) {
        saturdayCount++;
      }
    }

    return isSaturday && saturdayCount === 3;
  };

  const dateCellRender = (value: dayjs.Dayjs) => {
    const listData = getListData(value);
    const isSunday = value.day() === 0;
    const isThirdSat = isThirdSaturday(value);

    const isWorkingOverride = listData.some(
      (item) => item.category === 'working'
    );

    let backgroundColor = 'white';
     if (isThirdSat && !isWorkingOverride) backgroundColor = '#fff1b8'; // yellow
    else if (isWorkingOverride) backgroundColor = '#d9f7be'; // green

    return (
      <div
        style={{
          backgroundColor,
          borderRadius: 8,
          padding: 4,
          minHeight: 30,
        }}
      >
          {isSunday && (
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            fontSize: 16,
          }}
          title="Sunday Holiday"
        >
          💤
        </div>
      )}
        {listData.map((item, index) => (
          <div key={index}>
            <Popover
              content={
                <div>
                  <strong>{item.description}</strong>
                  <br />
                  {isAdmin && (
                    <Space style={{ marginTop: 8 }}>
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(item)}
                      />
                      <Popconfirm
                        title="Delete this holiday?"
                        onConfirm={() => handleDelete(item.id)}
                      >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                      </Popconfirm>
                    </Space>
                  )}
                </div>
              }
              title={item.title}
            >
              <Badge status={getBadgeStatus(item.category)} text={item.title} />
            </Popover>
          </div>
        ))}

        {isWorkingOverride && (
          <Tag
            icon={<CheckCircleOutlined />}
            color="green"
            style={{ marginTop: 6 }}
          >
            Working Day
          </Tag>
        )}

        {isThirdSat && !isWorkingOverride && (
          <Tag color="red" style={{ marginTop: 6 }}>
            3rd Saturday Off
          </Tag>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '40px' }}>
      <Card
        title={
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Title level={3} style={{ margin: 0 }}>
              📅 Company Holiday Calendar
            </Title>
            {isAdmin && (
              <Button type="primary" onClick={() => setModalOpen(true)}>
                + Add Holiday
              </Button>
            )}
          </div>
        }
        bordered={false}
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 16,
        }}
      >
        <Calendar dateCellRender={dateCellRender} />
      </Card>

      <Modal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingHoliday(null);
          form.resetFields();
        }}
        title={editingHoliday ? 'Edit Holiday' : 'Add Holiday'}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Holiday Title"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Diwali 🪔" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Details about the holiday..." />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select holiday category">
              <Option value="national">🇮🇳 National</Option>
              <Option value="religious">🙏 Religious</Option>
              <Option value="regional">🌍 Regional / Odia</Option>
              <Option value="festival">🎉 Festival / Other</Option>
              <Option value="working">✅ Working Saturday Override</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingHoliday ? 'Update' : 'Add'} Holiday
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HolidayCalendar;
