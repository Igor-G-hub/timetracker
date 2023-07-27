import styled from "styled-components";
import { TabMenu } from "primereact/tabmenu";
import { BREAKPOINTS, COLORS } from "../../themes";

export const HeaderStyled = styled.header`
  display: flex;
  height: 85px;
  padding: 0 1.875rem;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: ${COLORS.blue};
  border-radius: 0 0 1.25rem 1.25rem;

  @media screen and (max-width: ${BREAKPOINTS.md}) {
    height: 120px;
    align-items: center;
    flex-direction: column;
    padding: 0;

    svg {
      transform: scale(0.8);
    }
  }
`;

export const TabMenuStyled = styled(TabMenu)`
  display: flex;
  flex-wrap: wrap;
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
