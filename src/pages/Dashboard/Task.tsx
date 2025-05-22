import React, { useState } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

const statusColors = {
  Pending: 'orange',
  'In Progress': 'blue',
  Completed: 'green',
};

const Task = () => {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = (task: TaskType | null = null) => {
    setEditingTask(task);
    setModalVisible(true);
    if (task) {
      form.setFieldsValue({ ...task, dueDate: dayjs(task.dueDate) });
    } else {
      form.resetFields();
    }
  };

interface HandleDelete {
    (taskId: number): void;
}

const handleDelete: HandleDelete = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
};

interface HandleSubmitValues {
    title: string;
    assignee: string;
    dueDate: dayjs.Dayjs;
    status: keyof typeof statusColors;
}

const handleSubmit = (values: HandleSubmitValues) => {
    const newTask: Omit<TaskType, 'id'> = {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
    };

    if (editingTask) {
        setTasks(
            tasks.map((t: TaskType) => (t.id === editingTask.id ? { ...editingTask, ...newTask } : t))
        );
    } else {
        setTasks([...tasks, { ...newTask, id: Date.now() }]);
    }

    setModalVisible(false);
};

interface TaskType {
    id: number;
    title: string;
    assignee: string;
    dueDate: string;
    status: keyof typeof statusColors;
}

interface StatusColors {
    [key: string]: string;
}


const columns: ColumnsType<TaskType> = [
    {
        title: 'Title',
        dataIndex: 'title',
    },
    {
        title: 'Assigned To',
        dataIndex: 'assignee',
    },
    {
        title: 'Due Date',
        dataIndex: 'dueDate',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status: TaskType['status']) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
        title: 'Actions',
        render: (_: any, task: TaskType) => (
            <Space>
                <Button icon={<EditOutlined />} onClick={() => showModal(task)} />
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(task.id)} />
            </Space>
        ),
    },
];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 'bold' }}>Employee Task Manager</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => showModal()}
      >
        Add Task
      </Button>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />

      <Modal
        title={editingTask ? 'Edit Task' : 'Add Task'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText={editingTask ? 'Update' : 'Add'}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please enter a task title' }]}
          >
            <Input placeholder="e.g., Update project report" />
          </Form.Item>

          <Form.Item
            name="assignee"
            label="Assign To"
            rules={[{ required: true, message: 'Please select an employee' }]}
          >
            <Select placeholder="Select employee">
              <Option value="John Doe">John Doe</Option>
              <Option value="Jane Smith">Jane Smith</Option>
              <Option value="Amit Kumar">Amit Kumar</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select a due date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Task;
