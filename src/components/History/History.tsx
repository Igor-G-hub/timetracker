import React, { useEffect, useState, ChangeEvent } from "react";
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
import Filters from "./Filters/Filters";
import { db, auth } from "../../firebase-config";
import {
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { ACTIONS, DB_COLLECTION_NAMES } from "../Trackers/helpers/constants";
import moment from "moment";
import { formatSeconds } from "../Trackers/helpers/utils";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { ContainerStyled } from "./styled";

interface Props {}

interface Trackers {
  id: string;
  createTime: number;
  description: string;
  timetracked: number;
  isCurrentlyTracking?: boolean;
}

interface SaveEditData {
  id: string;
  description: string;
  timetracked: number;
  isOpened?: boolean;
  error: boolean;
}

const History: React.FC<Props> = () => {
  const trackersFinishedCollectionRef = collection(
    db,
    DB_COLLECTION_NAMES.finishedTimetrackers
  );
  const [trackers, setTrackers] = useState<Trackers[]>([]);
  const [filteredTrackers, setFilteredTrackers] = useState<Trackers[]>([]);
  const [filterInputValue, setFilterInputValue] = useState("");
  const [saveEditData, setSaveEditData] = useState<SaveEditData>({
    isOpened: false,
    id: "",
    description: "",
    timetracked: 0,
    error: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredTrackers(trackers);
  }, [trackers]);

  useEffect(() => {
    if (filterInputValue.length > 3) {
      const newFilteredTrackers = filteredTrackers.filter((tracker) =>
        tracker.description.includes(filterInputValue)
      );
      setFilteredTrackers(newFilteredTrackers);
    }
    if (!filterInputValue.length) setFilteredTrackers(trackers);
  }, [filterInputValue]);

  const fetchData = async () => {
    try {
      const q = query(
        trackersFinishedCollectionRef,
        where("userId", "==", auth?.currentUser?.uid)
      );
      const data = await getDocs(q);
      const filteredData = data.docs.map((doc) => ({
        description: doc.data().description,
        timetracked: doc.data().timetracked,
        createTime: doc.data().createTime,
        id: doc.id,
      }));
      setTrackers(filteredData);
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const onClickIcon = (rowData: Trackers, action: string) => {
    switch (action) {
      case ACTIONS.edit:
        setSaveEditData({
          isOpened: true,
          id: rowData.id,
          description: rowData.description,
          timetracked: rowData.timetracked,
          error: false,
        });
        break;
      case ACTIONS.delete:
        deleteFinishedTracker(rowData);
        break;
      default:
        break;
    }
  };

  const updateFinishedTracker = async (data: SaveEditData) => {
    try {
      const trackerDoc = doc(
        db,
        DB_COLLECTION_NAMES.finishedTimetrackers,
        data.id
      );
      await updateDoc(trackerDoc, {
        description: data.description,
      });
      setSaveEditData({
        ...saveEditData,
        isOpened: false,
      });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFinishedTracker = async (tracker: Trackers) => {
    const trackerDoc = doc(
      db,
      DB_COLLECTION_NAMES.finishedTimetrackers,
      tracker.id
    );
    await deleteDoc(trackerDoc);
    fetchData();
  };

  const handleSaveEditSubmit = () => {
    if (!saveEditData.description.length)
      return setSaveEditData({
        ...saveEditData,
        error: true,
      });
    updateFinishedTracker(saveEditData);
    setSaveEditData({
      ...saveEditData,
      error: false,
    });
  };

  const bodyTemplate = (rowData: Trackers) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100px",
        }}
      >
        <EditIcon
          key="1"
          style={{ cursor: "pointer" }}
          onClick={() => onClickIcon(rowData, ACTIONS.edit)}
        />
        <TrashIcon
          key="2"
          style={{ cursor: "pointer" }}
          onClick={() => onClickIcon(rowData, ACTIONS.delete)}
        />
      </div>
    );
  };

  return (
    <ContainerStyled>
      <h4>Trackers history</h4>
      <Filters
        setFilteredTrackers={setFilteredTrackers}
        filterInputValue={filterInputValue}
        setFilterInputValue={setFilterInputValue}
      />
      <div
        className="card mt-5"
        style={{ marginTop: "1.125rem", width: "100%" }}
      >
        <DataTable
          value={filteredTrackers}
          responsiveLayout="stack"
          breakpoint="578px"
          paginator
          rows={5}
        >
          <Column
            field="date"
            header="Date"
            body={(rowData) => moment(rowData.createTime).format("DD.MM.YYYY.")}
          />
          <Column
            field="description"
            header="Description"
            style={{ width: "50%" }}
          />
          <Column
            field="timetracked"
            header="Time tracked"
            body={(rowData) => formatSeconds(rowData.timetracked)}
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
          label="Edit"
          style={{
            background: COLORS.blue,
            outline: "none !important",
            marginTop: "20px",
          }}
          onClick={() => handleSaveEditSubmit()}
        />
      </Dialog>
    </ContainerStyled>
  );
};

export default History;
