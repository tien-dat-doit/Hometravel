import axiosClient from './axiosCustomize';
const transactionAPI = {
    getALL: (params: any) => {
        const url = '/Transactions';
        return axiosClient.get(url, {
            params,
        });
    },
    getDetail: (id: any) => {
        const url = `/Transactions/${id}`;
        return axiosClient.get(url);
    },
    withDrawMoneyByOwner: (params: any, id: any) => {
        const url = `/Wallets/${id}/WithDraw`;
        return axiosClient.get(url, {
            params,
        });
    },
};

export default transactionAPI;

