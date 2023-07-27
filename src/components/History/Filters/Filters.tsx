import React, { useState, ChangeEvent } from "react";
import { CalendarChangeEvent } from "primereact/calendar";
import { COLORS } from "../../../themes";
import { CalendarStyled, ContainerStyled, InputTextStyled } from "./styled";

interface Props {
  setFilteredTrackers: Function;
  filterInputValue: string;
  setFilterInputValue: Function;
}

const Filters: React.FC<Props> = ({
  setFilteredTrackers,
  filterInputValue,
  setFilterInputValue,
}) => {
  const [date, setDate] = useState<string | Date | Date[] | null>(new Date());
  return (
    <ContainerStyled>
      <CalendarStyled
        value={date}
        onChange={(e: CalendarChangeEvent) => e.value && setDate(e.value)}
        showIcon
      />
      <CalendarStyled
        value={date}
        onChange={(e: CalendarChangeEvent) => e.value && setDate(e.value)}
        showIcon
      />
      <span className="p-input-icon-right">
        <i
          className="pi pi-times"
          style={{ cursor: "pointer" }}
          onClick={() => setFilterInputValue("")}
        />
        <InputTextStyled
          value={filterInputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFilterInputValue(e.target.value)
          }
        />
      </span>
    </ContainerStyled>
  );
};

export default Filters;
