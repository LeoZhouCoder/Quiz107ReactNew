import React, { useEffect } from 'react';
import { Drawer, Button, Form } from 'antd';
import PropTypes from 'prop-types';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default function DrawerForm({ visible, title, fields, data, onClose, onSave, width = 400 }) {
  const [formInstance] = Form.useForm();

  const onClickSave = () => {
    formInstance
      .validateFields()
      .then((values) => onSave({ ...data, ...values }))
      .catch(() => {});
  };

  useEffect(() => {
    if (visible) formInstance.setFieldsValue(data);
  });

  return (
    <Drawer
      title={title}
      width={width}
      onClose={onClose}
      visible={visible}
      forceRender
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={onClickSave} type="primary">
            Save
          </Button>
        </div>
      }
    >
      <Form {...layout} form={formInstance}>
        {fields.map((field) => (
          <Form.Item
            key={field.dataIndex}
            name={field.dataIndex}
            label={field.title}
            rules={[{ required: field.required, message: field.message }]}
          >
            {field.renderField(formInstance.getFieldValue(field.dataIndex))}
          </Form.Item>
        ))}
      </Form>
    </Drawer>
  );
}

DrawerForm.defaultProps = {
  width: 400,
  data: null,
  title: 'Title',
};

DrawerForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string,
      required: PropTypes.bool,
      message: PropTypes.string,
      defaultValue: PropTypes.any,
      renderField: PropTypes.func.isRequired,
    }),
  ).isRequired,
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  width: PropTypes.number,
};
