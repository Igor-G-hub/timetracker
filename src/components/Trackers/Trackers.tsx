import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { mockingData } from './helpers/mockingData';
import { EditIcon, PauseIcon, PlayIcon, StopIcon, TrashIcon } from '../../shared/assets/svgs';
import { Button } from "primereact/button";
import { COLORS } from '../../themes';
import Pagination from '../Pagination/Pagination';

interface Props {
}

const Trackers: React.FC<Props> = () => {



const onClickIcon = (rowData: {}) => {
  console.log(rowData);
}

const bodyTemplate = (rowData: {}) => {
  return (
    <div style={{display: "flex", justifyContent: "space-between", width: "200px"}}>
      <PauseIcon key="1" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData)}/>
      <PlayIcon key="2" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData)}/>
      <StopIcon key="3" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData)}/>
      <EditIcon key="4" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData)}/>
      <TrashIcon key="5" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData)}/>
    </div>
  );
}

  return (
<div style={{display: "flex", flexDirection: "column"}} >
  <h4><i className="pi pi-calendar" style={{ fontSize: '1.5rem', marginRight: "1.25rem" }}></i>Today (1.12.2021.)</h4>
  <div style={{textAlign: "end"}}>
    <Button label="Start new timer" icon="pi pi-stopwatch" style={{background: COLORS.orange, outline: "none !important"}}/>
    <Button label="Stop all" icon="pi pi-stop-circle" style={{background: COLORS.blue, outline: "none !important"}}></Button>
  </div>
  <div className="card">
    <DataTable value={mockingData}  responsiveLayout="stack" breakpoint="578px"> 
      <Column field="timeLogged" header="Time logged" />
      <Column field="description" header="Description" style={{width: "50%"}}/>
      <Column field="actions" header="Actions" body={bodyTemplate}></Column>
    </DataTable>
  </div>    
  <Pagination data={{first: 0, rows: 6, totalRecords: 6, onPageChange: () => null}} />
</div>
  );
};

export default Trackers;   