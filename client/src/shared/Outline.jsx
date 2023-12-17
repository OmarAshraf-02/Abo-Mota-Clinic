import { useState, createElement } from 'react';
import { Outlet, useNavigate, Link } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import PopOver from './Components/PopOver';
import Logo from './assets/logo.png'
import { useLogoutMutation } from '../store';
import CustomFooter from './Components/Footer';
const { Header, Content, Footer, Sider } = Layout;


const Outline = ({ items, navBarItems }) => {
  const [logout, results] = useLogoutMutation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // Hook for navigation
  // Function to handle menu item click
  const onMenuClick = (e) => {
    const selectedItem = items.find(item => item.key === e.key);
    if (selectedItem && selectedItem.to) {
      navigate(`${selectedItem.to}`);
    }
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    navigate('/');
    logout();
  }
  const profileContent = (
    <div>
      {navBarItems.map(item => (
        <Link key={item.name} to={item.to} style={{ display: 'block', margin: '10px 0' }}>
          {item.name}
        </Link>
      ))}
      <div onClick={handleLogout} style={{ cursor: 'pointer', margin: '10px 0' }}>
        Logout
      </div>
    </div>
  );

  const messageContent = <p>Messages Content</p>;
  const notificationContent = <p>Notifications Content</  p>;


  return (
    <Layout hasSider>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical">
          <img src={Logo} alt="Logo" style={{ width: '100px', padding: '16px', margin: '0 auto' }} />
        </div>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          items={items.map(item => ({ ...item, icon: createElement(item.icon.type) }))}
          onClick={onMenuClick} // Add onClick handler
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? '80px' : '200px',
          transition: 'margin-left 0.2s',
          // backgroundColor: "green",
          // height: '100%',
          minHeight: '100vh'
        }}
      >
        <Header style={{ position: 'sticky', top: '0', zIndex: '1000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', background: colorBgContainer }}>
          <div>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', border: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PopOver
              logo={<MessageOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />}
              content={messageContent}
              placement="bottom"
              trigger="click"
            />
            <PopOver
              logo={<BellOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />}
              content={notificationContent}
              placement="bottom"
              trigger="click"
            />
            <PopOver
              logo={<UserOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />}
              content={profileContent}
              placement="bottomLeft"
              trigger="click"
            />
          </div>
        </Header>

        <Content style={{ overflow: 'initial' }}>
          <Outlet style={{  }} />
        </Content>
        {/* <Footer style={{ width: '100%', textAlign: 'center' }}>
          <CustomFooter/>
        </Footer> */}
      </Layout>
    </Layout>
  );
};


export default Outline;
