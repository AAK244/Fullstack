import { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload;
    case 'HIDE':
      return '';
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '');

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
