import React, {useEffect, useState} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { mockingData } from './helpers/mockingData';
import { EditIcon, PauseIcon, PlayIcon, StopIcon, TrashIcon } from '../../shared/assets/svgs';
import { Button } from "primereact/button";
import { COLORS } from '../../themes';
import Pagination from '../Pagination/Pagination';
import Filters from './Filters/Filters';
import { db } from '../../firebase-config';
import { getDoc, getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { DB_COLLECTION_NAMES } from '../Trackers/helpers/constants';
import moment from 'moment';
import { formatSeconds } from '../Trackers/helpers/utils';

interface Props {
}

const History: React.FC<Props> = () => {
  interface Trackers {
    id: string,
    createTime: number
    description: string
    timetracked: number
    isCurrentlyTracking?: boolean
  }

  const trackersFinishedCollectionRef = collection(db, DB_COLLECTION_NAMES.finishedTimetrackers);
  const [trackers, setTrackers] = useState<Trackers[]>([]);

  useEffect(() => {
    fetchData();
  }, []) 

  const fetchData = async () => {
    try {
      const data = await getDocs(trackersFinishedCollectionRef);
      const filteredData = data.docs.map((doc) => ({description: doc.data().description, timetracked: doc.data().timetracked, createTime: doc.data().createTime.seconds * 1000, id: doc.id}));
      setTrackers(filteredData);
    } catch (err) {
      console.log(err);
      return []
    }
  }




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
    <DataTable value={trackers}  responsiveLayout="stack" breakpoint="578px"> 
      <Column field="date" header="Date" body={(rowData) => moment(rowData.createTime).format("DD.MM.YYYY.")} />
      <Column field="description" header="Description" style={{width: "50%"}}/>
      <Column field="timetracked" header="Time tracked" body={(rowData) => formatSeconds(rowData.timetracked)} />
      <Column field="actions" header="Actions" body={bodyTemplate}></Column>
    </DataTable>
  </div>    
  <Pagination data={{first: 0, rows: 6, totalRecords: 6, onPageChange: () => null}} />
</div>
  );
};

export default History;   