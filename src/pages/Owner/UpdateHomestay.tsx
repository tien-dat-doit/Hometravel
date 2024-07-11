import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import IconCamera from '../../components/Icon/IconCamera';
import IconHome from '../../components/Icon/IconHome';
import IconSave from '../../components/Icon/IconSave';
import { setPageTitle } from '../../store/themeConfigSlice';

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
import IconBox from '../../components/Icon/IconBox';
import IconTrash from '../../components/Icon/IconTrash';
import { DistrictType } from '../../types/district';
import { ProvincesType } from '../../types/provinces';
import { WardType } from '../../types/ward';
import ModalRoomAmenities from '../Components/ModalRoomAmenities';
import homestayAPI from '../../util/homestayAPI';
import useAuth from '../../hook/useAuth';
import { toast } from 'react-toastify';
import roomAPI from '../../util/roomAPI';
import moment from 'moment';
import { NumericFormat } from 'react-number-format';
import IconFile from '../../components/Icon/IconFile';
import CalendarUpdatePriceForRoom from '../Pages/CalendarUpdatePriceRoom';

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
    penaltyDate: Yup.number()
        .required('Vui lòng nhập số ngày')
        .integer('Vui lòng nhập số nguyên!')
        .typeError('Vui lòng nhập đúng ngày!')
        .min(0, 'Số ngày ít nhất là 0!')
        .max(10, 'Số ngày tối đa là 10!'),
    ward: Yup.string().required('Vui lòng nhập tên phường/xã'),  
    streetName: Yup.string().required('Vui lòng nhập tên đường'),
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
const UpdateFullHomestay = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { homestayId } = useParams();
    const [isSubmit, setIsSubmit] = useState(false);
    const formikRef = useRef<FormikProps<FormikValues>>(null);
    useEffect(() => {
        dispatch(setPageTitle('Update Homestay'));
    });

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked((prevChecked) => !prevChecked);
    };

    const [listHomestayAmenitiesAPI, setListHomestayAmenitiesAPI] =
        useState<any>([]);
    const [listHomestayAmenitiesInitValue, setListHomestayAmenitiesInitValue] =
        useState<any>([]);
    const [listRoomAmenitiesAPI, setListRoomAmenitiesAPI] = useState<any>([]);
    const [listRoomAmenitiesInitValue, setListRoomAmenitiesInitValue] =
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
    const [selectedlicenseFile, setSelectedlicenseFile] = useState<File | null>(
        null,
    );
    const [selectedcontractTouristFile, setSelectedcontractTouristFile] =
        useState<File | null>(null);
        const handleInputChange = (event: any) => {
            const term = event.target.value;
            if (!term) {
                setDataProvince({
                    ...dataProvince,
                    province_name: term,
                    province_id: -1,
                });
                setSearchResultsProvinces(searchResultsAPIProvinces);
                setShowOption(false)
                setDataWard({ward_id:-1, ward_name:""})
                setDataDistrict({district_id:-1, district_name:""})
                setShowOptionDistrict(false)
                setShowOptionWard(false)
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
            setDataDistrict({district_id:-1, district_name:""})
            setDataWard({ward_id:-1, ward_name:""})
            formikRef?.current?.setFieldValue('province', result.province_name);
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
    const [initValueRooms, setInitValueRooms] = useState<any>([]);
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
            formikRef?.current?.setFieldValue('ward', result.ward_name);         
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
                setDataWard({ward_id:-1, ward_name:""})
                
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
            formikRef?.current?.setFieldValue('district', result.district_name);
            setShowOptionDistrict(false);
            setDataWard({ward_id:-1, ward_name:""})
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
                const responseRoomAmenities = await roomAPI.getListAmenities();
                // set data province
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
                    contractTouristFile:
                        responseHomestay?.data?.contractTouristFile,
                    licenseFile: responseHomestay?.data?.licenseFile,
                    streetName: responseHomestay?.data?.street ?? '',
                    house: responseHomestay?.data?.house ?? '',
                    hamlet: responseHomestay?.data?.hamlet ?? '',
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
                // set data amenities for room

                setListRoomAmenitiesAPI(responseRoomAmenities?.data ?? []);

                const initValueRoomsLoad = responseHomestay?.data?.rooms?.map(
                    (room: any) => {
                        let listOtherAmenitiesRoom: any[] = [];
                        let initAmenitiesRoom =
                            responseRoomAmenities?.data?.map((a: any) => {
                                let arrayAmenitiesSelectedBefore;
                                for (
                                    let i = 0;
                                    i < room?.roomAmenitieTitles?.length;
                                    i++
                                ) {
                                    if (
                                        room?.roomAmenitieTitles[i]
                                            ?.amenitieTitleId === a?.id
                                    ) {
                                        arrayAmenitiesSelectedBefore =
                                            room?.roomAmenitieTitles[
                                                i
                                            ]?.roomAmenitieSelecteds?.map(
                                                (amenitySelected: any) =>
                                                    amenitySelected?.amenitie
                                                        ?.id,
                                            );
                                    }
                                    if (
                                        room?.roomAmenitieTitles[i]
                                            ?.amenitieTitle?.name === 'Khác'
                                    ) {
                                        listOtherAmenitiesRoom =
                                            room?.roomAmenitieTitles[
                                                i
                                            ]?.roomAmenitieSelecteds?.map(
                                                (amenitySelected: any) =>
                                                    amenitySelected?.amenitie
                                                        ?.name,
                                            );
                                    }
                                }
                                return {
                                    amenitieTitleId: a?.id,
                                    name: a?.name,
                                    roomAmenitieSelected:
                                        arrayAmenitiesSelectedBefore ?? [],
                                };
                            });
                        return {
                            roomId: room?.id ?? '',
                            recieverPeople: room?.capacity ?? 0,
                            listExtensionOfRoom: listOtherAmenitiesRoom ?? [],
                            isOtherAmenities:
                                listOtherAmenitiesRoom?.length > 0
                                    ? true
                                    : false,
                            roomAmenitieTitles: initAmenitiesRoom,
                            recieverName: room?.name ?? '',
                            recieveBed: room?.numberOfBeds ?? 0,
                            acreageRoom: room?.acreage ?? 0,
                            priceRoomNor: room?.price ?? 0,
                            priceRoomWe: room?.weekendPrice ?? 0,                         
                            mainImage: null,
                            imgTemp: room?.images?.map((i: any) => i.url),
                        };
                    },
                );
                setInitValueRooms(initValueRoomsLoad);
                const initArrayAmenitiesRoomForNewSelect =
                    responseRoomAmenities?.data?.map((a: any) => {
                        return {
                            amenitieTitleId: a?.id,
                            name: a?.name,
                            roomAmenitieSelected: [],
                        };
                    });
                setListRoomAmenitiesInitValue(
                    initArrayAmenitiesRoomForNewSelect ?? [],
                );
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
    const handleCancel = () => {
        const toast = Swal.mixin({
            toast: true,
            position: 'bottom-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
            customClass: {
                popup: `color-danger`,
            },
        });
        toast.fire({
            title: 'Bạn đã hủy thêm thông tin',
        });
    };

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
                listHomestayPoliciesInitValue?.length > 0 &&
                initValueRooms?.length > 0 && (
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
                            licenseFile: null,
                            homeStayPolicySelecteds:
                                listHomestayPoliciesInitValue,
                            streetName: initValueHomestay?.streetName,
                            house: initValueHomestay?.house,
                            hamlet: initValueHomestay?.hamlet,
                            listRoom: initValueRooms,
                            listExtension: listOtherAmenitiesHomestay,
                            homeStayAmenitieTitles:
                                listHomestayAmenitiesInitValue,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { resetForm }) => {
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
                                    'homeStay.checkInTime',
                                    "14:00",
                                );
                                dataSubmitHomestay.append(
                                    'homeStay.checkOutTime',
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
                                    'homeStay.status',
                                    'PENDING',
                                );
                                if (values.thumnailImage) {
                                    dataSubmitHomestay.append(
                                        'images',
                                        values.thumnailImage,
                                    );
                                }
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
                                // khai báo function general cho promise all
                                function updateRoomWithSpecificDataSubmit(
                                    payload: any,
                                    roomId: string,
                                ) {
                                    return new Promise(
                                        async (resolve, reject) => {
                                            try {
                                                const data =
                                                    await roomAPI.updateRoom(
                                                        payload,
                                                        roomId,
                                                    );
                                                resolve(data);
                                            } catch (error) {
                                                reject(error);
                                            }
                                        },
                                    );
                                }

                                const newArrayRoomFormat =
                                    values?.listRoom?.map((r: any) => {
                                        let amenitiesFilter =
                                            r.roomAmenitieTitles?.filter(
                                                (a: any) =>
                                                    a?.roomAmenitieSelected
                                                        ?.length > 0,
                                            );
                                        return {
                                            roomId: r.roomId,
                                            capacity: r.recieverPeople,
                                            roomAmenitieTitles: amenitiesFilter,
                                            otherAmenities:
                                                r.listExtensionOfRoom,
                                            name: r.recieverName,
                                            numberOfBeds: r.recieveBed,
                                            acreage: r.acreageRoom,
                                            price: r.priceRoomNor,
                                            weekendPrice: r.priceRoomWe,
                                            images: r.mainImage,
                                            status: 'PENDING',                                         
                                        };
                                    });
                                const listSubmitRoom = newArrayRoomFormat?.map(
                                    (room: any) => {
                                        let dataSubmit = new FormData();
                                        dataSubmit.append(
                                            `room.homeStayId`,
                                            homestayId,
                                        );
                                        dataSubmit.append(
                                            `room.id`,
                                            room.roomId,
                                        );
                                        dataSubmit.append(
                                            `room.name`,
                                            room.name,
                                        );
                                        dataSubmit.append(
                                            `room.capacity`,
                                            room.capacity,
                                        );
                                        dataSubmit.append(
                                            `room.numberOfBeds`,
                                            room.numberOfBeds,
                                        );
                                        dataSubmit.append(
                                            `room.acreage`,
                                            room.acreage,
                                        );
                                        dataSubmit.append(
                                            `room.price`,
                                            room.price,
                                        );
                                        dataSubmit.append(
                                            `room.weekendPrice`,
                                            room.weekendPrice,
                                        );
                                        dataSubmit.append(
                                            `room.status`,
                                            room.status,
                                        );
                                        if (room.images?.length > 0) {
                                            for (
                                                let c = 0;
                                                c < room.images?.length;
                                                c++
                                            ) {
                                                dataSubmit.append(
                                                    `images`,
                                                    room.images[c],
                                                );
                                            }
                                        }                                   
                                        for (
                                            let a = 0;
                                            a <
                                            room?.roomAmenitieTitles?.length;
                                            a++
                                        ) {
                                            if (
                                                room?.roomAmenitieTitles[a]
                                                    ?.roomAmenitieSelected
                                                    ?.length > 0
                                            ) {
                                                dataSubmit.append(
                                                    `roomAmenitieTitles[${a}].amenitieTitleId`,
                                                    room.roomAmenitieTitles[a]
                                                        .amenitieTitleId,
                                                );
                                                for (
                                                    let b = 0;
                                                    b <
                                                    room.roomAmenitieTitles[a]
                                                        ?.roomAmenitieSelected
                                                        ?.length;
                                                    b++
                                                ) {
                                                    dataSubmit.append(
                                                        `roomAmenitieTitles[${a}].roomAmenitieSelected[${b}]`,
                                                        room.roomAmenitieTitles[
                                                            a
                                                        ].roomAmenitieSelected[
                                                            b
                                                        ],
                                                    );
                                                }
                                            }
                                        }
                                        // Gắn tiện ích khác cho room
                                        for (
                                            let a = 0;
                                            a <
                                            room?.roomAmenitieTitles?.length;
                                            a++
                                        ) {
                                            if (
                                                room?.otherAmenities[a]
                                                    ?.length > 0
                                            ) {
                                                dataSubmit.append(
                                                    `otherAmenities[${a}]`,
                                                    room.otherAmenities[a],
                                                );
                                            }
                                        }
                                        return {
                                            dataSubmit: dataSubmit,
                                            roomId: room?.roomId,
                                        };
                                    },
                                );
                                try {
                                    const response: any =
                                        await homestayAPI.updateHomestayGeneralInformation(
                                            dataSubmitHomestay,
                                            homestayId,
                                        );
                                    const requests = listSubmitRoom?.map(
                                        (room: any) =>
                                            updateRoomWithSpecificDataSubmit(
                                                room?.dataSubmit,
                                                room?.roomId,
                                            ),
                                    );
                                    const responsesRoom =
                                        await Promise.all(requests);
                                    console.log({ responsesRoom });
                                    toast.success(
                                        response.msg ?? 'Cập nhật thành công',
                                    );
                                    navigate('/viewaddhomestay');
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
                                                    />
                                                    <div className="text-red-400">
                                                        <ErrorMessage
                                                            component="a"
                                                            name="nameHomestay"
                                                            // className="form-input w-2/3 lg:w-[250px]"
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
                                                        className="form-input min-h-[120px] w-2/3 lg:w-[250px]"
                                                        as="textarea"
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
                                                        onClick={() => {
                                                            setShowOption((prev)=>                                                            
                                                                !prev
                                                            );
                                                            setSearchResultsProvinces(
                                                                searchResultsAPIProvinces,
                                                            );
                                                            setShowOptionDistrict(false)
                                                            setShowOptionWard(false)
                                                        }}
                                                        onChange={
                                                            handleInputChange
                                                        }                                                     
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
                                                        value={
                                                            dataDistrict.district_name
                                                        }
                                                        onClick={() => {
                                                            setShowOptionDistrict(
                                                                (prev)=>                                                            
                                                                    !prev
                                                            );
                                                            setSearchResultsDistrict(
                                                                searchResultsAPIDistrict,
                                                            );
                                                            setShowOptionWard(false)
                                                        }}
                                                        
                                                        onChange={
                                                            handleInputChangeDistrict
                                                        }
                                                        autoComplete="off"
                                                        disabled={
                                                            dataProvince.province_id ===
                                                            -1
                                                                ? true
                                                                : false
                                                        }
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
                                                        onClick={() => {
                                                            setShowOptionWard(
                                                                (prev)=>                                                            
                                                                    !prev
                                                            );
                                                            setSearchResultsWard(
                                                                searchResultsAPIWard,
                                                            );
                                                            setShowOption(false)
                                                            setShowOptionDistrict(false)
                                                        }}
                                                        autoComplete="off"
                                                        disabled={
                                                            dataDistrict.district_id ===
                                                            -1
                                                                ? true
                                                                : false
                                                        }
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
                                    {/* //TODO: */}
                                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                    <FieldArray name="listRoom">
                                        {({ push, remove }) => (
                                            <div>
                                                {values.listRoom.map(
                                                    (room: any, index: any) => (
                                                        <div
                                                            className="mt-8 px-4"
                                                            key={index}
                                                        >
                                                            <div className="flex flex-col justify-between lg:flex-row">
                                                                <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                                                                    <div className="text-lg font-bold">
                                                                        Thông
                                                                        Tin
                                                                        Phòng{' '}
                                                                        {index +
                                                                            1}
                                                                        :
                                                                    </div>
                                                                    <div className="mt-4 flex items-center">
                                                                        <label
                                                                            htmlFor="recieverName"
                                                                            className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                        >
                                                                            Tên
                                                                            Phòng
                                                                        </label>
                                                                        <div>
                                                                            <Field
                                                                                className="form-input w-2/3 lg:w-[250px]"
                                                                                id="recieverName"
                                                                                type="text"
                                                                                name={`listRoom.${index}.recieverName`}
                                                                                placeholder="#Nhập tên Phòng"
                                                                            />
                                                                            <div className="text-red-400">
                                                                                {' '}
                                                                                <ErrorMessage
                                                                                    component="a"
                                                                                    name={`listRoom.${index}.recieverName`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-4 flex items-center">
                                                                        <label
                                                                            htmlFor="recieverPeople"
                                                                            className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                        >
                                                                            Số
                                                                            Lượng
                                                                            Người
                                                                        </label>
                                                                        <div>
                                                                            <Field
                                                                                className="form-input w-2/3 lg:w-[250px]"
                                                                                id="recieverPeople"
                                                                                type="number"
                                                                                name={`listRoom.${index}.recieverPeople`}
                                                                                placeholder="#Vui lòng nhập số người"
                                                                            />
                                                                            <div className="text-red-400">
                                                                                {' '}
                                                                                <ErrorMessage
                                                                                    component="a"
                                                                                    name={`listRoom.${index}.recieverPeople`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-4 flex items-center">
                                                                        <label
                                                                            htmlFor="recieveBed"
                                                                            className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                        >
                                                                            Số
                                                                            Lượng
                                                                            Giường
                                                                        </label>
                                                                        <div>
                                                                            <Field
                                                                                className="form-input w-2/3 lg:w-[250px]"
                                                                                id="recieveBed"
                                                                                type="number"
                                                                                name={`listRoom.${index}.recieveBed`}
                                                                                placeholder="#Vui lòng nhập số giường"
                                                                            />
                                                                            <div className="text-red-400">
                                                                                {' '}
                                                                                <ErrorMessage
                                                                                    component="a"
                                                                                    name={`listRoom.${index}.recieveBed`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="w-full lg:w-1/2">
                                                                    <div className="text-lg"></div>
                                                                    <div className="mt-4 flex items-center">
                                                                        <label
                                                                            htmlFor="acreageRoom"
                                                                            className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                        >
                                                                            Diện
                                                                            Tích
                                                                            Phòng
                                                                        </label>
                                                                        <div>
                                                                            <Field
                                                                                className="form-input w-2/3 lg:w-[250px]"
                                                                                id="acreageRoom"
                                                                                type="number"
                                                                                name={`listRoom.${index}.acreageRoom`}
                                                                                placeholder="#Nhập chiều dài phòng"
                                                                            />
                                                                            <div className="text-red-400">
                                                                                {' '}
                                                                                <ErrorMessage
                                                                                    component="a"
                                                                                    name={`listRoom.${index}.acreageRoom`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative">
                                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                                                                m²
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-4 flex items-center">
                                                                        <label
                                                                            htmlFor="priceRoomNor"
                                                                            className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                        >
                                                                            Giá
                                                                            Phòng
                                                                            Thường
                                                                            Ngày
                                                                        </label>
                                                                        <div className="relative w-2/3 lg:w-[250px]">
                                                                            <Field
                                                                                name={`listRoom.${index}.priceRoomNor`}
                                                                            >
                                                                                {({
                                                                                    field,
                                                                                    form,
                                                                                }: any) => (
                                                                                    <NumericFormat
                                                                                        // {...field}
                                                                                        value={
                                                                                            values
                                                                                                ?.listRoom[
                                                                                                index
                                                                                            ]
                                                                                                ?.priceRoomNor
                                                                                        }
                                                                                        className="form-input w-full"
                                                                                        id="priceRoomNor"
                                                                                        placeholder="#Nhập giá phòng"
                                                                                        thousandSeparator={
                                                                                            true
                                                                                        }
                                                                                        suffix={
                                                                                            ' VNĐ'
                                                                                        }
                                                                                        onValueChange={(
                                                                                            values,
                                                                                        ) => {
                                                                                            const {
                                                                                                formattedValue,
                                                                                                value,
                                                                                                floatValue,
                                                                                            } =
                                                                                                values;
                                                                                            form.setFieldValue(
                                                                                                field.name,
                                                                                                floatValue,
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Field>
                                                                            <div className="text-red-400">
                                                                                <ErrorMessage
                                                                                    component="a"
                                                                                    name={`listRoom.${index}.priceRoomNor`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-4 flex items-center">
                                                                        <label
                                                                            htmlFor="priceRoomWe"
                                                                            className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                        >
                                                                            Giá
                                                                            Cuối
                                                                            Tuần
                                                                        </label>
                                                                        <div className="relative w-2/3 lg:w-[250px]">
                                                                            <Field
                                                                                name={`listRoom.${index}.priceRoomWe`}
                                                                            >
                                                                                {({
                                                                                    field,
                                                                                    form,
                                                                                }: any) => (
                                                                                    <NumericFormat
                                                                                        // {...field}
                                                                                        value={
                                                                                            values
                                                                                                ?.listRoom[
                                                                                                index
                                                                                            ]
                                                                                                ?.priceRoomWe
                                                                                        }
                                                                                        className="form-input w-full"
                                                                                        id="priceRoomWe"
                                                                                        placeholder="#Nhập giá phòng"
                                                                                        thousandSeparator={
                                                                                            true
                                                                                        }
                                                                                        suffix={
                                                                                            ' VNĐ'
                                                                                        }
                                                                                        onValueChange={(
                                                                                            values,
                                                                                        ) => {
                                                                                            const {
                                                                                                formattedValue,
                                                                                                value,
                                                                                                floatValue,
                                                                                            } =
                                                                                                values;

                                                                                            form.setFieldValue(
                                                                                                field.name,
                                                                                                floatValue,
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Field>
                                                                            <div className="text-red-400">
                                                                                <ErrorMessage
                                                                                    component="a"
                                                                                    name={`listRoom.${index}.priceRoomWe`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                            <div>
                                                                    {/* render lịch */}
                                                        <div>
                                                        <CalendarUpdatePriceForRoom roomId={values?.listRoom[index]?.roomId} setLoading={setIsSubmit}/>
                                                        </div>   

                                                                    </div>
                                                            <ModalRoomAmenities
                                                                values={values}
                                                                index={index}
                                                                initValueAmenities={
                                                                    listRoomAmenitiesAPI
                                                                }
                                                            />
                                                            <div className="mb-6 mt-5 sm:mb-0">
                                                                <Field
                                                                    name={`listRoom.${index}.mainImage`}
                                                                >
                                                                    {({
                                                                        field,
                                                                        form,
                                                                        meta,
                                                                    }: any) => (
                                                                        <>
                                                                            <div className="grid grid-cols-5 gap-2">
                                                                                {values.listRoom[
                                                                                    index
                                                                                ]?.imgTemp?.map(
                                                                                    (
                                                                                        src: any,
                                                                                        index: any,
                                                                                    ) => (
                                                                                        <img
                                                                                            className="h-[200px] w-[200px]"
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            src={
                                                                                                src
                                                                                            }
                                                                                            alt={`Image ${index + 1}`}
                                                                                        />
                                                                                    ),
                                                                                )}
                                                                            </div>
                                                                            <label
                                                                                className="btn btn-primary mb-2 me-2 mt-2 w-[250px] rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-1 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:shadow-lg dark:shadow-blue-800/80 dark:focus:ring-blue-800"
                                                                                htmlFor={`mainImage${index}`}
                                                                            >
                                                                                <IconCamera className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                                                Thêm
                                                                                Hình
                                                                                Ảnh
                                                                                Phòng{' '}
                                                                                {index +
                                                                                    1}
                                                                                <input
                                                                                    hidden
                                                                                    multiple
                                                                                    type="file"
                                                                                    id={`mainImage${index}`}
                                                                                    accept="image/png, image/jpeg"
                                                                                    onChange={(
                                                                                        event: any,
                                                                                    ) => {
                                                                                        const files =
                                                                                            event
                                                                                                .currentTarget
                                                                                                .files;
                                                                                        const updatedImgSrcArray: string[] =
                                                                                            [];
                                                                                        const readNextFile =
                                                                                            (
                                                                                                index1: any,
                                                                                            ) => {
                                                                                                if (
                                                                                                    index1 <
                                                                                                    files.length
                                                                                                ) {
                                                                                                    const reader =
                                                                                                        new FileReader();
                                                                                                    reader.onload =
                                                                                                        () => {
                                                                                                            updatedImgSrcArray.push(
                                                                                                                reader.result as string,
                                                                                                            );
                                                                                                            if (
                                                                                                                updatedImgSrcArray.length ===
                                                                                                                files.length
                                                                                                            ) {
                                                                                                                formikRef.current?.setFieldValue(
                                                                                                                    `listRoom.${index}.imgTemp`,
                                                                                                                    updatedImgSrcArray,
                                                                                                                );
                                                                                                            } else {
                                                                                                                readNextFile(
                                                                                                                    index1 +
                                                                                                                        1,
                                                                                                                );
                                                                                                            }
                                                                                                        };
                                                                                                    reader.readAsDataURL(
                                                                                                        files[
                                                                                                            index1
                                                                                                        ],
                                                                                                    );
                                                                                                }
                                                                                            };
                                                                                        readNextFile(
                                                                                            0,
                                                                                        );
                                                                                        form.setFieldValue(
                                                                                            field.name,
                                                                                            event
                                                                                                .currentTarget
                                                                                                .files,
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
                                                                                        {
                                                                                            meta.error
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                        </>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            {index > 0 ? (
                                                                <span
                                                                    className="btn btn-danger mb-2 me-2 w-[200px] rounded-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-1 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-red-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-pink-300 dark:shadow-lg dark:shadow-red-800/80 dark:focus:ring-red-800"
                                                                    onClick={() => {
                                                                        remove(
                                                                            index,
                                                                        );
                                                                    }}
                                                                >
                                                                    <IconTrash className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />{' '}
                                                                    Xóa Phòng{' '}
                                                                    {index + 1}
                                                                </span>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                                {/* <div className="mb-6 mt-5 flex items-center justify-center sm:mb-0">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary mb-2 me-2 rounded-lg border-t-cyan-50 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-purple-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-purple-300 dark:shadow-lg dark:shadow-purple-800/80 dark:focus:ring-purple-800"
                                                        onClick={() =>
                                                            push({
                                                                recieverPeople:
                                                                    '',
                                                                listExtensionOfRoom:
                                                                    [],
                                                                isOtherAmenities:
                                                                    false,
                                                                roomAmenitieTitles:
                                                                    listRoomAmenitiesInitValue,
                                                                recieverName:
                                                                    '',
                                                                recieveBed: '',
                                                                leghtRoom: '',
                                                                priceRoomNor:
                                                                    '',
                                                                priceRoomWe: '',
                                                                priceRoomPromotion:
                                                                    '',
                                                                startPricePromotion:
                                                                    '',
                                                                endPricePromotion:
                                                                    '',
                                                                mainImage: null,
                                                                imgTemp: [],
                                                            })
                                                        }
                                                    >
                                                        <IconHome className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                        Thêm Phòng
                                                    </button>
                                                </div> */}
                                            </div>
                                        )}
                                    </FieldArray>
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
                                        {/* Cột 1 */}

                                        {/* Cột 2 */}

                                        {/* Cột 3 */}
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
                                        Thông Tin Giấy Phép Kinh Doanh Homestay
                                    </div>
                                    <div className="mb-6 w-[200px]">
                                        <div className="mb-1 flex items-center justify-between">
                                            {initValueHomestay?.licenseFile && (
                                                <a
                                                    target="_blank"
                                                    href={
                                                        initValueHomestay?.licenseFile
                                                    }
                                                >
                                                    Xem thông tin Giấy Phép Kinh
                                                    Doanh Hiện Tại
                                                </a>
                                            )}
                                        </div>
                                        <Field name="licenseFile">
                                            {({ field, form, meta }: any) => (
                                                <>
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            id="licenseFile"
                                                            className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                                                            onChange={(
                                                                event: any,
                                                            ) => {
                                                                const fileSubmit =
                                                                    event.target
                                                                        .files[0]; // Chỉ lấy tệp đầu tiên
                                                                if (
                                                                    fileSubmit
                                                                ) {
                                                                    const fileExtension =
                                                                        fileSubmit.name
                                                                            .split(
                                                                                '.',
                                                                            )
                                                                            .pop();
                                                                    console.log(
                                                                        'File extension:',
                                                                        fileExtension,
                                                                    );
                                                                    if (
                                                                        fileExtension ===
                                                                        'pdf'
                                                                    ) {
                                                                        setSelectedlicenseFile(
                                                                            event
                                                                                .currentTarget
                                                                                .files[0],
                                                                        );
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            event
                                                                                .currentTarget
                                                                                .files[0],
                                                                        );
                                                                    }
                                                                } else {
                                                                    toast.error(
                                                                        'Định dạng tập tin không phải là File PDF!',
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor="licenseFile"
                                                            className="btn btn-primary rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-3 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:shadow-lg dark:shadow-blue-800/80 dark:focus:ring-blue-800"
                                                        >
                                                            <IconFile className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                            {selectedlicenseFile?.name
                                                                ? selectedlicenseFile?.name
                                                                : 'Chọn File'}
                                                        </label>
                                                    </div>
                                                    {meta.touched &&
                                                        !!meta.error && (
                                                            <div className="text-red-500">
                                                                {meta.error}
                                                            </div>
                                                        )}
                                                </>
                                            )}
                                        </Field>
                                    </div>
                                    <span className="italic">
                                        * Chỉ chấp nhận file .pdf
                                    </span>
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
                                                        }
                                                        }}
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
                                                    defaultValue={
                                                        'Đang Chờ Kiểm Duyệt'
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
                                                className="btn btn-info w-full gap-2"
                                                onClick={handleCancel}
                                            >
                                                <IconBox className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                                Hủy
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

export default UpdateFullHomestay;
