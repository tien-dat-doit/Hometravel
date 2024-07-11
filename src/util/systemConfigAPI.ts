import axiosClient from './axiosCustomize';
const systemConfigAPI = {
    getAll: () => {
        const url = '/SystemConfigs?pageSize=10';
        return axiosClient.get(url);
    },
};

export default systemConfigAPI;

