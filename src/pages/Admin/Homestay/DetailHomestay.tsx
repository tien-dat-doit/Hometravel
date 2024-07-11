import { useEffect, useState,useContext } from 'react';
import { UpdateContext } from '../../../context/UpdateContext';

import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import IconEye from '../../../components/Icon/IconEye';
import { setPageTitle } from '../../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import 'tippy.js/dist/tippy.css';
import roomAPI from '../../../util/roomAPI';
import homestayAPI from '../../../util/homestayAPI';
import IconArrowBackward from '../../../components/Icon/IconArrowBackward';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import moment from 'moment';
import IconSave from '../../../components/Icon/IconSave';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Rating } from 'react-simple-star-rating';
import Carousel from 'react-material-ui-carousel';
import IconCalendar from '../../../components/Icon/IconCalendar';
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
    rejectReason: string | null;
    totalCapacity: string;
    licenseFile: string;
    // contractTouristFile: string;
    depositRate: number;
    penaltyDate: number;
    penaltyRate: number;
    startDateInActiveTemporary: string;
    endDateInActiveTemporary: string;
    rating: number;
    createdDate: string;
    images: imageHomestayObject[];
    homeStayGeneralAmenitieTitles: amenitiesTitle[];
    rooms: Room[];
}
interface Room {
    id: string;
    name: string;
    numberOfBeds: number;
    acreage: number;
    capacity: number;
    price: number;
    status: string;
    weekendPrice: number;
    rejectReason: string | null;
    startDateInActiveTemporary: string | null;
    endDateInActiveTemporary: string | null;
    createdDate: string | null;
    homeStayId: string;
    roomAmenitieTitles: RoomAmenitieTitle[];
    images: imageRoom[];
}
interface imageRoom {
    id: string;
    url: string;
    roomId: string;
    homeStayId: null | string;
}
interface RoomAmenitieTitle {
    id: string;
    roomId: string;
    amenitieTitleId: string;
    amenitieTitle: {
        id: string;
        name: string;
    };
    roomAmenitieSelecteds: RoomAmenitieSelected[];
}

