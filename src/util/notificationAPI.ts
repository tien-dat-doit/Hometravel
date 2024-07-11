import axiosClient from './axiosCustomize';
const notificationAPI = {
    getAllNotification: (params: any) => {
        const url = `/Notifications`;
        return axiosClient.get(url, {params});
    },
    readNotification: (payload: any) => {
        const url = `/Notifications`;
        return axiosClient.put(url, payload);
    },
    subscribeTopic: (payload: any, id: any) => {
        const url = `Notifications/subscribe/${id}`;
        return axiosClient.post(url, payload);  
    }
};

export default notificationAPI;
