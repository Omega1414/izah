const NotModal = ({ notifications }) => {
    return (
      <div className="p-4 w-80 bg-white rounded-lg shadow-md">
        <h3 className="font-bold text-lg">Notifications</h3>
        <div className="mt-4">
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            notifications.map((notification, index) => (
              <div key={index} className="p-2 border-b border-gray-200">
                <p>{notification.message}</p>
                <span className="text-xs text-gray-500">
                  {new Date(notification.date * 1000).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  export default NotModal;