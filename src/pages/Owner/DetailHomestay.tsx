import axios from 'axios';
import {
    ErrorMessage,
    Field,
    FieldArray,
    Form,
    Formik,
    FormikProps,
    FormikValues,
} from 'formik';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';
import 'tippy.js/dist/tippy.css';
import * as Yup from 'yup';
import IconArrowBackward from '../../components/Icon/IconArrowBackward';
import IconBox from '../../components/Icon/IconBox';
import IconCamera from '../../components/Icon/IconCamera';
import IconPencil from '../../components/Icon/IconPencil';
import IconSave from '../../components/Icon/IconSave';
import useAuth from '../../hook/useAuth';
import { setPageTitle } from '../../store/themeConfigSlice';
import { DistrictType } from '../../types/district';
import { ProvincesType } from '../../types/provinces';
import { WardType } from '../../types/ward';
import homestayAPI from '../../util/homestayAPI';

interface HomestayDetail {
    acreage: number;
    address: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    city: string;
    commune: string;
    description: string;
    district: string;
    hamlet: string;
    house: string;
    id: string;
    name: string;
    ownerId: string;
    status: string;
    street: string;
    penaltyRate: number
    penaltyDate: number
    depositRate: number
    images: imageHomestayObject[];
    homeStayGeneralAmenitieTitles: amenitiesTitle[];
}
interface imageHomestayObject {
    id: string;
    url: string;
    roomId: null | string;
    homeStayId: string;
}
interface amenitiesTitle {
    id: string;
    homeStayId: string;
    generalAmenitieTitleId: string;
    generalAmenitieTitle: {
        id: string;
        name: string;
    };
    generalAmenitieSelecteds: amenitiesDetail[];
}

interface amenitiesDetail {
    id: string;
    generalAmenitieId: string;
    homeStayGeneralAmenitieTitleId: string;
    generalAmenitie: {
        id: string;
        name: string;
        generalAmenitieTitleId: string;
    };
}

interface HomestayFeedback {
    id: string;
    description: string;
    rating: number;
    createdDate: string;
    touristId: string;
    homeStayId: string;
    tourist: {
        id: string;
        phoneNumber: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        gender: true;
        dateOfBirth: string;
        status: string;
    };
}
interface homestayPolicy {
    id: string;
    policyTitleId: string;
    policyId: string;
    homeStayId: string;
    policyTitle: {
        id: string;
        name: string;
        policies: [
            {
                id: string;
                description: string;
                subDescription: string;
                policyTitleId: string;
            },
        ];
    };
    policy: {
        id: string;
        description: string;
        subDescription: string;
        policyTitleId: string;
    };
}

