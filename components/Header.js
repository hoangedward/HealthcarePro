import React from 'react';
import { Menu, Dropdown, Icon} from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }} pointing secondary>
      <Dropdown item icon='content' simple closeOnChange>
        <Dropdown.Menu style={{ marginTop: '-5px' }} >
          <Dropdown.Item>
            <Icon name='dropdown' />
            <Link route={`/patient`}><a>Patient</a></Link>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Link route={`/patient/clinic`}><a>Your Clinic</a></Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link route={`/patient/insurer`}><a>Your Insurer</a></Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Item>
          <Dropdown.Item><Link route={`/clinic`}><a>Clinic</a></Link></Dropdown.Item>
          <Dropdown.Item><Link route={`/insurer`}><a>insurer</a></Link></Dropdown.Item>
          <Dropdown.Item><Link route={`/admin/event`}><a>Solidity event</a></Link></Dropdown.Item>
          <Dropdown.Item><Link route={`/admin`}><a>Admin</a></Link></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

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
