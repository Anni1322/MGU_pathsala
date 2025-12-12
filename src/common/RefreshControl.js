import React from 'react';
import { RefreshControl } from 'react-native';

// Reusable RefreshControl component
const CustomRefreshControl = ({ refreshing, onRefresh }) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={["#007AFF"]}
      tintColor="#007AFF"
      title="Refreshing..."
    />
  );
};

export default CustomRefreshControl;
