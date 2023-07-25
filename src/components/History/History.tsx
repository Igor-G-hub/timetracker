import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { mockingData } from './helpers/mockingData';
import { EditIcon, PauseIcon, PlayIcon, StopIcon, TrashIcon } from '../../shared/assets/svgs';
import { Button } from "primereact/button";
import { COLORS } from '../../themes';
import Pagination from '../Pagination/Pagination';
import Filters from './Filters/Filters';

interface Props {
}

const History: React.FC<Props> = () => {



const onClickIcon = (rowData: {}) => {
  console.log(rowData);
}

const bodyTemplate = (rowData: {}) => {
  return (
    <div style={{display: "flex", justifyContent: "space-between", width: "100px"}}>
      <EditIcon key="1" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData)}/>
      <TrashIcon key="2" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData)}/>
    </div>
  );
}

  return (
<div style={{display: "flex", flexDirection: "column"}} >
  <h4>Trackers history</h4>
 <Filters />
  <div className="card mt-5">
    <DataTable value={mockingData}  responsiveLayout="stack" breakpoint="578px"> 
      <Column field="date" header="Date" />
      <Column field="description" header="Description" style={{width: "50%"}}/>
      <Column field="timetracked" header="Time tracked" />
      <Column field="actions" header="Actions" body={bodyTemplate}></Column>
    </DataTable>
  </div>    
  <Pagination data={{first: 0, rows: 6, totalRecords: 6, onPageChange: () => null}} />
</div>
  );
};

export default History;   