import axiosClient from './axiosCustomize';
const walletAPI = {
    getWalletOwnerInformation: (id: string) => {
        const url = `/Wallets?ownerId=${id}`;
        return axiosClient.get(url);
    },
    getWalletOwnerTransaction: (params: any) => {
        const url = `/Transactions`;
        return axiosClient.get(url, {params});
    },
    getWalletTouristInformation: (id: string) => {
        const url = `/Wallets?touristId=${id}`;
        return axiosClient.get(url);
    },
    getWalletAdminInformation: (id: string) => {
        const url = `/Wallets?AdminId=${id}`;
        return axiosClient.get(url);
    },
};

export default walletAPI;
