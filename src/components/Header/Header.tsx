import React, {useState, useEffect} from 'react';
import { HeaderStyled, TabMenuStyled } from './styled';
import { Logo } from '../../shared/assets/svgs';
import { navItems } from './constants';
import { useNavigate } from 'react-router-dom';


interface Props {
}

const Header: React.FC<Props> = () => {
  interface Item { 
    index: number; 
    label: string | undefined; 
  }
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<Item>({
    index: 0,
    label: navItems[0].label
  });

  //  useEffect(() => {
  //   const newActiveItem = navItems.find(item => item?.label === activeItem.label);
  //   newActiveItem && navigate(newActiveItem.route);
  //  }, [activeItem.index])

  return (
    <HeaderStyled >
      <div style={{width: "100px", fontSize: "30px"}}><Logo/></div>
      <TabMenuStyled model={navItems} activeIndex={activeItem.index} onTabChange={(e) => {
        setActiveItem({index: e.index, label: e.value.label})
      }}/>
    </HeaderStyled>
  );
};

export default Header;