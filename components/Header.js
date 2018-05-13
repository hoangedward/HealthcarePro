import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route="/">
        <a className="item">Healthcare Pro</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/admin/event">
          <a color='brown' className="item">Solidity Event</a>
        </Link>
        <Link route="/admin">
          <a color='brown' className="item">Admin</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
