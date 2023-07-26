import styled from 'styled-components';
import { TabMenu } from 'primereact/tabmenu';
import { COLORS } from '../../themes';

export const HeaderStyled = styled.header` 
    display: flex; 
    padding: 1.1rem 1.875rem;
    justify-content: space-between;
    flex-wrap: wrap;
    background-color: ${COLORS.blue};
    border-radius: 0 0 10px 10px;    
`; 

export const TabMenuStyled = styled(TabMenu)`
    .p-tabmenu-nav {
        background-color: inherit
    }

    .p-tabmenuitem  {
        &.p-highlight {
            .p-menuitem-link {
                color: ${COLORS.light} !important;
                border-color: ${COLORS.orange} !important;
            }
        }
    }
    .p-menuitem-link {
        background-color: inherit !important;
        box-shadow: none !important;
        color: ${COLORS.grey} !important;
        border-color: ${COLORS.grey} !important;
        border-width: 0 0 5px 0 !important;
    }
`;