interface RoomAmenitieSelected {
    id: string;
    amenitieId: string;
    roomAmenitieTitleId: string;
    amenitie: {
        id: string;
        name: string;
        status: string;
        amenitieTitleId: string;
    };
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

const DetailHomestay = () => {
    // const dispatch = useDispatch();
    const { id } = useParams();
    const { setIsUpdate } = useContext(UpdateContext);
    const [dataHomestay, setDataHomestay] = useState<HomestayDetail>();
    const [dataHomestayPolicies, setDataHomestayPolicies] =
        useState<homestayPolicy[]>();
    const [dataHomestayFeedback, setDataHomestayFeedback] =
        useState<HomestayFeedback[]>();
    const [loading, setLoading] = useState(true);
    const options = [
        { value: 'PENDING', label: ' Chờ kiểm duyệt' },
        { value: 'ACTIVE', label: 'Hoạt động' },
        { value: 'INACTIVE', label: 'Ngưng Hoạt động' },
        { value: 'INACTIVE TEMPORARY', label: 'Tạm ngưng hoạt động' },
        // { value: 'SELF-CANCELLED', label: 'Ngưng kiểm duyệt' },
        { value: 'CANCELLED', label: 'Từ chối' },
        { value: 'DISABLE', label: 'Vô hiệu hóa' },
    ];
    const [datarejectReason, setdatarejectReason] =
        useState<HomestayDetail['rejectReason']>();
    const [selectedOption, setSelectedOption] = useState(options[0]);
    useEffect(() => {
        const fetchHomestayDetail = async (id: string) => {
            try {
                const response = await homestayAPI.getDetail(id);
                const responseFeedback =
                    await homestayAPI.getListFeedbackOfHomestay(id);
                console.log('homestay detail: ', response);
                setDataHomestay(response.data);
                setDataHomestayFeedback(responseFeedback?.data ?? []);
                setSelectedOption(
                    options.find(
                        (option) => option.value === response.data.status,
                    ) || options[0],
                );
                setdatarejectReason(response.data.rejectReason);
                setLoading(false);
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
                console.log('homestay Policies: ', response);
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

        if (typeof id === 'string') {
            fetchHomestayDetail(id);
            fetchHomestayPolicies(id);
        }
    }, [id]);
    const handleSubmit = async (id: string) => {
        const updateData = {
            id: dataHomestay?.id,
            name: dataHomestay?.name,
            acreage: dataHomestay?.acreage,
            city: dataHomestay?.city,
            district: dataHomestay?.district,
            commune: dataHomestay?.commune,
            street: dataHomestay?.street,
            house: dataHomestay?.house,
            hamlet: dataHomestay?.hamlet,
            address: dataHomestay?.address,
            checkInTime: dataHomestay?.checkInTime,
            checkOutTime: dataHomestay?.checkOutTime,
            description: dataHomestay?.description,
            ownerId: dataHomestay?.ownerId,
            rejectReason: datarejectReason, //dataHomestay?.rejectReason,
            status: selectedOption.value,
            totalCapacity: dataHomestay?.totalCapacity,
            licenseFile: dataHomestay?.licenseFile,
            // contractTouristFile: dataHomestay?.contractTouristFile,
            startDateInActiveTemporary:
                dataHomestay?.startDateInActiveTemporary,
            endDateInActiveTemporary: dataHomestay?.endDateInActiveTemporary,
            rating: dataHomestay?.rating,
            createdDate: dataHomestay?.createdDate,
            depositRate: dataHomestay?.depositRate,
            penaltyDate: dataHomestay?.penaltyDate,
            penaltyRate: dataHomestay?.penaltyRate,
        };
        try {
            const response = await homestayAPI.editHomestayAdmin(
                id,
                updateData,
            );

            toast.success(
                response.data.msg ?? 'Cập nhật thông tin Homestay thành công',
            );
            setIsUpdate(true);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.msg ??
                    'Cập nhật thông tin Homestay thất bại',
            );
            console.error(error);
        }
    };
    const [active, setActive] = useState<string>('1');
    const togglePara = (value: string) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const navigate = useNavigate();
    const handleChange = (selectedOption: any) => {
        // Check if the selected option is "INACTIVE TEMPORARY"
        if (selectedOption.value !== 'INACTIVE TEMPORARY') {
            setSelectedOption(selectedOption);
        }
    };
    return (
        <div>
            {loading ? (
                <div className="text-center">
                    <span className="m-auto mb-10 inline-block h-14 w-14 animate-spin rounded-full border-8 border-[#f1f2f3] border-l-primary align-middle"></span>
                </div>
            ) : (
                <div className="flex flex-col gap-2.5 xl:flex-row">
                    <div className="panel flex-1 px-0 py-6   lg:w-2/3 ltr:xl:mr-6 rtl:xl:ml-6">
                        <div className="mb-4 ml-4 text-lg font-bold">
                            1. Hình Ảnh Đại Diện Homestay:
                        </div>
                        <div className="flex flex-wrap px-4">
                            <div className="flex max-h-[500px] w-full">
                                <div className="mb-4 flex max-h-[500px] w-full items-center justify-center">
                                    <div className="flex w-full items-center justify-center rounded-md bg-gray-300">
                                        <img
                                            src={
                                                dataHomestay?.images[0]?.url ||
                                                '/assets/images/homestaydemo.jpg'
                                            }
                                            alt="img"
                                            className="h-auto max-h-[500px] w-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    '/assets/images/homestaydemo.jpg';
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
                                    {dataHomestay && (
                                        <Formik
                                            initialValues={{
                                                nameHomestay:
                                                    dataHomestay?.name,
                                                addressHomestay:
                                                    dataHomestay?.address,
                                                infoHomestay:
                                                    dataHomestay?.description,
                                                acreage: dataHomestay?.acreage,
                                                timeCheckin: moment(
                                                    dataHomestay?.checkInTime,
                                                ).format('hh:mm A'),
                                                timeCheckout: moment(
                                                    dataHomestay?.checkOutTime,
                                                ).format('hh:mm A'),
                                                street: dataHomestay?.street,
                                                house: dataHomestay?.house,
                                                hamlet: dataHomestay?.hamlet,
                                            }}
                                            onSubmit={async (values) => {
                                                console.log(values);
                                            }}
                                        >
                                            {({ values }) => (
                                                <Form className="space-y-5 dark:text-white">
                                                    <div className="flex flex-col justify-between lg:flex-row">
                                                        {/* Column 1 */}
                                                        <div className="mb-6 w-full lg:w-2/3">
                                                            {/* Thành Phố(Tỉnh), quận( huyện), phường( xã) */}
                                                            <div className="relative mt-4 flex items-center">
                                                                <label
                                                                    htmlFor="nameHomestay"
                                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Tên
                                                                    Homestay:
                                                                </label>
                                                                <div className="w-2/3 lg:w-full">
                                                                    <Field
                                                                        className="form-input lg:w-full"
                                                                        id="city"
                                                                        name="nameHomestay"
                                                                        type="text"
                                                                        defaultValue={
                                                                            dataHomestay?.name
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`nameHomestay`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="relative mt-4 flex items-center">
                                                                <label
                                                                    htmlFor="descriptionHomestay"
                                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Mô Tả
                                                                    Homestay:
                                                                </label>
                                                                <div className="w-2/3 lg:w-full">
                                                                    <Field
                                                                        as="textarea"
                                                                        id="descriptionHomestay"
                                                                        name="descriptionHomestay"
                                                                        className="form-textarea max-h-fit min-h-[100px] lg:w-full"
                                                                        defaultValue={
                                                                            dataHomestay?.description
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`descriptionHomestay`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* Các trường khác của Column 1 */}
                                                            {/* ... */}
                                                        </div>

                                                        {/* Column 2 */}
                                                        <div className="mb-6 w-full pl-2 lg:w-1/3">
                                                            {/* khu nhà, ấp, số nhà, tên đường */}
                                                            <div className="mt-4 flex items-center">
                                                                <label
                                                                    htmlFor="acreage"
                                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Diện Tích
                                                                    Homestay:
                                                                </label>
                                                                <div>
                                                                    <Field
                                                                        className="form-input w-2/3  lg:w-full"
                                                                        id="acreage"
                                                                        name="acreage"
                                                                        type="text"
                                                                        defaultValue={
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
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`acreage`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 flex items-center">
                                                                <label
                                                                    htmlFor="timeCheckin"
                                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Thời Gian
                                                                    Nhận Phòng:
                                                                </label>
                                                                <div>
                                                                    <Field
                                                                        className="form-input w-2/3 lg:w-full"
                                                                        id="timeCheckin"
                                                                        name="timeCheckin"
                                                                        type="text"
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`timeCheckin`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 flex items-center">
                                                                <label
                                                                    htmlFor="timeCheckout"
                                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Thời Gian
                                                                    Trả Phòng:
                                                                </label>
                                                                <div>
                                                                    <Field
                                                                        className="form-input w-2/3 lg:w-full"
                                                                        id="timeCheckout"
                                                                        name="timeCheckout"
                                                                        type="text"
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`timeCheckout`}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Các trường khác của Column 2 */}
                                                            {/* ... */}
                                                        </div>
                                                    </div>
                                                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                                    <div className="text-lg font-bold">
                                                        3. Thông Tin Địa Chỉ
                                                        Homestay:
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
                                                                    Thành Phố
                                                                    (Tỉnh)
                                                                </label>
                                                                <div>
                                                                    <Field
                                                                        className="form-input w-2/3 lg:w-[250px]"
                                                                        id="city"
                                                                        type="text"
                                                                        name="city"
                                                                        defaultValue={
                                                                            dataHomestay?.city
                                                                        }
                                                                        autoComplete="off"
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`city`}
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
                                                                    <Field
                                                                        className="form-input w-2/3 lg:w-[250px]"
                                                                        id="district"
                                                                        type="text"
                                                                        name="district"
                                                                        defaultValue={
                                                                            dataHomestay?.district
                                                                        }
                                                                        autoComplete="off"
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`district`}
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
                                                                    <Field
                                                                        className="form-input w-2/3 lg:w-[250px]"
                                                                        id="commune"
                                                                        type="text"
                                                                        name="commune"
                                                                        defaultValue={
                                                                            dataHomestay?.commune
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`commune`}
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
                                                                    <Field
                                                                        className="form-input w-2/3 lg:w-[250px]"
                                                                        id="streetName"
                                                                        name="streetName"
                                                                        type="text"
                                                                        defaultValue={
                                                                            dataHomestay?.street
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`streetName`}
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
                                                                    <Field
                                                                        className="form-input w-2/3 lg:w-[250px]"
                                                                        id="house"
                                                                        type="text"
                                                                        name="house"
                                                                        defaultValue={
                                                                            dataHomestay?.house
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`house`}
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
                                                                    <Field
                                                                        className="form-input w-2/3 lg:w-[250px]"
                                                                        id="hamlet"
                                                                        type="text"
                                                                        name="hamlet"
                                                                        defaultValue={
                                                                            dataHomestay?.hamlet
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`hamlet`}
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
                                                                        defaultValue={
                                                                            dataHomestay?.address
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="ml-2 text-red-400">
                                                                    {' '}
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`district`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* Các trường khác của Column 2 */}
                                                            {/* ... */}
                                                        </div>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    )}
                                </div>
                            </div>
                        </div>

                        <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />

                        <div className=" ml-5 mr-5">
                            <div className="mb-5 text-lg font-bold">
                                4. Chính Sách & Thông Tin:
                            </div>
                            <div className=" space-y-2 font-semibold">
                                {/* render policies here */}
                                {dataHomestayPolicies?.map((policy, index) => (
                                    <div className="rounded border text-[15px] border-[#d3d3d3] dark:border-[#1b2e4b]">
                                        <button
                                            type="button"
                                            className={`w-full items-center p-4 text-left text-black-dark font-black dark:bg-[#1b2e4b] `}
                                            onClick={() =>
                                                togglePara(index?.toString())
                                            }
                                        >
                                            {policy?.policyTitle?.name}
                                        </button>
                                        <div>
                                            <AnimateHeight
                                                duration={300}
                                                height={
                                                    active === index?.toString()
                                                        ? 'auto'
                                                        : 0
                                                }
                                            >
                                                <div className="space-y-2 font-bold border-t border-[#d3d3d3] p-4 text-[13px] text-black-dark dark:border-[#1b2e4b]">
                                                    <p className='font-black text-[15px]'>
                                                        {
                                                            policy?.policyTitle
                                                                ?.policies[0]
                                                                ?.description
                                                        }
                                                    </p>
                                                    <p className='text-white-dark'>
                                                        {
                                                            policy?.policyTitle
                                                                ?.policies[0]
                                                                ?.subDescription.split(/[-]/).map((line, index) => (
                                                                    <p key={index}>- {line}</p>
                                                                    ))
                                                        }                     
                                                    </p>
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />

                        <div className=" ml-5 mr-5">
                            <div className="mb-5 text-lg font-bold">
                                5. Tiện Ích Chung Homestay:
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
                                                    <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                                                        {data1.generalAmenitieSelecteds.map(
                                                            (data2, index2) => (
                                                                <span
                                                                    key={
                                                                        data2.id
                                                                    }
                                                                    className="mr-3 inline-block rounded-full bg-pink-200 px-3 py-1 text-sm font-semibold text-gray-700"
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
                        <div className=" ml-5 mr-5">
                            <div className="mb-5 mt-5 text-lg font-bold">
                                6. Thông tin phòng:
                            </div>
                            {dataHomestay?.rooms.map((room, index) => (
                                <div
                                    key={index}
                                    className="m-5 rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="mb-4 text-lg font-bold">
                                        Hình Ảnh Phòng {room.name}:
                                    </div>
                                    <Carousel
                                        sx={{
                                            margin: 'auto',
                                            width: '300px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            objectFit: 'cover',
                                            height: 'auto',
                                            maxHeight: '300px',
                                        }}
                                    >
                                        {room.images?.map(
                                            (img: any, index: number) => (
                                                <img
                                                    key={index}
                                                    src={img.url}
                                                    className=" object-cover"
                                                    alt={`slide${index + 1}`}
                                                />
                                            ),
                                        )}
                                    </Carousel>
                                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                    <div className="space-y-5 dark:text-white">
                                        <div className="mt-8 px-4">
                                            <div className="justify-between lg:flex-row">
                                                <div className="mb-6 w-full">
                                                    <div className="flex items-start justify-between ">
                                                        <div className="mb-4 text-lg font-bold">
                                                            Thông Tin Chi Tiết
                                                            Phòng:
                                                        </div>
                                                        <div className="">
                                                            <button
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/booking-calendar/${room.id}`,
                                                                    )
                                                                }
                                                            >
                                                                <IconCalendar />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col justify-between lg:flex-row">
                                                        {/* Column 1 */}
                                                        <div className="mb-6 w-full lg:w-1/2">
                                                            <div className="relative mt-4 flex items-center">
                                                                <label
                                                                    htmlFor="nameRoom"
                                                                    className="mb-0 ml-4 w-1/3 font-black ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Tên Phòng:
                                                                </label>
                                                                <div>
                                                                    <input
                                                                        className="form-input w-2/3 lg:w-full"
                                                                        id="nameRoom"
                                                                        name="nameRoom"
                                                                        type="text"
                                                                        defaultValue={
                                                                            room.name
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="relative mt-4 flex items-center">
                                                                <label
                                                                    htmlFor="capacity"
                                                                    className="mb-0 ml-4 w-1/3 font-black ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Số Lượng
                                                                    Người:
                                                                </label>
                                                                <div>
                                                                    <input
                                                                        className="form-input w-2/3 lg:w-full"
                                                                        id="capacity"
                                                                        name="capacity"
                                                                        type="number"
                                                                        defaultValue={
                                                                            room.capacity
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="relative mt-4 flex items-center font-black">
                                                                <label
                                                                    htmlFor="numberOBed"
                                                                    className="mb-0 ml-4 w-1/3 font-black ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Số Lượng
                                                                    Giường:
                                                                </label>
                                                                <div>
                                                                    <input
                                                                        className="form-input w-2/3 lg:w-full"
                                                                        id="numberOBed"
                                                                        name="numberOBed"
                                                                        type="number"
                                                                        defaultValue={
                                                                            room.numberOfBeds
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="relative mt-4 flex items-center font-black">
                                                                <label
                                                                    htmlFor="acreage"
                                                                    className="mb-0 ml-4 w-1/3 font-black ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Diện Tích
                                                                    Phòng:
                                                                </label>
                                                                <div>
                                                                    <input
                                                                        className="form-input w-2/3 lg:lg:w-full"
                                                                        id="acreage"
                                                                        name="acreage"
                                                                        type="number"
                                                                        defaultValue={
                                                                            room.acreage
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
                                                        </div>

                                                        {/* Column 2 */}
                                                        <div className="mb-6 w-full lg:w-1/2">
                                                            {/* khu nhà, ấp, số nhà, tên đường */}
                                                            <div className="mt-4 flex items-center">
                                                                <label
                                                                    htmlFor="priceWeek"
                                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Giá Thường
                                                                    Ngày:
                                                                </label>
                                                                <div>
                                                                    <input
                                                                        className="form-input w-2/3 lg:lg:w-full"
                                                                        id="priceWeek"
                                                                        type="text"
                                                                        name="priceWeek"
                                                                        value={room.price?.toLocaleString(
                                                                            'vi-VN',
                                                                            {
                                                                                style: 'currency',
                                                                                currency:
                                                                                    'VND',
                                                                            },
                                                                        )}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 flex items-center">
                                                                <label
                                                                    htmlFor="dateWeekend"
                                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                                >
                                                                    Giá Cuối
                                                                    Tuần:
                                                                </label>
                                                                <div>
                                                                    <input
                                                                        className="form-input w-2/3 lg:w-full"
                                                                        id="dateWeekend"
                                                                        name="dateWeekend"
                                                                        type="text"
                                                                        value={room.weekendPrice?.toLocaleString(
                                                                            'vi-VN',
                                                                            {
                                                                                style: 'currency',
                                                                                currency:
                                                                                    'VND',
                                                                            },
                                                                        )}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />

                                    <div className=" ml-5 mr-5">
                                        <div className="mb-5 text-lg font-bold">
                                            Tiện Ích Riêng Phòng:
                                        </div>
                                        <div className="scroll-ml-6 overflow-x-auto overflow-y-auto sm:overflow-y-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="text-black-900 px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider">
                                                            STT
                                                        </th>
                                                        <th className="text-black-900 px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider">
                                                            Tên Tiện Ích
                                                        </th>
                                                        <th className="text-black-900 px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider">
                                                            Loại Tiện Ích
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="min-w-full divide-y divide-gray-200">
                                                    {room?.roomAmenitieTitles?.map(
                                                        (data1, index) => (
                                                            <tr key={data1.id}>
                                                                <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="whitespace px-6 py-4 text-center text-sm text-gray-500">
                                                                    {
                                                                        data1
                                                                            .amenitieTitle
                                                                            ?.name
                                                                    }
                                                                </td>
                                                                <td className="whitespace px-6 py-4 text-center text-sm text-gray-500">
                                                                    {data1.roomAmenitieSelecteds.map(
                                                                        (
                                                                            data2,
                                                                            index2,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    data2.id
                                                                                }
                                                                                className=" m-2 inline-block rounded-full bg-pink-200 px-3 py-1 text-sm font-semibold text-gray-700"
                                                                            >
                                                                                {
                                                                                    data2
                                                                                        .amenitie
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
                                </div>
                            ))}
                        </div>
                        <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />

                        <div className=" ml-5 mr-5">
                            <div className="mb-5 mt-5 text-lg font-bold">
                                7. Thông tin giấy tờ:
                            </div>

                            <label className="font-black">
                                Giấy phép kinh doanh
                            </label>
                            <div className="flex h-screen items-center justify-center">
                                <iframe
                                    src={
                                        dataHomestay?.licenseFile + '#view=FitH'
                                    }
                                    width="70%"
                                    height="70%"
                                    style={{ border: 'none' }}
                                    allow="fullscreen"
                                ></iframe>
                            </div>
                            
                        </div>
                        <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                        <div>
                        <div className="text-black-500 mb-2 ml-4 text-lg font-bold">
                                        8. Các Thông Tin Thanh Toán:
                                    </div>
                                    <div className="mb-2 ml-4 flex items-center">
                                        <h2 className="mr-2 text-sm font-bold">
                                            1. Số % Tiền Cọc:
                                        </h2>
                                        <input
                                            className="rounded-md border border-gray-300 px-2 py-1 w-10"
                                            defaultValue={dataHomestay?.depositRate}
                                            disabled
                                        >
                                        </input>
                                        
                                    </div>
                                    <div className="mb-2 ml-4 flex items-start">
                                        <h2 className="mr-2 text-sm font-bold">
                                            2. Huỷ đơn trong vòng:
                                        </h2>
                                        <div className="flex flex-col items-center">
                                        <input
                                            className="rounded-md border border-gray-300 px-2 py-1 w-10"
                                            defaultValue={dataHomestay?.penaltyDate}
                                            disabled
                                        >
                                        </input>
                                        </div>
                                        <span className="mx-2 text-sm font-bold">
                                            ngày.
                                        </span>
                                        <span className="mr-2 text-sm font-bold">
                                            Trước ngày Checkin bị phạt:
                                        </span>
                                        <input
                                            className="rounded-md border border-gray-300 px-2 py-1 w-10"
                                            defaultValue={dataHomestay?.penaltyRate}
                                            disabled
                                        >
                                        </input>
                                    </div>
                        </div>
                        {dataHomestayFeedback &&
                            dataHomestayFeedback?.length > 0 && (
                                <div>
                                    <div className="mt-8 px-4">
                                        <div className="justify-between lg:flex-row">
                                            <div className="mb-6 w-full">
                                                <div className="text-lg font-bold">
                                                    9. Feedback Khách Hàng:
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
                                                                {feedback
                                                                    ?.tourist
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
                    <div className="mt-6 w-full md:mt-0 md:w-96">
                        <div className="panel mb-5">
                            <div className="mt-4">
                                <div>
                                    <label
                                        className="font-bold"
                                        htmlFor="status"
                                    >
                                        Trạng Thái
                                    </label>
                                    <Select
                                        className=' custom-select-home'
                                        value={selectedOption}
                                        onChange={handleChange}
                                        options={options}
                                        isSearchable={false}
                                        // isOptionDisabled={(option) => option.value === 'PENDING' }
                                        isOptionDisabled={(option) => option.value === 'INACTIVE TEMPORARY' || option.value === 'INACTIVE' || option.value === 'PENDING' }
                                        isDisabled={dataHomestay?.status === 'DISABLE' || dataHomestay?.status === 'INACTIVE'}
                                    />
                                    {selectedOption?.value ===
                                        'INACTIVE TEMPORARY' && (
                                        <div className="mt-4">
                                            <div>
                                                <label
                                                    htmlFor="startTime"
                                                    className="mb-0 block font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                >
                                                    Ngày Bắt Đầu:
                                                </label>

                                                <input
                                                className="form-input mr-2 w-full md:mb-2 md:w-full "
                                                id="startTime"
                                                type="date"
                                                name="startTime"
                                                defaultValue={dataHomestay?.startDateInActiveTemporary}
                                                disabled

                                            />
                                            </div>

                                            <div className="mb-5 md:mb-0">
                                                <label
                                                    htmlFor="endTime"
                                                    className="mb-0 mt-2 block font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                >
                                                    Ngày Kết Thúc:
                                                </label>

                                                <input
                                                    className="form-input mr-2 w-full md:w-full "
                                                    id="endTime"
                                                    type="date"
                                                    name="endTime"
                                                    defaultValue={dataHomestay?.endDateInActiveTemporary}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {(selectedOption?.value === 'CANCELLED' ||
                                        selectedOption?.value ===
                                            'DISABLE') && (
                                        <div className="pt-2">
                                            <label htmlFor="ctnTextarea">
                                                Lý do từ chối
                                            </label>
                                            <textarea
                                                id="ctnTextarea"
                                                rows={2}
                                                className="form-textarea"
                                                placeholder="Lý do"
                                                value={datarejectReason !== null ? datarejectReason : '' }
                                                onChange={(e) => {
                                                    setdatarejectReason(
                                                        e.target.value,
                                                    );
                                                }}
                                            ></textarea>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-full gap-2"
                            onClick={async () => {
                                handleSubmit(dataHomestay?.id || '');
                                navigate('/managehomestay', { state: { isUpdate: true } });
                            }}
                        >
                            <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                            Lưu
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-primary fixed bottom-16 right-3 w-[150px] gap-2 sm:col-span-2 lg:col-span-1 xl:col-span-full"
                            onClick={() => navigate('/listhomestay')}
                        >
                            <IconArrowBackward className="shrink-0 ltr:mr-2 rtl:ml-2" />
                            Quay Lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailHomestay;
