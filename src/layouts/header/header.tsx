import React from 'react';
import Router, { useRouter } from 'next/router';
import { openModal } from '@redq/reuse-modal';
import { AuthContext } from 'contexts/auth/auth.context';
import AuthenticationForm from 'features/authentication-form';
import { RightMenu } from './menu/right-menu/right-menu';
import { LeftMenu } from './menu/left-menu/left-menu';
import HeaderWrapper from './header.style';
// import LogoImage from 'assets/images/logo.svg';
import LogoImage from 'assets/images/logo.png';
import UserImage from 'assets/images/user.jpg';
import { isCategoryPage } from '../is-home-page';
import Search from 'features/search/search';
import navmenu from './nav-menu';

type Props = {
  className?: string;
};

const Header: React.FC<Props> = ({ className }) => {
  const {
    authState: { isAuthenticated },
    authDispatch,
  } = React.useContext<any>(AuthContext);
  const { pathname, query } = useRouter();
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      authDispatch({ type: 'SIGN_OUT' });
      Router.push('/');
    }
  };

  const handleJoin = () => {
    authDispatch({
      type: 'SIGNIN',
    });

    openModal({
      show: true,
      overlayClassName: 'quick-view-overlay',
      closeOnClickOutside: true,
      component: AuthenticationForm,
      closeComponent: '',
      config: {
        enableResizing: false,
        disableDragging: true,
        className: 'quick-view-modal',
        width: 458,
        height: 'auto',
      },
    });
  };
  
  const catalogs = [ 'НОВИНКИ',
                     'ДЕТСКАЯ ОБУВЬ',
                     'МУЖСКАЯ ОБУВЬ',
                     'ЖЕНСКАЯ ОБУВЬ',
                     'АКСЕССУАРЫ',
                     'РАСПРОДАЖА'
  ];
  const listItems = catalogs.map((catalog) => 
      <li className="listyle">
        <a href='#'>{catalog}</a>
        <ul className="listelement">
          <li><a href='#'>Ботинки</a></li>
          <li><a href='#'>Туфли</a></li>
          <li><a href='#'>Сандалии</a></li>
        </ul>
      </li>
  );
  const showSearch = isCategoryPage(query.type);
  function show() {
                document.getElementById("menuuu").style.display = 'block';
                document.getElementById("btn2").style.display = 'block';
            };
  function hidd() {
                document.getElementById("menuuu").style.display = 'none';
                document.getElementById("btn2").style.display = 'none';
            };
  return (
      <div>
        <HeaderWrapper className={className} id="layout-header">
          <LeftMenu logo={LogoImage} />
          {showSearch && <Search minimal={true} className="headerSearch" />}
          <RightMenu
            isAuthenticated={isAuthenticated}
            onJoin={handleJoin}
            onLogout={handleLogout}
            avatar={UserImage}
          /> 
          <div id="hidden">
            <input type="button" id="btn1" onClick ={show} value="Show Menu"/>
            <input type="button" id="btn2" onClick ={hidd} value="Hidden Menu"/>
          </div> 
          <ul id="menuuu">            
            {listItems}
          </ul>        
        </HeaderWrapper>
                
      </div>

    );
};

export default Header;
