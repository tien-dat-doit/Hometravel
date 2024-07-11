import axiosClient from './axiosCustomize';
const policyAPI = {
    getAllPolicyTitle: (params: any) => {
        const url = '/PolicyTitles';
        return axiosClient.get(url, {
            params,
        });
    },
    getPolicyID: (params: any) => {
        const url = '/Policys';
        return axiosClient.get(url, {
            params,
        });
    },
    postPolicyTitle: (params: any) => {
        const url = '/PolicyTitles';
        return axiosClient.post(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    postPolicies: (params: any) => {
        const url = '/Policys';
        return axiosClient.post(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    editPolicyTitle: (id: string, params: any) => {
        const url = `/PolicyTitles/${id}`;
        return axiosClient.put(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    editPolicies: (id: string, params: any) => {
        const url = `/Policys/${id}`;
        return axiosClient.put(url, params , {
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
        });
    },
    deletePolicyTitle: (id: string) => {
        const url = `/PolicyTitles/${id}`;
        return axiosClient.delete(url);
    },
    deletePolicys: (id: string) => {
        const url = `/Policys/${id}`;
        return axiosClient.delete(url);
    },

};

export default policyAPI;

