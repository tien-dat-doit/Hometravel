import axiosClient from './axiosCustomize';
const dashboardAPI = {
    getTop10Homestay: (id: string) => {
        const url = `/HomeStays/TopRevenue?quantity=10&ownerId=${id}`;
        return axiosClient.get(url);
    },
    getAllHomestayByStatus: (id: string) => {
        const url = `/HomeStays/CountStatus?ownerId=${id}`;
        return axiosClient.get(url);
    },
    getAllBookingByStatus: (id: string) => {
        const url = `/Bookings/CountStatus?ownerId=${id}`;
        return axiosClient.get(url);
    },
    getTop10HomestayAdmin: () => {
        const url = `/HomeStays/TopRevenue?quantity=5`;
        return axiosClient.get(url);
    },
    getAllHomestayByStatusAdmin: () => {
        const url = `/HomeStays/CountStatus`;
        return axiosClient.get(url);
    },
    getAllBookingByStatusAdmin: (params: any) => {
        const url = `/Bookings//CountBookingByCreatedDate`;
        return axiosClient.get(url,{params});
    },
};

export default dashboardAPI;
