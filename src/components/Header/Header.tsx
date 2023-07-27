import React, { useState, useEffect } from "react";
import { HeaderStyled, TabMenuStyled } from "./styled";
import { Logo } from "../../shared/assets/svgs";
import { navItems } from "./constants";
import { useNavigate } from "react-router-dom";
import { signOut } from "@firebase/auth";
import { auth } from "../../firebase-config";
import store from "../../store";
import {
  SET_IS_AUTH,
  SET_UNFINISHED_TRACKERS,
} from "../../redux/actionTypes/appActionType";
import { ROUTES } from "../../routes";

interface Props {
  isAuth: boolean;
}

const Header: React.FC<Props> = ({ isAuth }) => {
  interface Item {
    index: number;
    label: string | undefined | boolean;
  }
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<Item>({
    index: 0,
    label: isAuth && navItems[0].label,
  });

  useEffect(() => {
    const newActiveItem = navItems.find(
      (item) => item?.label === activeItem.label
    );
    if (newActiveItem) {
      newActiveItem.label === "Logout"
        ? logOut()
        : navigate(newActiveItem.route);
    }
  }, [activeItem.index]);

  const logOut = async () => {
    await signOut(auth);
    setActiveItem({
      index: 0,
      label: false,
    });
    store.dispatch({
      type: SET_UNFINISHED_TRACKERS,
      payload: {
        unfinishedTrackers: [],
      },
    });
  };

  return (
    <HeaderStyled>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Logo />
      </div>
      {isAuth && (
        <TabMenuStyled
          model={navItems}
          activeIndex={activeItem.index}
          onTabChange={(e) => {
            setActiveItem({ index: e.index, label: e.value.label });
          }}
        />
      )}
    </HeaderStyled>
  );
};

export default Header;
