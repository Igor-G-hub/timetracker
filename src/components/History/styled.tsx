import styled from "styled-components";
import { BREAKPOINTS } from "../../themes";

export const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.625rem;

  @media screen and (max-width: ${BREAKPOINTS.md}) {
    align-items: center;
  }
`;
