import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { mockingData } from "./helpers/mockingData";
import {
  EditIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
} from "../../shared/assets/svgs";
import { Button } from "primereact/button";
import { COLORS } from "../../themes";
import Pagination from "../Pagination/Pagination";
import { ACTIONS, API_METHODS, DB_COLLECTION_NAMES } from "./helpers/constants";
import moment from "moment";
import { auth, db } from "../../firebase-config";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { formatSeconds } from "./helpers/utils";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useSelector } from "react-redux";
import { unfinishedTrackersSelector } from "../../redux/selectors/appSelector";
import store from "../../store";
import { SET_UNFINISHED_TRACKERS } from "../../redux/actionTypes/appActionType";

interface Props {}

interface Tracker {
  id: string;
  createTime: number;
  description: string;
  timetracked: number;
  isCurrentlyTracking?: boolean;
  userId?: string;
}

interface SaveEditData {
  id: string;
  description: string;
  timetracked: number;
  isOpened?: boolean;
  error: boolean;
  action: string;
}

const Trackers: React.FC<Props> = () => {
  const trackersUnfinishCollectionRef = collection(
    db,
    DB_COLLECTION_NAMES.unfinishedTimetrackers
  );
  const trackersFinishedCollectionRef = collection(
    db,
    DB_COLLECTION_NAMES.finishedTimetrackers
  );
  const trackers = useSelector(unfinishedTrackersSelector);
  const [saveEditData, setSaveEditData] = useState<SaveEditData>({
    isOpened: false,
    id: "",
    description: "",
    timetracked: 0,
    error: false,
    action: API_METHODS.post,
  });
  const [triggerRender, setTriggerRender] = useState(0);
  const intervalRef = React.useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!trackers.length) {
      processData();
    } else {
      const clonedTrackers = JSON.parse(JSON.stringify(trackers));
      startTimer(clonedTrackers);
    }
  }, []);

  const processData = async () => {
    setTrackers(await fetchData());
  };

  const setTrackers = (trackers: Tracker[]) => {
    store.dispatch({
      type: SET_UNFINISHED_TRACKERS,
      payload: {
        unfinishedTrackers: trackers,
      },
    });
  };

  const startTimer = (trackers: Tracker[]) => {
    clearInterval(intervalRef.current);
    let match = trackers.find((item: Tracker) => item.isCurrentlyTracking);
    if (match) {
      intervalRef.current = window.setInterval(() => {
        if (match) {
          match.timetracked += 1;
        }
        setTriggerRender((prev) => prev + 1);
      }, 1000);
    }
    setTrackers(trackers);
  };

  const fetchData = async () => {
    try {
      const q = query(
        trackersUnfinishCollectionRef,
        where("userId", "==", auth?.currentUser?.uid)
      );
      const data = await getDocs(q);
      return data.docs.map((doc) => ({
        description: doc.data().description,
        timetracked: doc.data().timetracked,
        createTime: doc.data().createTime,
        id: doc.id,
        userId: doc.data().userId,
      }));
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const updateCurrentStates = async (trackers: Tracker[]) => {
    trackers.forEach((tracker: Tracker) => {
      try {
        const trackerDoc = doc(
          db,
          DB_COLLECTION_NAMES.unfinishedTimetrackers,
          tracker.id
        );
        updateDoc(trackerDoc, {
          timetracked: tracker.timetracked,
        });
      } catch (err) {
        console.log(err);
      }
    });
  };

  const addUnfinishedTracker = async (data: SaveEditData) => {
    try {
      await addDoc(trackersUnfinishCollectionRef, {
        createTime: new Date().getTime(),
        description: data.description,
        timetracked: 0,
        userId: auth?.currentUser?.uid,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateUnfinishedTracker = async (data: SaveEditData) => {
    try {
      const trackerDoc = doc(
        db,
        DB_COLLECTION_NAMES.unfinishedTimetrackers,
        data.id
      );
      await updateDoc(trackerDoc, {
        description: data.description,
        timetracked: data.timetracked,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUnfinishedTracker = async (tracker: Tracker) => {
    const trackerDoc = doc(
      db,
      DB_COLLECTION_NAMES.unfinishedTimetrackers,
      tracker.id
    );
    await deleteDoc(trackerDoc);
  };

  const addFinishedTracker = async (tracker: Tracker) => {
    try {
      await addDoc(trackersFinishedCollectionRef, {
        createTime: new Date().getTime(),
        description: tracker.description,
        timetracked: tracker.timetracked,
        userId: auth?.currentUser?.uid,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onClickIcon = async (rowData: Tracker, action: string) => {
    let clonedTrackers = JSON.parse(JSON.stringify(trackers));
    let match = clonedTrackers.find((item: Tracker) => item.id === rowData.id);
    switch (action) {
      case ACTIONS.play:
        clonedTrackers.forEach((item: Tracker) => {
          if (item.id === rowData.id) {
            item.isCurrentlyTracking = true;
            startTimer(clonedTrackers);
          } else {
            item.isCurrentlyTracking = false;
          }
        });
        break;
      case ACTIONS.pause:
        if (match) {
          match.isCurrentlyTracking = false;
        }
        startTimer(clonedTrackers);
        break;
      case ACTIONS.stop:
        if (match) {
          if (match.isCurrentlyTracking) {
            match.isCurrentlyTracking = false;
          }
          await addFinishedTracker(match);
          const trackerDoc = doc(
            db,
            DB_COLLECTION_NAMES.unfinishedTimetrackers,
            match.id
          );
          await deleteDoc(trackerDoc);
          const filtered = clonedTrackers.filter(
            (item: Tracker) => item.id !== match.id
          );
          await updateCurrentStates(filtered);
          const data = await fetchData();
          const activeTracker = clonedTrackers.find(
            (item: Tracker) => !!item.isCurrentlyTracking
          );
          let newData: Tracker[] = [];
          if (activeTracker) {
            newData = JSON.parse(JSON.stringify(data));
            newData.forEach((item: Tracker) => {
              if (item.id === activeTracker.id) {
                item.isCurrentlyTracking = true;
              }
            });
          } else {
            newData = data;
          }
          startTimer(newData);
        }
        break;
      case ACTIONS.delete:
        if (match) {
          await deleteUnfinishedTracker(match);
          const filtered = clonedTrackers.filter(
            (item: Tracker) => item.id !== match.id
          );
          await updateCurrentStates(filtered);
          const data = await fetchData();
          const activeTracker = clonedTrackers.find(
            (item: Tracker) => !!item.isCurrentlyTracking
          );
          let newData: Tracker[] = [];
          if (activeTracker) {
            newData = JSON.parse(JSON.stringify(data));
            newData.forEach((item: Tracker) => {
              if (item.id === activeTracker.id) {
                item.isCurrentlyTracking = true;
              }
            });
          } else {
            newData = data;
          }
          startTimer(newData);
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
            action: API_METHODS.put,
          });
        }
        break;
      default:
        break;
    }
  };

  const handleSaveEditSubmit = async () => {
    if (!saveEditData.description.length)
      return setSaveEditData({
        ...saveEditData,
        error: true,
      });
    saveEditData.action === API_METHODS.post
      ? await addUnfinishedTracker(saveEditData)
      : await updateUnfinishedTracker(saveEditData);
    const clonedTrackers = JSON.parse(JSON.stringify(trackers));
    await updateCurrentStates(clonedTrackers);
    const data = await fetchData();
    const activeTracker = clonedTrackers.find(
      (item: Tracker) => !!item.isCurrentlyTracking
    );
    let newData: Tracker[] = [];
    if (activeTracker) {
      newData = JSON.parse(JSON.stringify(data));
      newData.forEach((item: Tracker) => {
        if (item.id === activeTracker.id) {
          item.isCurrentlyTracking = true;
        }
      });
    } else {
      newData = data;
    }
    startTimer(newData);
    setSaveEditData({
      isOpened: false,
      id: "",
      description: "",
      timetracked: 0,
      error: false,
      action: API_METHODS.post,
    });
  };

  const handleStopAll = async () => {
    const clonedTrackers = JSON.parse(JSON.stringify(trackers));
    clonedTrackers.forEach((tracker: Tracker) => {
      addFinishedTracker(tracker);
    });
    clonedTrackers.forEach((tracker: Tracker) => {
      deleteUnfinishedTracker(tracker);
    });
    setTrackers(await fetchData());
  };

  const bodyTemplate = (rowData: Tracker) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "200px",
        }}
      >
        {rowData.isCurrentlyTracking ? (
          <PauseIcon
            key="2"
            style={{ cursor: "pointer" }}
            onClick={() => onClickIcon(rowData, ACTIONS.pause)}
          />
        ) : (
          <PlayIcon
            key="1"
            style={{ cursor: "pointer" }}
            onClick={() => onClickIcon(rowData, ACTIONS.play)}
          />
        )}
        <StopIcon
          key="3"
          style={{ cursor: "pointer" }}
          onClick={() => onClickIcon(rowData, ACTIONS.stop)}
        />
        <EditIcon
          key="4"
          style={{ cursor: "pointer" }}
          onClick={() => onClickIcon(rowData, ACTIONS.edit)}
        />
        <TrashIcon
          key="5"
          style={{ cursor: "pointer" }}
          onClick={() => onClickIcon(rowData, ACTIONS.delete)}
        />
      </div>
    );
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", padding: "0.625rem" }}
    >
      <h4>
        <i
          className="pi pi-calendar"
          style={{ fontSize: "1.5rem", marginRight: "1.25rem" }}
        ></i>
        {`Today (${moment(new Date()).format("DD.MM.YYYY.")})`}
      </h4>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "10px",
          padding: "10px",
        }}
      >
        <Button
          label="Start new timer"
          icon="pi pi-stopwatch"
          style={{ background: COLORS.orange, outline: "none !important" }}
          onClick={() =>
            setSaveEditData({
              ...saveEditData,
              isOpened: true,
            })
          }
        />
        <Button
          label="Stop all"
          icon="pi pi-stop-circle"
          style={{ background: COLORS.blue, outline: "none !important" }}
          onClick={() => handleStopAll()}
        ></Button>
      </div>
      <div className="card">
        <DataTable
          value={trackers}
          responsiveLayout="stack"
          breakpoint="578px"
          paginator
          rows={5}
        >
          <Column
            field="timetracked"
            header="Time logged"
            body={(rowData) => formatSeconds(rowData.timetracked)}
          />
          <Column
            field="description"
            header="Description"
            style={{ width: "50%" }}
          />
          <Column field="actions" header="Actions" body={bodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog
        visible={saveEditData.isOpened}
        onHide={() =>
          setSaveEditData({
            isOpened: false,
            id: "",
            description: "",
            timetracked: 0,
            error: false,
            action: API_METHODS.post,
          })
        }
      >
        <span className="p-float-label">
          <h5>Description</h5>
          <InputText
            style={{ width: "320px" }}
            id="Description"
            name="description"
            value={saveEditData.description}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSaveEditData({
                ...saveEditData,
                description: e.target.value,
              })
            }
            autoFocus
            className={classNames({
              "p-invalid": saveEditData.error,
            })}
          />
        </span>
        <Button
          label=" Add / Edit"
          style={{
            background: COLORS.blue,
            outline: "none !important",
            marginTop: "20px",
          }}
          onClick={() => handleSaveEditSubmit()}
        />
      </Dialog>
    </div>
  );
};

export default Trackers;
