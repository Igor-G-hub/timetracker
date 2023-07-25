import React from 'react';
import { Paginator } from 'primereact/paginator';
import { paginationTemplate } from './paginationTemplate';

interface Props {
    data: {
        first: number,
        rows: number,
        totalRecords: number,
        onPageChange(event: {}): void;
    }
}

const Pagination: React.FC<Props> = ({data}) => {
    const {first, rows, totalRecords, onPageChange} = data;
  return (
    <Paginator template={paginationTemplate} first={first} rows={rows} totalRecords={totalRecords} onPageChange={onPageChange} />
  );
};

export default Pagination;