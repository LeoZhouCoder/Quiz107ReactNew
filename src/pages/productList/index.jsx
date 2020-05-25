import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, InputNumber, Input, Select } from 'antd';

import BasicTable from '@/components/BasicTable';
import DrawerForm from '@/components/DrawerForm';

import { getProducts, addProduct, editProduct } from './service';

const PRODUCT_TYPES = ['Hardware', 'Software'];

const FIELDS = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    width: 100,
    fixed: 'left',

    required: true,
    message: 'Name is required',
    defaultValue: '',
    renderField: (value) => <Input placeholder="Name" value={value} />,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    sorter: true,
    width: 100,
    render: (text) => `$${parseFloat(text).toFixed(2)}`,

    required: true,
    message: 'Price is required',
    defaultValue: 0,
    renderField: () => (
      <InputNumber
        min={0}
        formatter={(number) => `$${parseFloat(number).toFixed(2)}`}
        step={0.01}
      />
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 100,

    required: true,
    message: 'Type is required',
    defaultValue: PRODUCT_TYPES[0],
    renderField: (value) => (
      <Select placeholder="Type" value={value}>
        {PRODUCT_TYPES.map((productType) => (
          <Select.Option key={productType} value={productType}>
            {productType}
          </Select.Option>
        ))}
      </Select>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 200,

    defaultValue: '',
    renderField: (value) => <Input.TextArea rows={6} placeholder="Description" value={value} />,
  },
];

const ProductList = () => {
  const [loading, setLoading] = useState(false);
  const [tableState, setTableState] = useState({ total: 0, pageSize: 0, current: 1 });
  const [tableData, setTableData] = useState([]);
  const [drawerState, setDrawerState] = useState({ type: null });

  const actionColumn = {
    title: 'Action',
    key: 'action',
    width: 100,
    fixed: 'right',
    render: (_, record) => (
      <Button onClick={() => setDrawerState({ type: 'edit', title: 'Edit', data: record })}>
        Edit
      </Button>
    ),
  };
  const columns = [...FIELDS, actionColumn];

  const callService = async (fun, params) => {
    setLoading(true);
    try {
      const { total, products, queryOptions } = await fun(params);
      const { pageSize, current, search, sortKey, sortOrder } = queryOptions;
      const newState = { pageSize, current, search, sortKey, sortOrder, total };
      setTableState(newState);
      setTableData(products);
    } catch (error) {
      console.error('Error');
    }
    setLoading(false);
  };

  const loadProducts = (states) => {
    callService(getProducts, states);
  };

  const onSearch = () => {
    loadProducts(tableState);
  };

  const onTableStateChange = (values, reload) => {
    const newState = { ...tableState, ...values };
    if (reload) {
      loadProducts(newState);
    } else {
      setTableState(newState);
    }
  };

  const onClickAdd = () => {
    const data = {};
    FIELDS.forEach((field) => {
      data[field.dataIndex] = field.defaultValue;
    });
    setDrawerState({ type: 'add', title: 'Add New', data });
  };

  const onSave = (product) => {
    const params = {
      queryOptions: { current: 1, pageSize: tableState.pageSize },
      product,
    };
    if (drawerState.type === 'add') {
      callService(addProduct, params);
    } else {
      callService(editProduct, params);
    }
    setDrawerState({ type: null });
  };

  return (
    <PageHeaderWrapper>
      <BasicTable
        columns={columns}
        loading={loading}
        tableState={tableState}
        data={tableData}
        onChange={onTableStateChange}
        onSearch={onSearch}
        onAdd={onClickAdd}
      />
      <DrawerForm
        visible={drawerState.type !== null}
        title={drawerState.title}
        data={drawerState.data}
        fields={FIELDS}
        onClose={() => setDrawerState({ type: null })}
        onSave={onSave}
      />
    </PageHeaderWrapper>
  );
};

export default ProductList;
