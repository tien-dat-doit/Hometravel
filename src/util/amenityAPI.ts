import axiosClient from './axiosCustomize';
const amenityAPI = {
    getAllGeneralAmenity: (params: any) => {
        const url = '/GeneralAmenitieTitles/GeneralAmenities';
        return axiosClient.get(url, {
            params,
        });
    },
    getAllGeneralAmenityID: (params: any) => {
        const url = '/GeneralAmenitys';
        return axiosClient.get(url, {
            params,
        });
    },
    getAllAmenity: (params: any) => {
        const url = '/AmenitieTitles/Amenities';
        return axiosClient.get(url, {
            params,
        });
    },
    getAllAmenityID: (params: any) => {
        const url = '/Amenitys';
        return axiosClient.get(url, {
            params,
        });
    },
    createAmenityTitle: (params: any) => {
        const url = '/AmenitieTitles';
        return axiosClient.post(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    createAmenitys: (params: any) => {
        const url = '/Amenitys';
        return axiosClient.post(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    createAmenityGeneralAmenitysTitle: (params: any) => {
        const url = '/GeneralAmenitieTitles';
        return axiosClient.post(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    createAmenitysGeneralAmenitys: (params: any) => {
        const url = '/GeneralAmenitys';
        return axiosClient.post(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    editAmenityTitle: (id: string, params: any) => {
        const url = `/AmenitieTitles/${id}`;
        return axiosClient.put(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    editAmenitys: (id: string, params: any) => {
        const url = `/Amenitys/${id}`;
        return axiosClient.put(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    deleteAmenityTitle: (id: string) => {
        const url = `/AmenitieTitles/${id}`;
        return axiosClient.delete(url);
    },
    deleteAmenitys: (id: string) => {
        const url = `/Amenitys/${id}`;
        return axiosClient.delete(url);
    },
    editAmenityGeneralTitle: (id: string, params: any) => {
        const url = `/GeneralAmenitieTitles/${id}`;
        return axiosClient.put(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    editAmenitysGeneral: (id: string, params: any) => {
        const url = `/GeneralAmenitys/${id}`;
        return axiosClient.put(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    deleteAmenityGeneralTitle: (id: string) => {
        const url = `/GeneralAmenitieTitles/${id}`;
        return axiosClient.delete(url);
    },
    deleteAmenitysGeneral: (id: string) => {
        const url = `/GeneralAmenitys/${id}`;
        return axiosClient.delete(url);
    },

};

export default amenityAPI;