const validationSchema = Yup.object({
    nameHomestay: Yup.string().required('Vui lòng nhập tên Homestay'),
    addressHomestay: Yup.string().required('Vui lòng nhập địa chỉ Homestay'),
    infoHomestay: Yup.string()
        .required('Vui lòng mô tả Homestay')
        .min(20, 'Vui lòng nhập ít nhất 20 ký tự'),
    acreageSum: Yup.number()
        .required('Đây là thông tin bắt buộc nhập !')
        .min(10, 'Diện tích ít nhất phải là 10m²'),
    province: Yup.string().required('Vui lòng nhập tên tỉnh/thành phố'),
    district: Yup.string().required('Vui lòng nhập tên quận/huyện'),
    ward: Yup.string().required('Vui lòng nhập tên phường/xã'),
    streetName: Yup.string().required('Vui lòng nhập tên đường'),
    penaltyDate: Yup.number()
        .required('Vui lòng nhập số ngày')
        .integer('Vui lòng nhập số nguyên!')
        .min(0, 'Số ngày ít nhất là 0!')
        .max(10, 'Số ngày tối đa là 10!'),
    listRoom: Yup.array().of(
        Yup.object().shape({
            recieverPeople: Yup.number()
                .required('Vui lòng nhập ít nhất 1 người')
                .min(1, 'Vui lòng nhập ít nhất 1 người')
                .max(10, 'Tối đa 10 người'),
            recieverName: Yup.string()
                .required('Vui lòng nhập tên Phòng')
                .min(3, 'Nhập ít nhất 3 ký tự'),
            recieveBed: Yup.number()
                .required('Vui lòng nhập ít nhất 1 giường')
                .min(1, 'Vui lòng nhập ít nhất 1 giường')
                .max(10, 'Tối đa 10 giường'),
            acreageRoom: Yup.number()
                .required('Đây là thông tin bắt buộc')
                .min(1, 'Phòng có diện tích ít nhất là 1m²'),
            priceRoomNor: Yup.number()
                .required('Vui lòng nhập giá tiền Phòng')
                .min(10000, 'Đơn giá ít nhất 10.000 VNĐ'),
            priceRoomWe: Yup.number()
                .required('Vui lòng nhập giá tiền Phòng')
                .min(10000, 'Đơn giá ít nhất 10.000 VNĐ'),          
        }),
    ),
});
const UpdateGeneralInfoHomestay = ({ homestayId, setIsUpdate }: any) => {
    const navigate = useNavigate();
    const renderStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return { name: 'HOẠT ĐỘNG', color: '#EA1365' };
            case 'INACTIVE TEMPORARY':
                return { name: 'TẠM NGƯNG HOẠT ĐỘNG', color: '#515ae3' };
            case 'INACTIVE':
                return { name: 'NGƯNG HOẠT ĐỘNG', color: '#515ae2' };
            case 'PENDING':
                return { name: 'ĐANG CHỜ KIỂM DUYỆT', color: '#ea8213' };
            case 'CANCELED':
                return { name: 'ĐÃ TỪ CHỐI', color: '#ef3f3f' };
            case 'SELF-CANCELED':
                return { name: 'NGƯNG KIỂM DUYỆT', color: '#ef3f3f' };
            case 'DISABLE':
                return { name: 'VÔ HIỆU HÓA', color: '#880e4f' };
            default:
                return { name: 'CHƯA XÁC ĐỊNH', color: '#ef3f3f' };
        }
    };
    const [isSubmit, setIsSubmit] = useState(false);
    const formikRef = useRef<FormikProps<FormikValues>>(null);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked((prevChecked) => !prevChecked);
    };

    const [listHomestayAmenitiesAPI, setListHomestayAmenitiesAPI] =
        useState<any>([]);
    const [listHomestayAmenitiesInitValue, setListHomestayAmenitiesInitValue] =
        useState<any>([]);
    const [listHomestayPoliciesAPI, setListHomestayPoliciesAPI] = useState<any>(
        [],
    );
    const [listHomestayPoliciesInitValue, setListHomestayPoliciesInitValue] =
        useState<any>([]);
    const [dataProvince, setDataProvince] = useState<ProvincesType>({
        province_id: -1,
        province_name: '',
        province_type: '',
    });
    const [searchResultsProvinces, setSearchResultsProvinces] = useState<
        ProvincesType[]
    >([]);
    const [searchResultsAPIProvinces, setSearchResultsAPIProvinces] = useState<
        ProvincesType[]
    >([]);
    const [showOption, setShowOption] = useState<Boolean>(false);
    const handleInputChange = (event: any) => {
        const term = event.target.value;
        if (!term) {
            setDataProvince({
                ...dataProvince,
                province_name: term,
                province_id: -1,
            });
            setSearchResultsProvinces(searchResultsAPIProvinces);
            return;
        }
        setShowOption(true);

        setDataProvince({
            ...dataProvince,
            province_id: -1,
            province_name: term,
        });

        const filteredResults = searchResultsAPIProvinces.filter((option) =>
            option.province_name.includes(term),
        );
        setSearchResultsProvinces(filteredResults);
    };

    const handleResultClick = (result: ProvincesType) => {
        setDataProvince(result);
        setShowOption(false);
    };

    // WARD: phường
    const [dataWard, setDataWard] = useState<WardType>({
        ward_id: -1,
        ward_name: '',
    });
    const [searchResultsWard, setSearchResultsWard] = useState<WardType[]>([]);
    const [searchResultsAPIWard, setSearchResultsAPIWard] = useState<
        WardType[]
    >([]);
    const [showOptionWard, setShowOptionWard] = useState<Boolean>(false);
    const [initValueHomestay, setInitValueHomestay] = useState<any>();
    const [listOtherAmenitiesHomestay, setListOtherAmenitiesHomestay] =
        useState<any>([]);
    const handleInputChangeWard = (event: any) => {
        const term = event.target.value;
        if (!term) {
            setShowOptionWard(false);
            setDataWard({ ...dataWard, ward_name: term, ward_id: -1 });
            return;
        }
        setShowOptionWard(true);
        setDataWard({ ...dataWard, ward_name: term, ward_id: -1 });
        const filteredResultsWard = searchResultsAPIWard.filter((option) =>
            option.ward_name.includes(term),
        );
        setSearchResultsWard(filteredResultsWard);
    };

    const handleResultClickWard = (result: WardType) => {
        setDataWard(result);
        setShowOptionWard(false);
    };

    // DISTRICT: QUẬN
    const [dataDistrict, setDataDistrict] = useState<DistrictType>({
        district_id: -1,
        district_name: '',
    });
    const [searchResultsDistrict, setSearchResultsDistrict] = useState<
        DistrictType[]
    >([]);
    const [searchResultsAPIDistrict, setSearchResultsAPIDistrict] = useState<
        DistrictType[]
    >([]);
    const [showOptionDistrict, setShowOptionDistrict] =
        useState<Boolean>(false);

    const handleInputChangeDistrict = (event: any) => {
        const term = event.target.value;
        if (!term) {
            setShowOptionDistrict(false);
            setDataDistrict({
                ...dataDistrict,
                district_name: term,
                district_id: -1,
            });
            return;
        }
        setShowOptionDistrict(true);

        setDataDistrict({
            ...dataDistrict,
            district_name: term,
            district_id: -1,
        });

        const filteredResultsDistrict = searchResultsAPIDistrict.filter(
            (option) => option.district_name.includes(term),
        );
        setSearchResultsDistrict(filteredResultsDistrict);
    };

    const handleResultClickDistrict = (result: DistrictType) => {
        setDataDistrict(result);
        setShowOptionDistrict(false);
        console.log(result);
    };

    useEffect(() => {
        const fetchData = async (id: string) => {
            try {
                setIsSubmit(true);
                const responseProvinces = await axios.get(
                    'https://vapi.vnappmob.com/api/province',
                );
                const responseHomestay = await homestayAPI.getDetail(id);
                const responseHomestayAmenities =
                    await homestayAPI.getListAmenities();
                const responseHomestayPolicies =
                    await homestayAPI.getListPolicies();
                const responseHomestayPoliciesSelected =
                    await homestayAPI.getListPoliciesOfHomestay(id);

                setSearchResultsAPIProvinces(responseProvinces.data.results);

                //set data for homestay
                const initValueHomestayLoad = {
                    nameHomestay: responseHomestay?.data?.name ?? '',
                    addressHomestay: responseHomestay?.data?.address ?? '',
                    infoHomestay: responseHomestay?.data?.description ?? '',
                    acreageSum: responseHomestay?.data?.acreage ?? 0,
                    province: responseHomestay?.data?.city ?? '',
                    district: responseHomestay?.data?.district ?? '',
                    ward: responseHomestay?.data?.commune ?? '',
                    penaltyRate: responseHomestay?.data?.penaltyRate ?? 0,
                    penaltyDate: responseHomestay?.data?.penaltyDate ?? 0,
                    depositRate: responseHomestay?.data?.depositRate ?? 20,
                    licenseFile: responseHomestay?.data?.licenseFile,                
                    streetName: responseHomestay?.data?.street ?? '',
                    house: responseHomestay?.data?.house ?? '',
                    hamlet: responseHomestay?.data?.hamlet ?? '',
                    status: responseHomestay?.data?.status ?? 'UNKNOWN',
                };
                const provincesSelected =
                    responseProvinces?.data?.results?.filter(
                        (province: any) =>
                            province?.province_name ===
                            responseHomestay?.data?.city,
                    );
                setDataProvince(provincesSelected[0]);
                setInitValueHomestay(initValueHomestayLoad);
                setImgSrc(responseHomestay?.data?.images[0]?.url);
                // set data homestay for init value
                console.log('data check', responseHomestay?.data);

                // set data amenities of homestay
                setListHomestayAmenitiesAPI(
                    responseHomestayAmenities?.data ?? [],
                );
                const initAmenitiesHomestay =
                    responseHomestayAmenities?.data?.map((a: any) => {
                        let arrayAmenitiesSelectedBefore;
                        let arrayOtherAmenitiesSelected;
                        for (
                            let i = 0;
                            i <
                            responseHomestay?.data
                                ?.homeStayGeneralAmenitieTitles?.length;
                            i++
                        ) {
                            if (
                                responseHomestay?.data
                                    ?.homeStayGeneralAmenitieTitles[i]
                                    ?.generalAmenitieTitleId === a?.id
                            ) {
                                arrayAmenitiesSelectedBefore =
                                    responseHomestay?.data?.homeStayGeneralAmenitieTitles[
                                        i
                                    ]?.generalAmenitieSelecteds?.map(
                                        (amenitySelected: any) =>
                                            amenitySelected?.generalAmenitie
                                                ?.id,
                                    );
                            }
                            if (
                                responseHomestay?.data
                                    ?.homeStayGeneralAmenitieTitles[i]
                                    ?.generalAmenitieTitle?.name === 'Khác'
                            ) {
                                arrayOtherAmenitiesSelected =
                                    responseHomestay?.data?.homeStayGeneralAmenitieTitles[
                                        i
                                    ]?.generalAmenitieSelecteds?.map(
                                        (amenitySelected: any) =>
                                            amenitySelected?.generalAmenitie
                                                ?.name ?? '',
                                    );
                            }
                        }
                        setListOtherAmenitiesHomestay(
                            arrayOtherAmenitiesSelected ?? [],
                        );
                        if (arrayOtherAmenitiesSelected?.length > 0) {
                            setIsChecked(true);
                        }
                        return {
                            amenitieTitleId: a?.id,
                            name: a?.name,
                            generalAmenitieSelecteds:
                                arrayAmenitiesSelectedBefore ?? [],
                        };
                    });

                setListHomestayAmenitiesInitValue(initAmenitiesHomestay ?? []);
                // set data policies for homestay

                setListHomestayPoliciesAPI(
                    responseHomestayPolicies?.data ?? [],
                );
                const initPolicies = responseHomestayPolicies?.data?.map(
                    (p: any) => {
                        let policiesSelectedBefore;
                        for (
                            let i = 0;
                            i < responseHomestayPoliciesSelected?.data?.length;
                            i++
                        ) {
                            if (
                                responseHomestayPoliciesSelected?.data[i]
                                    ?.policyTitleId === p?.id
                            ) {
                                policiesSelectedBefore =
                                    responseHomestayPoliciesSelected?.data[i]
                                        ?.policy?.id;
                            }
                        }
                        return {
                            policyTitleId: p?.id,
                            policyId: policiesSelectedBefore ?? '',
                        };
                    },
                );
                setListHomestayPoliciesInitValue(initPolicies ?? []);
                setIsSubmit(false);
            } catch (error) {
                console.log('Error fetching data', error);
                setIsSubmit(false);
                toast.error('Lấy dữ liệu thất bại!');
            }
        };

        if (homestayId) {
            fetchData(homestayId);
        }
    }, [homestayId]);

    useEffect(() => {
        const fetchListDistrict = async () => {
            try {
                const response = await axios.get(
                    `https://vapi.vnappmob.com/api/province/district/${dataProvince.province_id}`,
                );
                setSearchResultsAPIDistrict(response.data.results);
                const districtSelected = response?.data?.results?.filter(
                    (district: any) =>
                        district.district_name === initValueHomestay?.district,
                );
                setDataDistrict(
                    districtSelected[0] ?? {
                        district_id: -1,
                        district_name: '',
                    },
                );
            } catch (error) {
                console.log(error);
            }
        };
        if (dataProvince.province_id !== -1) fetchListDistrict();
    }, [dataProvince]);

    useEffect(() => {
        const fetchListWard = async () => {
            try {
                const response = await axios.get(
                    `https://vapi.vnappmob.com/api/province/ward/${dataDistrict.district_id}`,
                );
                setSearchResultsAPIWard(response.data.results);
                const wardSelected = response?.data?.results?.filter(
                    (ward: any) => ward.ward_name === initValueHomestay?.ward,
                );
                setDataWard(
                    wardSelected[0] ?? {
                        ward_id: -1,
                        ward_name: '',
                    },
                );
            } catch (error) {
                console.log(error);
            }
        };
        if (dataDistrict.district_id !== -1) fetchListWard();
    }, [dataDistrict]);

    const [imgSrc, setImgSrc] = useState<string>('');
    const { auth }: any = useAuth();

    return (
        <div className="flex flex-col gap-2.5 xl:flex-row">
            {/* Loading when submit */}
            {isSubmit && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <span className="item-center flex h-[500px] w-[500px] flex-col justify-center gap-3">
                        <h2 className="text-2xl font-bold text-white">
                            Đang tải dữ liệu...
                        </h2>
                        <span className="ml-[80px] h-[30px] w-[30px] animate-ping rounded-full bg-info"></span>
                    </span>
                </div>
            )}
            {listHomestayAmenitiesInitValue?.length > 0 &&
                listHomestayPoliciesInitValue?.length > 0 && (
                    <Formik
                        innerRef={formikRef}
                        initialValues={{
                            nameHomestay: initValueHomestay?.nameHomestay,
                            addressHomestay: initValueHomestay?.addressHomestay,
                            infoHomestay: initValueHomestay?.infoHomestay,
                            acreageSum: initValueHomestay?.acreageSum,                          
                            province: initValueHomestay?.province,
                            district: initValueHomestay?.district,
                            ward: initValueHomestay?.ward,
                            thumnailImage: null,
                            penaltyRate: initValueHomestay?.penaltyRate,
                            penaltyDate: initValueHomestay?.penaltyDate,
                            depositRate: initValueHomestay?.depositRate,
                            homeStayPolicySelecteds:
                                listHomestayPoliciesInitValue,
                            streetName: initValueHomestay?.streetName,
                            house: initValueHomestay?.house,
                            hamlet: initValueHomestay?.hamlet,
                            listExtension: listOtherAmenitiesHomestay,
                            homeStayAmenitieTitles:
                                listHomestayAmenitiesInitValue,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            setIsSubmit(true);
                            console.log('test values before submit', values);
                            //return;
                            if (homestayId) {
                                const dataSubmitHomestay = new FormData();
                                dataSubmitHomestay.append(
                                    'homeStay.id',
                                    homestayId ?? '',
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.name',
                                    values.nameHomestay,
                                );
                                dataSubmitHomestay.append(
                                    'checkInTime',
                                    "14:00",
                                );
                                dataSubmitHomestay.append(
                                    'checkOutTime',
                                    "12:00",
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.acreage',
                                    values.acreageSum,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.city',
                                    values.province,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.district',
                                    values.district,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.commune',
                                    values.ward,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.street',
                                    values.streetName,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.house',
                                    values.house,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.hamlet',
                                    values.hamlet,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.address',
                                    values.addressHomestay,
                                );                           
                                dataSubmitHomestay.append(
                                    'homeStay.description',
                                    values.infoHomestay,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.depositRate',
                                    values.depositRate,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.penaltyDate',
                                    values.penaltyDate,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.penaltyRate',
                                    values.penaltyRate,
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.status',
                                    initValueHomestay?.status ?? 'ACTIVE',
                                );
                                if (values.thumnailImage) {
                                    dataSubmitHomestay.append(
                                        'images',
                                        values.thumnailImage,
                                    );
                                }
                                dataSubmitHomestay.append(
                                    'homeStay.ownerId',
                                    auth?.user?.id,
                                );
                                let homestayAmenitiesFilter =
                                    values?.homeStayAmenitieTitles?.filter(
                                        (ha: any) =>
                                            ha.generalAmenitieSelecteds
                                                ?.length > 0,
                                    );
                                for (
                                    let i = 0;
                                    i < homestayAmenitiesFilter?.length;
                                    i++
                                ) {
                                    dataSubmitHomestay.append(
                                        `homeStayAmenitieTitles[${i}].amenitieTitleId`,
                                        homestayAmenitiesFilter[i]
                                            .amenitieTitleId,
                                    );
                                    for (
                                        let j = 0;
                                        j <
                                        homestayAmenitiesFilter[i]
                                            ?.generalAmenitieSelecteds?.length;
                                        j++
                                    ) {
                                        dataSubmitHomestay.append(
                                            `homeStayAmenitieTitles[${i}].generalAmenitieSelecteds[${j}]`,
                                            homestayAmenitiesFilter[i]
                                                .generalAmenitieSelecteds[j],
                                        );
                                    }
                                }
                                // Gắn các tiện ích khác của homestay
                                if (values.listExtension?.length > 0) {
                                    for (
                                        let i = 0;
                                        i < values.listExtension?.length;
                                        i++
                                    ) {
                                        dataSubmitHomestay.append(
                                            `otherGeneralAmenities[${i}]`,
                                            values.listExtension[i],
                                        );
                                    }
                                }
                                // Gắn policies
                                let homestayPoliciesFilter =
                                    values.homeStayPolicySelecteds?.filter(
                                        (hl: any) => hl.policyId !== '',
                                    );
                                for (
                                    let i = 0;
                                    i < homestayPoliciesFilter?.length;
                                    i++
                                ) {
                                    dataSubmitHomestay.append(
                                        `homeStayPolicySelecteds[${i}].policyTitleId`,
                                        homestayPoliciesFilter[i]
                                            ?.policyTitleId,
                                    );
                                    dataSubmitHomestay.append(
                                        `homeStayPolicySelecteds[${i}].policyId`,
                                        homestayPoliciesFilter[i].policyId,
                                    );
                                }

                                try {
                                    const response: any =
                                        await homestayAPI.updateHomestayGeneralInformation(
                                            dataSubmitHomestay,
                                            homestayId,
                                        );
                                    toast.success(
                                        response.msg ?? 'Cập nhật thành công',
                                    );
                                    setIsUpdate(false);
                                } catch (error: any) {
                                    toast.error(
                                        error?.response?.data?.msg ??
                                            'Cập nhật thất bại',
                                    );
                                } finally {
                                    setIsSubmit(false);
                                }
                            }

                            //setIsSubmit(false)
                        }}
                    >
                        {({ values }) => (
                            <Form className="panel flex flex-1 flex-col px-0 py-6 md:flex-row ltr:xl:mr-6 rtl:xl:ml-6">
                                <div className="panel flex-1 ltr:xl:mr-6 rtl:xl:ml-6">
                                    <div className="flex flex-wrap justify-between px-4">
                                        <div className="mb-6 w-full lg:w-1/2">
                                            {imgSrc && (
                                                <img
                                                    alt="avatar"
                                                    src={imgSrc}
                                                    className="h-[500px] w-full"
                                                />
                                            )}
                                            <Field name="thumnailImage">
                                                {({
                                                    field,
                                                    form,
                                                    meta,
                                                }: any) => (
                                                    <>
                                                        <label
                                                            htmlFor="thumnailImage"
                                                            className="btn btn-primary mb-2 me-2 mt-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-1 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:shadow-lg dark:shadow-blue-800/80 dark:focus:ring-blue-800"
                                                        >
                                                            <IconCamera className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                            Chọn hình Thumnail
                                                            <input
                                                                hidden
                                                                type="file"
                                                                id="thumnailImage"
                                                                accept="image/png, image/jpeg"
                                                                onChange={(
                                                                    event: any,
                                                                ) => {
                                                                    const reader =
                                                                        new FileReader();
                                                                    const files =
                                                                        event
                                                                            .currentTarget
                                                                            .files;
                                                                    if (
                                                                        files &&
                                                                        files.length !==
                                                                            0
                                                                    ) {
                                                                        reader.onload =
                                                                            () =>
                                                                                setImgSrc(
                                                                                    reader.result as string,
                                                                                );
                                                                        reader.readAsDataURL(
                                                                            files[0],
                                                                        );
                                                                    }
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        event
                                                                            .currentTarget
                                                                            .files[0],
                                                                    );
                                                                }}
                                                            />
                                                        </label>

                                                        {meta.touched &&
                                                            !!meta.error && (
                                                                <div
                                                                    style={{
                                                                        color: '#F8719D',
                                                                    }}
                                                                >
                                                                    {meta.error}
                                                                </div>
                                                            )}
                                                    </>
                                                )}
                                            </Field>
                                        </div>
                                        <div className="w-full lg:w-1/2 lg:max-w-fit">
                                            <div className="flex items-center">
                                                <label
                                                    htmlFor="nameHomestay"
                                                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Tên Homestay
                                                </label>
                                                <div>
                                                    <Field
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="nameHomestay"
                                                        type="text"
                                                        name="nameHomestay"
                                                        placeholder="#Vui lòng nhập tên Homestay"
                                                        disabled
                                                    />
                                                    <div className="text-red-400">
                                                        <ErrorMessage
                                                            component="a"
                                                            name="nameHomestay"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="infoHomestay"
                                                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Mô Tả Homestay
                                                </label>
                                                <div>
                                                    <Field
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="infoHomestay"
                                                        type="text"
                                                        name="infoHomestay"
                                                        placeholder="#Vui lòng nhập mô tả Homestay"
                                                    />
                                                    <div className="text-red-400">
                                                        {' '}
                                                        <ErrorMessage
                                                            component="a"
                                                            name="infoHomestay"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="acreageSum"
                                                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Diện tích tổng Homestay
                                                </label>
                                                <div>
                                                    <Field
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="acreageSum"
                                                        type="number"
                                                        name="acreageSum"
                                                        placeholder="#Diện tích Homestay"
                                                        disable
                                                    />

                                                    <div className="text-red-400">
                                                        {' '}
                                                        <ErrorMessage
                                                            component="a"
                                                            name="acreageSum"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                                        m²
                                                    </span>
                                                </div>
                                            </div>                                     
                                        </div>
                                    </div>
                                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                    {/* //TODO: */}
                                    <div className="flex flex-col justify-between lg:flex-row">
                                        {/* Column 1 */}
                                        <div className="mb-6 w-full lg:w-1/2">
                                            <div className="text-black-500 mb-2 ml-4 text-lg font-bold">
                                                Thông Tin Địa Chỉ Homestay:
                                            </div>
                                            {/* Thành Phố(Tỉnh), quận( huyện), phường( xã) */}
                                            <div className="relative mt-4 flex items-center">
                                                <label
                                                    htmlFor="city"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Thành Phố (Tỉnh)
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="city"
                                                        type="text"
                                                        placeholder="#Nhập thành phố"
                                                        value={
                                                            dataProvince.province_name
                                                        }
                                                        disabled
                                                        onFocus={() => {
                                                            setShowOption(
                                                                // (prevOption) =>
                                                                //     !prevOption,
                                                                true,
                                                            );
                                                            setSearchResultsProvinces(
                                                                searchResultsAPIProvinces,
                                                            );
                                                        }}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        onBlur={() => {
                                                            if (
                                                                dataProvince.province_id !==
                                                                -1
                                                            ) {
                                                                setShowOption(
                                                                    false,
                                                                );
                                                            }
                                                        }}
                                                        autoComplete="off"
                                                    />
                                                    <div
                                                        id="searchResults"
                                                        className={`absolute left-[50] top-full z-10 mt-2 max-h-[250px] min-w-[250px] max-w-[440px] overflow-y-scroll rounded-md border bg-white ${
                                                            showOption
                                                                ? ''
                                                                : 'hidden'
                                                        }`}
                                                    >
                                                        {searchResultsProvinces.length ===
                                                            0 && (
                                                            <div className="text-center">
                                                                Không Kết Quả
                                                                Tìm Kiếm Phù Hợp
                                                            </div>
                                                        )}
                                                        {searchResultsProvinces.length >
                                                            0 &&
                                                            searchResultsProvinces.map(
                                                                (result) => (
                                                                    <div
                                                                        key={
                                                                            result.province_id
                                                                        }
                                                                        className=" cursor-pointer p-2 hover:bg-gray-100"
                                                                        onClick={() =>
                                                                            handleResultClick(
                                                                                result,
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            result.province_name
                                                                        }
                                                                    </div>
                                                                ),
                                                            )}
                                                    </div>
                                                    <div className="text-red-400">
                                                        {' '}
                                                        <ErrorMessage
                                                            component="a"
                                                            name="province"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mt-4 flex items-center">
                                                <label
                                                    htmlFor="district"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Quận (Huyện)
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="district"
                                                        type="text"
                                                        placeholder="#Nhập quận"
                                                        disabled
                                                        value={
                                                            dataDistrict.district_name
                                                        }
                                                        onFocus={() => {
                                                            setShowOptionDistrict(
                                                                true,
                                                            );
                                                            setSearchResultsDistrict(
                                                                searchResultsAPIDistrict,
                                                            );
                                                        }}
                                                        onBlur={() => {
                                                            if (
                                                                dataDistrict.district_id !==
                                                                -1
                                                            ) {
                                                                setShowOptionDistrict(
                                                                    false,
                                                                );
                                                            }
                                                        }}
                                                        onChange={
                                                            handleInputChangeDistrict
                                                        }
                                                        autoComplete="off"
                                                    />
                                                    <div
                                                        id="searchResultsDistrict"
                                                        className={`absolute left-[50] top-full z-10 mt-2 max-h-[250px] min-w-[250px] max-w-[440px] overflow-y-scroll rounded-md border bg-white ${
                                                            showOptionDistrict
                                                                ? ''
                                                                : 'hidden'
                                                        }`}
                                                    >
                                                        {searchResultsDistrict.length ===
                                                            0 && (
                                                            <div className="text-center">
                                                                Không Kết Quả
                                                                Tìm Kiếm Phù Hợp
                                                            </div>
                                                        )}
                                                        {searchResultsDistrict.length >
                                                            0 &&
                                                            searchResultsDistrict.map(
                                                                (result) => (
                                                                    <div
                                                                        key={
                                                                            result.district_id
                                                                        }
                                                                        className=" cursor-pointer p-2 hover:bg-gray-100"
                                                                        onClick={() =>
                                                                            handleResultClickDistrict(
                                                                                result,
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            result.district_name
                                                                        }
                                                                    </div>
                                                                ),
                                                            )}
                                                    </div>
                                                    <div className="text-red-400">
                                                        {' '}
                                                        <ErrorMessage
                                                            component="a"
                                                            name="district"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mt-4 flex items-center">
                                                <label
                                                    htmlFor="salle"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Phường (Xã)
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="salle"
                                                        type="text"
                                                        placeholder="#Nhập phường"
                                                        value={
                                                            dataWard.ward_name
                                                        }
                                                        onChange={
                                                            handleInputChangeWard
                                                        }
                                                        onFocus={() => {
                                                            setShowOptionWard(
                                                                true,
                                                            );
                                                            setSearchResultsWard(
                                                                searchResultsAPIWard,
                                                            );
                                                        }}
                                                        onBlur={() => {
                                                            if (
                                                                dataWard.ward_id !==
                                                                -1
                                                            ) {
                                                                setShowOptionWard(
                                                                    false,
                                                                );
                                                            }
                                                        }}
                                                        autoComplete="off"
                                                        disabled
                                                        // disabled={
                                                        //     dataDistrict.district_id ===
                                                        //     -1
                                                        //         ? true
                                                        //         : false
                                                        // }
                                                    />
                                                    <div
                                                        id="searchResultsWard"
                                                        className={`absolute left-[50] top-full z-10 mt-2 max-h-[250px] min-w-[250px] max-w-[440px] overflow-y-scroll rounded-md border bg-white ${
                                                            showOptionWard
                                                                ? ''
                                                                : 'hidden'
                                                        }`}
                                                    >
                                                        {searchResultsWard.length ===
                                                            0 && (
                                                            <div className="text-center">
                                                                Không Kết Quả
                                                                Tìm Kiếm Phù Hợp
                                                            </div>
                                                        )}
                                                        {searchResultsWard.length >
                                                            0 &&
                                                            searchResultsWard.map(
                                                                (result) => (
                                                                    <div
                                                                        key={
                                                                            result.ward_id
                                                                        }
                                                                        className=" cursor-pointer p-2 hover:bg-gray-100"
                                                                        onClick={() =>
                                                                            handleResultClickWard(
                                                                                result,
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            result.ward_name
                                                                        }
                                                                    </div>
                                                                ),
                                                            )}
                                                    </div>
                                                    <div className="text-red-400">
                                                        {' '}
                                                        <ErrorMessage
                                                            component="a"
                                                            name="ward"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Các trường khác của Column 1 */}
                                            {/* ... */}
                                        </div>

                                        {/* Column 2 */}
                                        <div className="mb-6 w-full lg:w-1/2">
                                            {/* khu nhà, ấp, số nhà, tên đường */}
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="streetName"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Tên Đường
                                                </label>
                                                <div>
                                                    <Field
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        disabled
                                                        id="streetName"
                                                        type="text"
                                                        name="streetName"
                                                        placeholder="#Nhập tên đường"
                                                    />
                                                    <div className="text-red-400">
                                                        {' '}
                                                        <ErrorMessage
                                                            component="a"
                                                            name="streetName"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="Maison"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Khu Nhà
                                                </label>
                                                <div>
                                                    <Field
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="Maison"
                                                        type="text"
                                                        name="house"
                                                        placeholder="#Nhập khu nhà"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="Hamlet"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Ấp
                                                </label>
                                                <div>
                                                    <Field
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="Hamlet"
                                                        type="text"
                                                        name="hamlet"
                                                        placeholder="#Nhập ấp"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="addressHomestay"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Số Địa Chỉ
                                                </label>
                                                <div>
                                                    <Field
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="addressHomestay"
                                                        type="text"
                                                        name="addressHomestay"
                                                        placeholder="#Nhập địa chỉ chi tiết"
                                                        disabled
                                                    />
                                                    <div className="text-red-400">
                                                        {' '}
                                                        <ErrorMessage
                                                            component="a"
                                                            name="addressHomestay"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Các trường khác của Column 2 */}
                                            {/* ... */}
                                        </div>
                                    </div>

                                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                    <div className="text-black-500 mb-2 ml-4 text-lg font-bold">
                                        Chính Sách & Thông Tin
                                    </div>
                                    {listHomestayPoliciesAPI?.map(
                                        (policy: any, index: any) => (
                                            <div
                                                className="relative mx-auto mb-4 w-full max-w-[800px] overflow-hidden rounded-md"
                                                key={policy?.id}
                                            >
                                                <input
                                                    className="peer absolute inset-x-0 top-0 z-10 h-12 w-full cursor-pointer opacity-0"
                                                    type="checkbox"
                                                />
                                                <div className="flex h-12 w-full items-center border-2 border-dashed border-indigo-600 pl-5">
                                                    <h1 className="rounded-lg text-lg font-semibold text-black">
                                                        {policy?.name}
                                                    </h1>
                                                </div>
                                                <div className="absolute right-3 top-3 rotate-0 text-black transition-transform duration-500 peer-checked:rotate-180">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="h-6 w-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="max-h-0 overflow-hidden bg-white transition-all duration-500 peer-checked:max-h-full">
                                                    <div className="space-y-2 p-4">
                                                        {/* Render các lựa chọn */}
                                                        {policy?.policies?.map(
                                                            (
                                                                option: any,
                                                                index2: any,
                                                            ) => (
                                                                <>
                                                                    <div
                                                                        className="flex items-center"
                                                                        key={
                                                                            option?.id
                                                                        }
                                                                    >
                                                                        <Field
                                                                            name={`homeStayPolicySelecteds[${index}].policyId`}
                                                                        >
                                                                            {({
                                                                                field,
                                                                                form,
                                                                            }: any) => (
                                                                                <label className="inline-flex">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                            values
                                                                                                .homeStayPolicySelecteds[
                                                                                                index
                                                                                            ]
                                                                                                ?.policyId ===
                                                                                            option.id
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) => {
                                                                                            if (
                                                                                                e
                                                                                                    .target
                                                                                                    .checked
                                                                                            ) {
                                                                                                form.setFieldValue(
                                                                                                    field.name,
                                                                                                    option?.id,
                                                                                                );
                                                                                            } else {
                                                                                                form.setFieldValue(
                                                                                                    field.name,
                                                                                                    '',
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                        className="peer form-checkbox outline-primary"
                                                                                    />
                                                                                    <span className="peer-checked:text-primary">
                                                                                        {
                                                                                            option?.description
                                                                                        }
                                                                                    </span>
                                                                                </label>
                                                                            )}
                                                                        </Field>
                                                                    </div>
                                                                    <div className=" text-gray-500">
                                                                        {
                                                                            option?.subDescription
                                                                        }
                                                                    </div>
                                                                </>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}

                                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                    <div className="text-black-500 mb-2 ml-4 text-lg font-bold">
                                        Tiện Ích Chung Dành Cho Homestay
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        {listHomestayAmenitiesAPI?.map(
                                            (amenity: any, index: any) => (
                                                <div key={amenity?.id}>
                                                    <div className="rounded p-4">
                                                        {/* title commom */}
                                                        <div className="mb-2 flex items-center font-bold">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="h-6 w-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                                                                />
                                                            </svg>{' '}
                                                            {amenity?.name}
                                                        </div>
                                                        {/* render list amenity detail of it's title */}
                                                        {amenity?.generalAmenities?.map(
                                                            (
                                                                amenityDetail: any,
                                                                index2: any,
                                                            ) => {
                                                                return (
                                                                    <div
                                                                        className="space-y-2"
                                                                        key={
                                                                            amenityDetail?.id
                                                                        }
                                                                    >
                                                                        <Field
                                                                            name={`homeStayAmenitieTitles[${index}].generalAmenitieSelecteds`}
                                                                        >
                                                                            {({
                                                                                field,
                                                                                form,
                                                                            }: any) => (
                                                                                <label className="inline-flex">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                            values.homeStayAmenitieTitles[
                                                                                                index
                                                                                            ]?.generalAmenitieSelecteds?.findIndex(
                                                                                                (
                                                                                                    e: any,
                                                                                                ) =>
                                                                                                    e ===
                                                                                                    amenityDetail?.id,
                                                                                            ) ===
                                                                                            -1
                                                                                                ? false
                                                                                                : true
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) => {
                                                                                            if (
                                                                                                e
                                                                                                    .target
                                                                                                    .checked
                                                                                            ) {
                                                                                                console.log(
                                                                                                    'zo check',
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                    ' ----- ',
                                                                                                    amenityDetail?.id,
                                                                                                    ' ----- ',
                                                                                                    values
                                                                                                        .homeStayAmenitieTitles[
                                                                                                        index
                                                                                                    ]
                                                                                                        ?.amenitieTitleId,
                                                                                                );
                                                                                                const newArray =
                                                                                                    [
                                                                                                        ...values
                                                                                                            .homeStayAmenitieTitles[
                                                                                                            index
                                                                                                        ]
                                                                                                            ?.generalAmenitieSelecteds,
                                                                                                        amenityDetail?.id,
                                                                                                    ];
                                                                                                console.log(
                                                                                                    'new array nè: ',
                                                                                                    newArray,
                                                                                                    field?.name,
                                                                                                );
                                                                                                form.setFieldValue(
                                                                                                    field.name,
                                                                                                    newArray,
                                                                                                );
                                                                                            } else {
                                                                                                console.log(
                                                                                                    'k zo check',
                                                                                                    amenityDetail?.id,
                                                                                                    values.homeStayAmenitieTitles,
                                                                                                );
                                                                                                const newArray =
                                                                                                    values.homeStayAmenitieTitles[
                                                                                                        index
                                                                                                    ]?.generalAmenitieSelecteds?.filter(
                                                                                                        (
                                                                                                            e: any,
                                                                                                        ) =>
                                                                                                            e !==
                                                                                                            amenityDetail?.id,
                                                                                                    );

                                                                                                form.setFieldValue(
                                                                                                    field.name,
                                                                                                    newArray,
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                        className="peer form-checkbox outline-primary"
                                                                                    />
                                                                                    <span className="peer-checked:text-primary">
                                                                                        {
                                                                                            amenityDetail?.name
                                                                                        }
                                                                                    </span>
                                                                                </label>
                                                                            )}
                                                                        </Field>
                                                                    </div>
                                                                );
                                                                // )
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    <div className="rounded p-4">
                                        <div className="mb-2 flex items-center font-bold"></div>
                                        <div className="space-y-2">
                                            <label className="inline-flex">
                                                <input
                                                    type="checkbox"
                                                    className="peer form-checkbox outline-primary"
                                                    checked={isChecked}
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                />
                                                <span className="peer-checked:text-primary">
                                                    Khác
                                                </span>
                                            </label>
                                            {/* Thêm các option khác nếu cần */}
                                        </div>
                                        {isChecked && (
                                            <FieldArray name="listExtension">
                                                {({ push, remove }) => (
                                                    <div className="grid grid-cols-3 gap-4">
                                                        {values.listExtension.map(
                                                            (
                                                                extension: any,
                                                                index: any,
                                                            ) => (
                                                                <div
                                                                    className="mt-8 flex items-center px-4"
                                                                    key={index}
                                                                >
                                                                    <div className="w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                                                                        <div className="text-lg font-bold">
                                                                            {/* Tiện Ích{' '} */}
                                                                            {index +
                                                                                1}
                                                                            .
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex-grow sm:mb-0">
                                                                        <Field
                                                                            className="form-input w-full lg:w-[200px]"
                                                                            id={`extension${index}`}
                                                                            type="text"
                                                                            name={`listExtension.${index}`}
                                                                            placeholder={`#Nhập tiện ích ${index + 1}`}
                                                                        />
                                                                        <div className="text-red-400">
                                                                            {' '}
                                                                            <ErrorMessage
                                                                                component="a"
                                                                                name={`listExtension.${index}`}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        className="btn btn-outline-danger ml-2 rounded-lg p-2 font-extrabold"
                                                                        onClick={() => {
                                                                            remove(
                                                                                index,
                                                                            );
                                                                        }}
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}
                                                        <div className="mb-6 mt-5 flex items-center justify-center sm:mb-0">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary mb-2 me-2 rounded-lg border-t-cyan-50 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-purple-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-purple-300 dark:shadow-lg dark:shadow-purple-800/80 dark:focus:ring-purple-800"
                                                                onClick={() =>
                                                                    push('')
                                                                }
                                                            >
                                                                Thêm Tiện Ích
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldArray>
                                        )}
                                    </div>
                                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                    <div className="text-black-500 mb-2 ml-4 text-lg font-bold">
                                        Các Thông Tin Thanh Toán:
                                    </div>
                                    <div className="mb-2 ml-4 flex items-center">
                                        <h2 className="mr-2 text-sm font-bold">
                                            1. Số % Tiền Cọc:
                                        </h2>
                                        <Field
                                            as="select"
                                            name="depositRate"
                                            title="Số tiền mà khách hàng sẽ đặt cọc cho đơn đặt phòng homestay của bạn theo tỉ lệ (%) dựa trên tổng số tiền của đơn (20%/30%/40%/50%)"
                                            className="mr-4 rounded-md border border-gray-300 px-2 py-1 text-sm"
                                        >
                                            <option value={20}>20%</option>
                                            <option value={30}>30%</option>
                                            <option value={40}>40%</option>
                                            <option value={50}>50%</option>
                                        </Field>
                                    </div>
                                    <div className="mb-2 ml-4 flex items-start">
                                        <h2 className="mr-2 text-sm font-bold">
                                            2. Huỷ đơn trong vòng:
                                        </h2>
                                        <div className="flex flex-col items-center">
                                            <Field name="penaltyDate">
                                                {({ field, form }: any) => (
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        className="mr-2 w-[60px] rounded-md border border-gray-300 px-2 py-1 text-center text-sm"
                                                        title="Trong khoảng từ ngày đặt đến ngày Checkin của đơn đặt phòng nếu khách hàng hủy đơn sẽ phải đền 1 số tiền mà bạn sẽ đề ra bên dưới (0/1/2/3/4/5)"
                                                        onChange={(e) => {
                                                            if(e.target.value){            
                                                            if (
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) > 0
                                                            ) {
                                                                formikRef?.current?.setFieldValue(
                                                                    'penaltyRate',
                                                                    10,
                                                                );
                                                            } else {
                                                                formikRef?.current?.setFieldValue(
                                                                    'penaltyRate',
                                                                    0,
                                                                );
                                                            }
                                                            form.setFieldValue(
                                                                field.name,
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            );
                                                        }}}
                                                    />
                                                )}
                                            </Field>
                                            <div className="text-red-400">
                                                {' '}
                                                <ErrorMessage
                                                    component="a"
                                                    name={`penaltyDate`}
                                                    className="font-bold"
                                                />
                                            </div>
                                        </div>
                                        <span className="mr-2 text-sm font-bold">
                                            ngày.
                                        </span>
                                        <span className="mr-2 text-sm font-bold">
                                            Trước ngày Checkin bị phạt:{' '}
                                        </span>
                                        <Field
                                            as="select"
                                            name="penaltyRate"
                                            disabled={
                                                values.penaltyDate > 0
                                                    ? false
                                                    : true
                                            }
                                            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                                            title="Số tiền mà khách hàng sẽ phải đền nếu hủy đơn đặt phòng gần đến hạn ngày check in mà bạn đã đưa ra bên trên, đền theo tỉ lệ (%) trên tổng tiền cọc mà khách hàng đã trả (0%/10%/20%/30%)"
                                        >
                                            <option
                                                value={0}
                                                disabled={
                                                    values.penaltyDate > 0
                                                        ? true
                                                        : false
                                                }
                                            >
                                                0%
                                            </option>
                                            <option value={10}>10%</option>
                                            <option value={20}>20%</option>
                                            <option value={30}>30%</option>
                                        </Field>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <p className="text-base italic">
                                            * Huỷ đơn trong vòng:{' '}
                                            <span className="font-bold">
                                                {values.penaltyDate} ngày
                                            </span>{' '}
                                            nghĩa là nếu khách hàng quyết định
                                            hủy đơn phòng trước ngày Checkin
                                            trong khoảng thời gian{' '}
                                            <span className="font-bold">
                                                {values.penaltyDate} ngày
                                            </span>{' '}
                                            được chỉ định, họ sẽ không phải chịu
                                            bất kỳ khoản phạt nào và có thể nhận
                                            lại toàn bộ số tiền đặt cọc.
                                        </p>
                                        <p className="text-base italic">
                                            * Trước ngày Checkin bị phạt{' '}
                                            <span className="font-bold">
                                                {values.penaltyRate} %
                                            </span>{' '}
                                            là hệ số phạt được áp dụng nếu khách
                                            hàng hủy đơn phòng gần đến ngày
                                            Checkin. Nếu họ hủy đơn trong khoảng
                                            thời gian được chỉ định trước ngày
                                            Checkin, họ sẽ phải đền một phần
                                            hoặc toàn bộ số tiền cọc, được tính
                                            dựa trên tỉ lệ phạt{' '}
                                            <span className="font-bold">
                                                {values.penaltyRate} %
                                            </span>{' '}
                                            trên tổng số tiền cọc mà họ đã trả
                                            trước đó.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 w-full md:ml-10 md:mt-0 md:w-96">
                                    <div className="panel mb-5">
                                        <div className="mt-4">
                                            <div>
                                                <label
                                                    className="font-bold"
                                                    htmlFor="status"
                                                >
                                                    Trạng Thái
                                                </label>
                                                <input
                                                    id="status"
                                                    type="text"
                                                    name="status"
                                                    className="form-input"
                                                    value={
                                                        renderStatus(
                                                            initValueHomestay?.status,
                                                        ).name
                                                    }
                                                    placeholder="Đang Chờ Kiểm Duyệt"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                                            <button
                                                type="submit"
                                                className="btn btn-success w-full gap-2"
                                            >
                                                <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                                Lưu
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-warning w-full gap-2"
                                                onClick={() => {
                                                    setIsUpdate(false);
                                                }}
                                            >
                                                <IconBox className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                                Hủy Cập Nhật
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-info w-full gap-2"
                                                onClick={() => {
                                                    navigate(-1);
                                                }}
                                            >
                                                <IconBox className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                                Quay Lại
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
        </div>
    );
};

const DetailHomestay = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [dataHomestay, setDataHomestay] = useState<HomestayDetail>();
    const [isUpdate, setIsUpdate] = useState(false);
    const [dataHomestayFeedback, setDataHomestayFeedback] =
        useState<HomestayFeedback[]>();
    const [dataHomestayPolicies, setDataHomestayPolicies] =
        useState<homestayPolicy[]>();
    useEffect(() => {
        dispatch(setPageTitle('Chi Tiết Homestay'));
    }, []);
    useEffect(() => {
        const fetchHomestayDetail = async (id: string) => {
            try {
                const response = await homestayAPI.getDetail(id);
                const responseFeedback =
                    await homestayAPI.getListFeedbackOfHomestay(id);
                setDataHomestayFeedback(responseFeedback?.data ?? []);
                setDataHomestay(response.data);
            } catch (err) {
                console.log(
                    'Error fetch homestay detail with: ',
                    err,
                    ' | id homestay: ',
                    id,
                );
            }
        };

        const fetchHomestayPolicies = async (id: string) => {
            try {
                const response =
                    await homestayAPI.getListPoliciesOfHomestay(id);
                console.log('homestay detail: ', response);
                setDataHomestayPolicies(response?.data);
            } catch (err) {
                console.log(
                    'Error fetch homestay detail with: ',
                    err,
                    ' | id homestay: ',
                    id,
                );
            }
        };
        if (typeof id === 'string' && isUpdate === false) {
            fetchHomestayDetail(id);
            fetchHomestayPolicies(id);
        }
    }, [id, isUpdate]);

    const [active, setActive] = useState<string>('0');
    const togglePara = (value: string) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const navigate = useNavigate();
    return (
        <div className="flex flex-col gap-2.5">
            {isUpdate ? (
                <UpdateGeneralInfoHomestay
                    homestayId={id}
                    setIsUpdate={setIsUpdate}
                />
            ) : (
                <div className="panel flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                    <div className="mb-4 ml-4 text-lg font-bold">
                        1. Hình Ảnh Đại Diện Homestay:
                    </div>
                    <div className="flex flex-wrap px-4">
                        <div className="flex max-h-[500px] w-full">
                            <div className="mb-4 flex max-h-[500px] w-full items-center justify-center">
                                <div className="flex w-full items-center justify-center rounded-md bg-gray-300">
                                    <img
                                        src={dataHomestay?.images[0]?.url}
                                        alt="img"
                                        className="h-auto max-h-[500px] w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                '/assets/images/demo.jpg';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />

                    <div className="mt-8 px-4">
                        <div className="justify-between lg:flex-row">
                            <div className="mb-6 w-full">
                                <div className="mb-4 text-lg font-bold">
                                    2. Thông Tin Chi Tiết Homestay:
                                </div>
                                <div className="space-y-5 dark:text-white">
                                    <div className="flex flex-col justify-between lg:flex-row">
                                        {/* Column 1 */}
                                        <div className="mb-6 w-full lg:w-1/2">
                                            {/* Thành Phố(Tỉnh), quận( huyện), phường( xã) */}
                                            <div className="relative mt-4 flex items-center">
                                                <label
                                                    htmlFor="nameHomestay"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Tên Homestay:
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[300px]"
                                                        id="city"
                                                        name="nameHomestay"
                                                        type="text"
                                                        value={
                                                            dataHomestay?.name
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative mt-4 flex items-center">
                                                <label
                                                    htmlFor="descriptionHomestay"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Mô Tả Homestay:
                                                </label>
                                                <div>
                                                    <textarea
                                                        id="descriptionHomestay"
                                                        name="descriptionHomestay"
                                                        className="form-textarea max-h-fit min-h-[100px] w-[300px]"
                                                        value={
                                                            dataHomestay?.description
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            {/* Các trường khác của Column 1 */}
                                            {/* ... */}
                                        </div>

                                        {/* Column 2 */}
                                        <div className="mb-6 w-full lg:w-1/2">
                                            {/* khu nhà, ấp, số nhà, tên đường */}
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="acreage"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Diện Tích Homestay:
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="acreage"
                                                        name="acreage"
                                                        type="text"
                                                        value={
                                                            dataHomestay?.acreage
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                                        m²
                                                    </span>
                                                </div>
                                            </div>
                                            {/* <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="timeCheckin"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Thời Gian Nhận Phòng:
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="timeCheckin"
                                                        name="timeCheckin"
                                                        type="text"
                                                        disabled
                                                        value={dataHomestay?.checkInTime ? moment(new Date(dataHomestay?.checkInTime)).format("DD/MM/YYYY") :"Chưa có thông tin"}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="timeCheckout"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Thời Gian Trả Phòng:
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="timeCheckout"
                                                        name="timeCheckout"
                                                        type="text"
                                                        disabled
                                                        value={dataHomestay?.checkOutTime ? moment(new Date(dataHomestay?.checkOutTime)).format("DD/MM/YYYY") :"Chưa có thông tin"}
                                                    />
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                   
                                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                    <div className="text-lg font-bold">
                                        3. Thông Tin Địa Chỉ Homestay:
                                    </div>
                                    <div className="flex flex-col justify-between lg:flex-row">
                                        {/* Column 1 */}
                                        <div className="mb-6 w-full lg:w-1/2">
                                            {/* Thành Phố(Tỉnh), quận( huyện), phường( xã) */}
                                            <div className="relative mt-4 flex items-center">
                                                <label
                                                    htmlFor="city"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Thành Phố (Tỉnh)
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="city"
                                                        type="text"
                                                        name="city"
                                                        value={
                                                            dataHomestay?.city
                                                        }
                                                        autoComplete="off"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative mt-4 flex items-center">
                                                <label
                                                    htmlFor="district"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Quận (Huyện)
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="district"
                                                        type="text"
                                                        name="district"
                                                        value={
                                                            dataHomestay?.district
                                                        }
                                                        autoComplete="off"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative mt-4 flex items-center">
                                                <label
                                                    htmlFor="commune"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Phường (Xã)
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="commune"
                                                        type="text"
                                                        name="commune"
                                                        value={
                                                            dataHomestay?.commune
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            {/* Các trường khác của Column 1 */}
                                            {/* ... */}
                                        </div>

                                        {/* Column 2 */}
                                        <div className="mb-6 w-full lg:w-1/2">
                                            {/* khu nhà, ấp, số nhà, tên đường */}
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="streetName"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Tên Đường
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="streetName"
                                                        name="streetName"
                                                        type="text"
                                                        value={
                                                            dataHomestay?.street
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="house"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Khu Nhà
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="house"
                                                        type="text"
                                                        name="house"
                                                        value={
                                                            dataHomestay?.house ?? "Chưa có thông tin"
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="hamlet"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Ấp
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="hamlet"
                                                        type="text"
                                                        name="hamlet"
                                                        value={
                                                            dataHomestay?.hamlet ?? "Chưa có thông tin"
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="addressHomestay"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Số Địa Chỉ
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="addressHomestay"
                                                        type="text"
                                                        name="addressHomestay"
                                                        value={
                                                            dataHomestay?.address
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            {/* Các trường khác của Column 2 */}
                                            {/* ... */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                    <div className="ml-4 text-lg font-bold">
                                     4. Các Thông Tin Thanh Toán:
                                    </div>
                                    <div className="ml-4 mb-6 w-full lg:w-1/2">
                                        <div className="mt-4 flex items-center">
                                            <label
                                                htmlFor="depositRate"
                                                className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Phần Trăm Tiền Cọc Thanh Toán:
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="form-input w-2/3 lg:w-[250px]"
                                                    id="depositRate"
                                                    name="depositRate"
                                                    type="text"
                                                    value={dataHomestay?.depositRate ?? "Chưa có thông tin"}
                                                    disabled
                                                />
                                                
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                                        %
                                                    </span>
                                               
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <label
                                                htmlFor="penaltyDate"
                                                className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Số ngày phạt:
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="form-input w-2/3 lg:w-[250px]"
                                                    id="penaltyDate"
                                                    name="penaltyDate"
                                                    value={dataHomestay?.penaltyDate ?? "Chưa có thông tin"}
                                                    type="text"
                                                    disabled
                                                />
                                                
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                                        ngày
                                                    </span>
                                               
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <label
                                                htmlFor="penaltyRate"
                                                className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Phần Trăm Tiền Phạt:
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="form-input w-2/3 lg:w-[250px]"
                                                    id="penaltyRate"
                                                    name="penaltyRate"
                                                    value={dataHomestay?.penaltyRate ?? "Chưa có thông tin"}
                                                    type="text"
                                                    disabled
                                                />
                                                
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                                        %
                                                    </span>
                                               
                                            </div>
                                        </div>
                                    </div>
                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />

                    {dataHomestayPolicies &&
                        dataHomestayPolicies?.length > 0 && (
                            <div className=" ml-5 mr-5">
                                <div className="mb-5 text-lg font-bold">
                                    5. Chính Sách & Thông Tin:
                                </div>
                                <div className=" space-y-2 font-semibold">
                                    {/* render policies here */}
                                    {dataHomestayPolicies?.map(
                                        (policy, index) => (
                                            <div className="rounded border border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`w-full items-center p-4 text-left text-white-dark dark:bg-[#1b2e4b] `}
                                                    onClick={() =>
                                                        togglePara(
                                                            index?.toString(),
                                                        )
                                                    }
                                                >
                                                    {policy?.policyTitle?.name}
                                                </button>
                                                <div>
                                                    <AnimateHeight
                                                        duration={300}
                                                        height={
                                                            active ===
                                                            index?.toString()
                                                                ? 'auto'
                                                                : 0
                                                        }
                                                    >
                                                        <div className="space-y-2 border-t border-[#d3d3d3] p-4 text-[13px] text-white-dark dark:border-[#1b2e4b]">
                                                            <p>
                                                                {
                                                                    policy
                                                                        ?.policy
                                                                        ?.description
                                                                }
                                                            </p>
                                                            <p>
                                                                {
                                                                    policy
                                                                        ?.policy
                                                                        ?.subDescription
                                                                }
                                                            </p>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                    {dataHomestay?.homeStayGeneralAmenitieTitles &&
                        dataHomestay?.homeStayGeneralAmenitieTitles?.length >
                            0 && (
                            <>
                                {' '}
                                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                <div className=" ml-5 mr-5">
                                    <div className="mb-5 text-lg font-bold">
                                        6. Tiện Ích Chung Homestay:
                                    </div>
                                    <div className="scroll-ml-6 overflow-x-auto overflow-y-auto">
                                        <table className="min-w-full divide-y divide-gray-200 overflow-auto">
                                            <thead className=" bg-gray-50">
                                                <tr>
                                                    <th className="text-black-900 px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider">
                                                        STT
                                                    </th>
                                                    <th className="text-black-900 px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider">
                                                        Tên Tiện Ích
                                                    </th>
                                                    <th className="text-black-900 px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider">
                                                        Loại Tiện Ích
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="min-w-full divide-y divide-gray-200">
                                                {dataHomestay?.homeStayGeneralAmenitieTitles?.map(
                                                    (data1, index) => (
                                                        <tr key={data1.id}>
                                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                                                                {index + 1}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                                                                {
                                                                    data1
                                                                        .generalAmenitieTitle
                                                                        .name
                                                                }
                                                            </td>
                                                            <td className="flex flec-wrap whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                                                                {data1.generalAmenitieSelecteds.map(
                                                                    (
                                                                        data2,
                                                                        index2,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                data2.id
                                                                            }
                                                                            className="mr-3 mb-3 inline-block rounded-full bg-pink-200 px-3 py-1 text-sm font-semibold text-gray-700"
                                                                        >
                                                                            {
                                                                                data2
                                                                                    .generalAmenitie
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    {/* feedback */}
                    {dataHomestayFeedback &&
                        dataHomestayFeedback?.length > 0 && (
                            <div>
                                <div className="mt-8 px-4">
                                    <div className="justify-between lg:flex-row">
                                        <div className="mb-6 w-full">
                                            <div className="text-lg font-bold">
                                                7. Feedback Khách Hàng:
                                            </div>
                                        </div>

                                        {dataHomestayFeedback?.map(
                                            (feedback) => (
                                                <div
                                                    className="mt-4 flex items-start"
                                                    key={feedback?.id}
                                                >
                                                    <div className="flex-shrink-0">
                                                        {/* Avatar */}
                                                        <img
                                                            src={
                                                                feedback
                                                                    ?.tourist
                                                                    ?.avatar
                                                            }
                                                            alt="Avatar"
                                                            className="h-[60px] w-[60px] rounded-full"
                                                        />
                                                    </div>
                                                    <div className="ml-4 max-w-[600px] flex-grow">
                                                        {/* Comment content */}
                                                        <p className="text-gray-800">
                                                            {feedback?.tourist
                                                                ?.lastName +
                                                                ' ' +
                                                                feedback
                                                                    ?.tourist
                                                                    ?.firstName}
                                                        </p>
                                                        <div className="relative rounded-lg bg-gray-200 p-4">
                                                            <p className="text-gray-800">
                                                                {
                                                                    feedback?.description
                                                                }
                                                            </p>
                                                        </div>
                                                        {/* Star rating */}
                                                        <div className=" right-4 top-1/2 mt-2 flex -translate-y-1/2 items-center space-x-2">
                                                            {/* Sử dụng component StarRating */}
                                                            <span>
                                                                Đánh Giá:
                                                            </span>
                                                            {/* <StarRating rating={feedback?.rating} /> */}
                                                            <div className="flex h-auto flex-col">
                                                                {feedback?.rating && (
                                                                    <Rating
                                                                        initialValue={
                                                                            feedback?.rating
                                                                        }
                                                                        size={
                                                                            20
                                                                        }
                                                                        fillColor="#f1a545" // Màu sắc của sao được chọn (tuỳ chọn)
                                                                        emptyColor="#cccccc"
                                                                        iconsCount={
                                                                            5
                                                                        }
                                                                        allowFraction={
                                                                            true
                                                                        }
                                                                        readonly={
                                                                            true
                                                                        }
                                                                        SVGclassName={
                                                                            'inline-block'
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            <button className="ml-auto text-gray-500 hover:underline">
                                                                {moment(
                                                                    feedback?.createdDate,
                                                                ).format(
                                                                    'DD/MM/YYYY - HH:mm A',
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            )}
            {isUpdate === false && (
                <div className="flex justify-center gap-3">
                    <button
                        className="btn btn-primary  w-[150px] gap-2 sm:col-span-2 lg:col-span-1 xl:col-span-full"
                        onClick={() => navigate('/listhomestay')}
                    >
                        <IconArrowBackward className="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Quay Lại
                    </button>
                    <button
                        className="btn btn-primary  w-[150px] gap-2 sm:col-span-2 lg:col-span-1 xl:col-span-full"
                        onClick={() => setIsUpdate((prev) => !prev)}
                    >
                        <IconPencil className="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Cập Nhật
                    </button>
                </div>
            )}
        </div>
    );
};

export default DetailHomestay;
