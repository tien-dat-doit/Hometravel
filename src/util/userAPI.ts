import axiosClient from './axiosCustomize';
const userAPI = {
    getTourists: (params: any) => {
        const url = '/Tourists';
        return axiosClient.get(url, {
            params,
        });
    },
    getOwners: (params: any) => {
        const url = '/Owners';
        return axiosClient.get(url, {
            params,
        });
    },
    getTouristID: (id: string) => {
        const url = `/Tourists/${id}`;
        return axiosClient.get(url);
    },
    getOwnerID: (id: string) => {
        const url = `/Owners/${id}`;
        return axiosClient.get(url);
    },
    updateProfileOwner: (id: string, payload: any) => {
        const url = `/Owners/${id}`;
        return axiosClient.put(url, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateProfileTourist: (id: string, payload: any) => {
        const url = `/Tourists/${id}`;
        return axiosClient.put(url, payload, {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
};

export default userAPI;

