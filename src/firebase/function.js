import { useEffect, useState } from 'react';
import { firestore } from '../../src/firebase/config.js';
import jwtDecode from 'jwt-decode';
// import { useSelector } from 'react-redux';

export const useNotifications = () => {
  // let userId = useSelector(state => state.user.profile.id)
  let userId = jwtDecode(sessionStorage.getItem('token')).id
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) userId = -1;
    const unsubscribe = firestore.collection('notifications')
      .where('userId', '==', userId - 0)
      // .where('read', '==', true)
      .orderBy('dateCreated', 'desc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => (
          // !doc.read&&
          {
            id: doc.id,
            ...doc.data(),
          }));

        // data.filter(n => n.read == false)
        const notifies = data.filter((n) => n.read == false)
        setNotifications(notifies);
      });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return notifications;

}

export const addNotification = (userId, message, url) => {
  // Thêm thông báo mới vào collection 'notifications'
  firestore.collection('notifications').add({
    userId,
    message,
    dateCreated: new Date().toISOString(),
    read: false,
    image: jwtDecode(sessionStorage.getItem('token')).avatar,
    url: url
  });
};

export const markNotificationAsRead = async (notificationId) => {
  await firestore.collection('notifications').doc(notificationId).update({
    read: true,
  });
};