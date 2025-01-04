import Pusher from 'pusher-js';
import { getAuthToken } from './auth';

let pusherInstance = null;

export const getPusherInstance = () => {
  if (!pusherInstance) {
    pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      channelAuthorization: {
        endpoint: process.env.NEXT_PUBLIC_PUSHER_AUTH_ENDPOINT,
        headers: {
          Accept: 'application/json',
          Authorization: getAuthToken(),
        },
      },
    });
  }
  return pusherInstance;
};

export const disconnectPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
}; 