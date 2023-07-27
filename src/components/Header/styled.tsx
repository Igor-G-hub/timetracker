import styled from "styled-components";
import { TabMenu } from "primereact/tabmenu";
import { COLORS } from "../../themes";

export const HeaderStyled = styled.header`
  display: flex;
  height: 85px;
  padding: 0 1.875rem;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: ${COLORS.blue};
  border-radius: 0 0 1.25rem 1.25rem;
`;

export const TabMenuStyled = styled(TabMenu)`
  display: flex;
  .p-tabmenu-nav {
    background-color: inherit;
  }

  .p-tabmenuitem {
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
    border-width: 0 0 4px 0 !important;
  }
`;
