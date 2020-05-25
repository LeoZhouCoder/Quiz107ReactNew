import React, { useState, useEffect } from 'react';
import { Table, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './index.less';

export default function BasicTable({
  columns,
  pageSizeOptions,
  loading,
  tableState,
  data,
  onChange,
  onSearch,
  onAdd,
}) {
  const [initialized, setInitialized] = useState(false);
  let totalWidth = 0;
  columns.forEach((column) => {
    totalWidth += column.width;
    // eslint-disable-next-line no-param-reassign
    column.sortOrder = tableState.sortKey === column.dataIndex ? tableState.sortOrder : false;
  });
  const scroll = { x: totalWidth + 50 };

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    onChange({ pageSize: pageSizeOptions[0] }, true);
  });

  const handleSearchChange = (e) => {
    onChange({ search: e.target.value }, false);
  };

  const handleTableChange = (pagination, _, sorter) => {
    const { order, field } = sorter;
    let { current } = pagination;
    if (
      current === tableState.current &&
      (field !== tableState.sortKey || order !== tableState.sortOrder)
    ) {
      current = 1;
    }
    const values = {
      current,
      pageSize: pagination.pageSize,
      sortKey: field,
      sortOrder: order,
    };
    onChange(values, true);
  };

  return (
    <div className={styles.tableContainer}>
      <Table
        title={() => (
          <div>
            <Button type="primary" ghost onClick={onAdd}>
              Add
            </Button>
            <Input
              placeholder="Search"
              value={tableState.search}
              allowClear
              style={{ width: 200, float: 'right' }}
              onChange={handleSearchChange}
              onPressEnter={onSearch}
              suffix={<SearchOutlined onClick={onSearch} />}
            />
          </div>
        )}
        columns={columns}
        scroll={scroll}
        dataSource={data}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          hideOnSinglePage: true,
          current: tableState.current,
          pageSizeOptions,
          pageSize: tableState.pageSize,
          total: tableState.total,
        }}
      />
    </div>
  );
}

BasicTable.defaultProps = {
  pageSizeOptions: [5, 10, 20, 50],
};

BasicTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string,
      key: PropTypes.string.isRequired,
      sorter: PropTypes.bool,
      sortOrder: PropTypes.any,
      fixed: PropTypes.string,
      width: PropTypes.number.isRequired,
      render: PropTypes.func,
    }),
  ).isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  loading: PropTypes.bool.isRequired,
  tableState: PropTypes.shape({
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    search: PropTypes.string,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.oneOf(['descend', 'ascend', undefined, false]),
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};
