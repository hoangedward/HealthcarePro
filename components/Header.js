import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';
// import logo from './logo.bmp'; // Tell Webpack this JS file uses this image

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route="/">
        <a className="item">Healthcare Pro</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/admin">
          <a color='brown' className="item">Admin</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
