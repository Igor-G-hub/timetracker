import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { mockingData } from './mockingData';
import { EditIcon, PauseIcon, PlayIcon, StopIcon, TrashIcon } from '../../shared/assets/svgs';

interface Props {
  // Props interface goes here
}

const Trackers: React.FC<Props> = ({ /* Destructure your props here */ }) => {

  return (
    <div>  <div className="card">
    <DataTable value={mockingData}  responsiveLayout="stack" breakpoint="578px">
        <Column field="timeLogged" header="Time logged" />
        <Column field="description" header="Description" style={{width: "50%"}}/>
        <Column field="actions" header="Actions" body={[<PauseIcon/>, <PlayIcon/>, <StopIcon/>, <EditIcon/>, <TrashIcon/>]}></Column>
    </DataTable>
</div></div>
  );
};

export default Trackers;