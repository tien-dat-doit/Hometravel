import axiosClient from './axiosCustomize';
const contractAPI = {
    updateContract: (id: string, payload: any) => {
        const url = `/SystemConfigs/${id}`;
        return axiosClient.put(url, payload, {headers: {
            'Content-Type': 'multipart/form-data',
        }});
    },
    getContract: (id: string) => {
        const url = `/SystemConfigs/${id}`;
        return axiosClient.get(url);
    }
};

export default contractAPI;
