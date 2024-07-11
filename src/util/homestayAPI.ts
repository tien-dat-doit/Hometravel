import axiosClient from './axiosCustomize';
const homestayAPI = {
    getAll: (params: any) => {
        const url = '/HomeStays';
        return axiosClient.get(url, {
            params,
            paramsSerializer:{
                indexes: null
            }
        });
    },
    create: (payload: any) => {
        const url = '/HomeStays/v1';
        return axiosClient.post(url, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateStatus: (payload: any, id:string) => {
        const url = `/HomeStays/${id}`;
        return axiosClient.put(url, payload,{headers: {
            'Content-Type': 'multipart/form-data',
        }});
    },
    getListEventInactiveHomestay: (params: any) => {
        const url = `/HomeStayStatuss`;
        return axiosClient.get(url, {params});
    },
    updateStatusV2: (payload: any) => {
        const url = `HomeStayStatuss/closeHomeStays`;
        return axiosClient.post(url, payload);
    },
    activeHomestayByOwner: (payload: any, id: any) => {
        const url = `HomeStayStatuss/${id}`;
        return axiosClient.put(url, payload);
    },
    updateHomestayGeneralInformation: (payload: any, id:string) => {
        const url = `/HomeStays/${id}/v1`;
        return axiosClient.put(url, payload,{headers: {
            'Content-Type': 'multipart/form-data',
        }});
    },
    getDetail: (id: string) => {
        const url = `/HomeStays/${id}`;
        return axiosClient.get(url);
    },
    getListAmenities: () => {
        const url = `/GeneralAmenitieTitles/GeneralAmenities`;
        return axiosClient.get(url);
    },
    getListPolicies: () => {
        const url = `/PolicyTitles?pageSize=50`;
        return axiosClient.get(url);
    },
    getListPoliciesOfHomestay: (id: string) => {
        const url = `/HomeStayPolicySelecteds?pageSize=50&homeStayId=${id}`;
        return axiosClient.get(url);
    },
    editHomestay: (id: string, data: any) => {
        const url = `/HomeStays/${id}`;
        return axiosClient.put(url, data);
    },
    editHomestayAdmin: (id: string, data: any) => {
        const url = `/HomeStays/${id}`;
        return axiosClient.put(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getListFeedbackOfHomestay: (id: string) => {
        const url = `/Feedbacks?pageSize=100&homeStayId=${id}`;
        return axiosClient.get(url);
    },
    getListFeedback: (params: any) => {
        const url = `/Feedbacks`;
        return axiosClient.get(url,{params});
    },
    deleteFeedback: (id: string) => {
        const url = `/Feedbacks/${id}`;
        return axiosClient.delete(url);
    },
};
export default homestayAPI;
