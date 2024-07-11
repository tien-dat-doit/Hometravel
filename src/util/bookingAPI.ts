import axiosClient from './axiosCustomize';
const bookingAPI = {
    getAll: (params: any, id: string) => {
        const url = `/Bookings/Owners/${id}`;
        return axiosClient.get(url, {
            params,
            paramsSerializer:{
                indexes:null
            }
        });
    },
    getDetail: (id: string) => {
        const url = `/BookingDetails?bookingId=${id}&pageSize=50`;
        return axiosClient.get(url);
    },
    getAllBooking: (params: any) => {
        const url = `/Bookings/`;
        return axiosClient.get(url, {
            params,
        });
    },
    getBookingCalendar: (params: any) => {
        const url = `/RoomStatuss/searchByRangeDate`;
        return axiosClient.get(url, {
            params,
        });
    },
    getDetailBooking: (id: string) => {
        const url = `/BookingDetails?pageSize=2&bookingId=${id}`;
        return axiosClient.get(url);
    },
    editBooking: (id: string, data: any) => {
        const url = `/Booking/${id}`;
        return axiosClient.put(url, data, {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    getReportBooking: (params: any) => {
        const url = `Bookings/report`;
        return axiosClient.get(url,{params});
    },
    updateStatusPayment: (bookingId: string, ownerId: string) => {
        const url = `/Bookings/${bookingId}/PayByOwner/${ownerId}`;
        return axiosClient.get(url);
    },
    updateBookingInfo: (payload: any, id: any) => {
        const url = `/Bookings/${id}`;
        return axiosClient.put(url, payload);
    },
    getInfoPriceWithBookingCanceled: (bookingId: string) => {
        const url = `/Bookings/${bookingId}/AmountTouristPaid`;
        return axiosClient.get(url);
    },
};

export default bookingAPI;
