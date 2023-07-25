import styled from 'styled-components';
import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";
import { COLORS } from '../../../themes';


export const ContainerStyled = styled.div` 
    display: flex;
    flex-wrap: wrap;
    gap: 1.875rem;
    background: ${COLORS.whiteLilac};
    padding: 1.25rem;
`;

export const CalendarStyled = styled(Calendar)` 
        width: 320px; 
        .p-inputtext {
            border: none;
        }
      .p-button {
        background: ${COLORS.white} !important;
        color: ${COLORS.lynch} !important;
        border: none !important;
        outline: none !important;
      }  
  
`;

export const InputTextStyled = styled(InputText)` 
        width: 320px; 
        border: none;
`;