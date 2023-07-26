import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { mockingData } from './helpers/mockingData';
import { EditIcon, PauseIcon, PlayIcon, StopIcon, TrashIcon } from '../../shared/assets/svgs';
import { Button } from "primereact/button";
import { COLORS } from '../../themes';
import Pagination from '../Pagination/Pagination';
import { ACTIONS, API_METHODS, DB_COLLECTION_NAMES } from './helpers/constants';
import moment from 'moment';
import { db } from '../../firebase-config';
import {  getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { formatSeconds } from './helpers/utils';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

interface Props {
}

interface Trackers {
  id: string,
  createTime: number
  description: string
  timetracked: number
  isCurrentlyTracking?: boolean
}

interface SaveEditData {
  id: string,
  description: string
  timetracked: number
  isOpened?: boolean
  error: boolean
  action: string
}

const Trackers: React.FC<Props> = () => { 
  const trackersUnfinishCollectionRef = collection(db, DB_COLLECTION_NAMES.unfinishedTimetrackers);
  const trackersFinishedCollectionRef = collection(db, DB_COLLECTION_NAMES.finishedTimetrackers);
  const [trackers, setTrackers] = useState<Trackers[]>([]);
  const [saveEditData, setSaveEditData] = useState<SaveEditData>({
    isOpened: false,
    id: "",
    description: "",
    timetracked: 0,
    error: false,
    action: API_METHODS.post
  });
  const [triggerRender, setTriggerRender] = useState(0);
  const intervalRef = React.useRef<number | undefined>(undefined);

  useEffect(() => {
    fetchData();
  }, []) 

  const fetchData = async () => {
    try {
      const data = await getDocs(trackersUnfinishCollectionRef);
      const filteredData = data.docs.map((doc) => ({description: doc.data().description, timetracked: doc.data().timetracked, createTime: doc.data().createTime.seconds * 1000, id: doc.id}));
      setTrackers(filteredData);
    } catch (err) {
      console.log(err);
      return []
    }
  }

  const addUnfinishedTracker = async (data: SaveEditData) => {
      try {
        await addDoc(trackersUnfinishCollectionRef, {
          createTime: new Date().toISOString(),
          description: data.description,
          timetracked: 0,
        });
        setSaveEditData({
          ...saveEditData,
          isOpened: false
        });
        fetchData();
      } catch (err) {
        console.log(err);
      }
  }

  const editUnfinishedTracker = async (data: SaveEditData) => {
      try {
        const trackerDoc = doc(db, DB_COLLECTION_NAMES.unfinishedTimetrackers, data.id);
        await updateDoc(trackerDoc, {description: data.description, timetracked: data.timetracked});
        setSaveEditData({
          ...saveEditData,
          isOpened: false
        });
        fetchData();
      } catch (err) {
        console.log(err);
      }
  }

  const deleteUnfinishedTracker = async (tracker: Trackers) => {
    const trackerDoc = doc(db, DB_COLLECTION_NAMES.unfinishedTimetrackers, tracker.id);
    await deleteDoc(trackerDoc);
    fetchData();
  }

  const addFinishedTracker = async (tracker: Trackers) => {
      try {
       await addDoc(trackersFinishedCollectionRef, {
          createTime: new Date().toISOString(),
          description: tracker.description,
          timetracked: tracker.timetracked,
        });
        const trackerDoc = doc(db, DB_COLLECTION_NAMES.unfinishedTimetrackers, tracker.id);
        await deleteDoc(trackerDoc);
        fetchData();
      } catch (err) {
        console.log(err);
      }
  }

const onClickIcon = (rowData: Trackers, action: string) => {
  let clonedTrackers = JSON.parse(JSON.stringify(trackers));
  let match = clonedTrackers.find((item: Trackers) => item.id === rowData.id);
  switch (action) {
    case ACTIONS.play:
      clonedTrackers.forEach((item: Trackers) => {
        if (item.id === rowData.id) {
          item.isCurrentlyTracking = true;
          clearInterval(intervalRef.current);
          intervalRef.current =  window.setInterval(() => {
                item.timetracked += 1;
                setTriggerRender((prevTimer) => prevTimer + 1);
              }, 1000);      
        } else {
          item.isCurrentlyTracking = false; 
        }
      })
      setTrackers(clonedTrackers);
      break;
      case ACTIONS.pause:
      if (match) {
      match.isCurrentlyTracking = false;
      }
      clearInterval(intervalRef.current);
      setTrackers(clonedTrackers);
      break;
      case ACTIONS.stop:
        if (match) {
          if (match.isCurrentlyTracking) {
            clearInterval(intervalRef.current);
            match.isCurrentlyTracking = false;
            setTrackers(clonedTrackers);
          }
          const newTrackers = clonedTrackers.filter((item: Trackers) => item.id !== match.id);
          addFinishedTracker(match);
        }   
        break;
        case ACTIONS.delete:
        if (match) {
          
          deleteUnfinishedTracker(match);
        }   
        break;
        case ACTIONS.edit:
        if (match) {          
          setSaveEditData({
            ...saveEditData,
            isOpened: true,
            id: match.id,
            description: match.description,
            timetracked: match.timetracked,
            error: false,
            action: API_METHODS.put
          })
        }   
        break;
        default:
          break;
  } 
}

const handleSaveEditSubmit = () => {
    if (!saveEditData.description.length) return setSaveEditData({
      ...saveEditData,
      error: true
    });
    saveEditData.action === API_METHODS.post ? addUnfinishedTracker(saveEditData) : editUnfinishedTracker(saveEditData)
    setSaveEditData({
      ...saveEditData,
      error: true
    });
}

const bodyTemplate = (rowData: Trackers) => {
  return (
    <div style={{display: "flex", justifyContent: "space-between", width: "200px"}}>
      {rowData.isCurrentlyTracking ? <PauseIcon key="2" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData, ACTIONS.pause)}/> : 
      <PlayIcon key="1" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData, ACTIONS.play)}/>
      }
      <StopIcon key="3" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData, ACTIONS.stop)}/>
      <EditIcon key="4" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData, ACTIONS.edit)}/>
      <TrashIcon key="5" style={{cursor: "pointer"}} onClick={() => onClickIcon(rowData, ACTIONS.delete)}/>
    </div>
  );
}

  return (
<div style={{display: "flex", flexDirection: "column"}} >
  <h4><i className="pi pi-calendar" style={{ fontSize: '1.5rem', marginRight: "1.25rem" }}></i>Today (1.12.2021.)</h4>
  <div style={{textAlign: "end"}}>
    <Button label="Start new timer" icon="pi pi-stopwatch" style={{background: COLORS.orange, outline: "none !important"}} onClick={() => setSaveEditData({
        ...saveEditData,
        isOpened: true
      })} />
    <Button label="Stop all" icon="pi pi-stop-circle" style={{background: COLORS.blue, outline: "none !important"}}></Button>
  </div>
  <div className="card">
    <DataTable value={trackers}  responsiveLayout="stack" breakpoint="578px"> 
      <Column field="timetracked" header="Time logged" body={(rowData) => formatSeconds(rowData.timetracked)}/>
      <Column field="description" header="Description" style={{width: "50%"}}/>
      <Column field="actions" header="Actions" body={bodyTemplate}></Column>
    </DataTable>
  </div>    
  <Pagination data={{first: 0, rows: 6, totalRecords: 6, onPageChange: () => null}} />
  <Dialog visible={saveEditData.isOpened} onHide={() => setSaveEditData({
        isOpened: false,
        id: "",
        description: "",
        timetracked: 0,
        error: false,
        action: API_METHODS.post
      })} >
  <span className="p-float-label">
    <h5>Description</h5>
      <InputText
      style={{width: "320px", }}
      id="Description"
      name="description"
      value={saveEditData.description}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setSaveEditData({
        ...saveEditData,
        description: e.target.value
      })
      }
      autoFocus
      className={classNames({
        "p-invalid": saveEditData.error
      })}
      />
    
      </span>
      <Button label=" Add / Edit" style={{background: COLORS.blue, outline: "none !important", marginTop: "20px"}} onClick={() => handleSaveEditSubmit()}/>
  </Dialog>
  
</div>
  );
};

export default Trackers;   