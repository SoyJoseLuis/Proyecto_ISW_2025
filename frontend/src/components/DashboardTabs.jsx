// src/components/DashboardTabs.jsx
import { Tabs } from 'antd';
import '../styles/DashboardTabs.css'; 

export default function DashboardTabs({ tabs, defaultActiveKey = '1' }) {
  return (
    <div className="dashboard-tabs-wrapper">
      <div className="barra-superior-azul"></div>

      <Tabs
        defaultActiveKey={defaultActiveKey}
        tabBarGutter={28}
        size="large"
        className="dashboard-tabs"
        items={tabs.map(tab => ({
          key: tab.key,
          label: (
            <span>
              {tab.icon} {tab.label}
            </span>
          ),
          children: tab.content,
        }))}
      />
    </div>
  );
}
