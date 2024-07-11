import axiosClient from './axiosCustomize';
const roomAPI = {
    getAll: (params: any) => {
        const url = '/Rooms';
        return axiosClient.get(url, {
            params,
        });
    },
    getDetail: (id: string) => {
        const url = `/Rooms/${id}`;
        return axiosClient.get(url);
    },
    getListAmenities: () => {
        const url = `/AmenitieTitles/Amenities`;
        return axiosClient.get(url);
    },
    getRoomConfig: (params: any) => {
        const url = `/RoomConfigs`;
        return axiosClient.get(url,{params});
    },
    getRoomStatussDetail: (id: any) => {
        const url = `/RoomStatuss/${id}`;
        return axiosClient.get(url);
    },
    getRoomConfigByRangeDateTime: (params: any) => {
        const url = `/RoomConfigs`;
        return axiosClient.get(url,{params});
    },
    getRoomPriceByRangeDateTime: (params: any) => {
        const url = `/RoomConfigs/Price`;
        return axiosClient.get(url,{params});
    },
    getBookedRecent: (params: any) => {
        const url = '/Rooms/bookedRecently';
        return axiosClient.get(url, {
            params,
        });
    },
    updateStatus: (payload: any, id:string) => {
        const url = `/Rooms/${id}`;
        return axiosClient.put(url, payload);
    },
    updateRoom: (payload: any, id:string) => {
        const url = `/Rooms/${id}/v1`;
        return axiosClient.put(url, payload,{
            headers: {
            'Content-Type': 'multipart/form-data',
        }});
    },
    updateStatusV2: (payload: any) => {
        const url = `/RoomStatuss/closeRooms`;
        return axiosClient.post(url, payload);
    },
    activeRoomByOwner: (payload: any, id: any) => {
        const url = `/RoomStatuss/${id}`;
        return axiosClient.put(url, payload);
    },
    updatePriceForRoom: (payload: any, id: any) => {
        const url = `/RoomConfigs/${id}`;
        return axiosClient.put(url, payload);
    },
    createPriceForRoom: (payload: any) => {
        const url = `/RoomConfigs`;
        return axiosClient.post(url, payload);
    },
    createRoom: (payload: any) => {
        const url = `/Rooms/v1`;
        return axiosClient.post(url, payload,{
            headers: {
            'Content-Type': 'multipart/form-data',
        }});
    },
    getListEventInactiveRoom: (params: any) => {
        const url = `/RoomStatuss`;
        return axiosClient.get(url, {params});
    }
};

export default roomAPI;
