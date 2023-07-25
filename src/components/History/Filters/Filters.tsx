import React, {useState} from 'react';
import {  CalendarChangeEvent } from 'primereact/calendar';
import { COLORS } from '../../../themes';
import { CalendarStyled, ContainerStyled, InputTextStyled } from './styled';

interface Props {
}

const Filters: React.FC<Props> = ({}) => {
    const [date, setDate] = useState<string | Date | Date[] | null>(new Date());
  return (
    <ContainerStyled>
    <CalendarStyled value={date} onChange={(e : CalendarChangeEvent) => e.value && setDate(e.value)} showIcon />
    <CalendarStyled value={date} onChange={(e : CalendarChangeEvent) => e.value && setDate(e.value)} showIcon />
    <span className="p-input-icon-right">
        <i className="pi pi-times" style={{cursor: "pointer"}} />
        <InputTextStyled />
    </span>
</ContainerStyled>
  );
};

export default Filters;