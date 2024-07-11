import axiosClient from './axiosCustomize';
const authorizeAPI = {
    login: (payload: any) => {
        const url = '/Owners/login';
        return axiosClient.post(url, payload);
    },
    register: (payload: any) => {
        const url = '/Owners';
        return axiosClient.post(url, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    loginAdmin: (payload: any) => {
        const url = '/Admins/login';
        return axiosClient.post(url, payload);
    },
    getOwnerProfile: (id: string) => {
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
    updatePasswordOwner: (payload: any) => {
        const url = `/Owners/${payload?.ownerId}/changePassword?oldPassword=${payload?.oldPassword}&newPassword=${payload?.newPassword}`;
        return axiosClient.put(url);
    },
    getAdminAccount: () => {
        const url = `/Admins?pageSize=10`;
        return axiosClient.get(url);
    },
    updatePasswordAdmin: (payload: any) => {
        const url = `/Admins/${payload?.Id}/changePassword?oldPassword=${payload?.oldPassword}&newPassword=${payload?.newPassword}`;
        return axiosClient.put(url);
    },
};
export default authorizeAPI;
