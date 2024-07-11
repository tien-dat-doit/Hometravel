import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';

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
import { useRef } from 'react';
import Carousel from 'react-material-ui-carousel';
import { NumericFormat } from 'react-number-format';
import { toast } from 'react-toastify';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'tippy.js/dist/tippy.css';
import * as Yup from 'yup';
import IconArrowBackward from '../../components/Icon/IconArrowBackward';
import IconBox from '../../components/Icon/IconBox';
import IconCamera from '../../components/Icon/IconCamera';
import IconPencil from '../../components/Icon/IconPencil';
import IconSave from '../../components/Icon/IconSave';
import useAuth from '../../hook/useAuth';
import roomAPI from '../../util/roomAPI';
import CalendarPriceRoom from '../Pages/CalendarPriceRoom';
import CalendarUpdatePriceForRoom from '../Pages/CalendarUpdatePriceRoom';

interface RoomDetail {
    id: string;
    name: string;
    numberOfBeds: number;
    acreage: number;
    capacity: number;
    price: number;
    status: string;
    weekendPrice: number;
    homeStayId: string;
    images: imageRoom[];
    roomAmenitieTitles: roomAmenity[];
}
interface roomAmenity {
    id: string;
    roomId: string;
    amenitieTitleId: null | string;
    amenitieTitle: null | amenitieTitleObject;
    roomAmenitieSelecteds: roomSubAmenity[];
}
interface amenitieTitleObject {
    id: string;
    name: string;
}
interface roomSubAmenity {
    id: string;
    amenitieId: string;
    roomAmenitieTitleId: string;
    amenitie: {
        id: string;
        name: string;
        status: string;
        amenitieTitleId: null | string;
    };
}
interface imageRoom {
    id: string;
    url: string;
    roomId: string;
    homeStayId: null | string;
}

interface roomConfigObject {
    id: string;
    startDate: string;
    endDate: string;
    durationPrice: number;
    roomId: string;
}
const validationSchema = Yup.object({
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
const UpdateRoom = ({ roomId, setIsUpdate }: any) => {
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
    const [listRoomAmenitiesAPI, setListRoomAmenitiesAPI] = useState<any>([]);
    const [initValueRooms, setInitValueRooms] = useState<any>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsSubmit(true);
                const responseRoom = await roomAPI.getDetail(roomId);
                const responseRoomAmenities = await roomAPI.getListAmenities();
                setListRoomAmenitiesAPI(responseRoomAmenities?.data ?? []);
                console.log('check room', responseRoom);
                let listOtherAmenitiesRoom: any[] = [];
                let initAmenitiesRoom = responseRoomAmenities?.data?.map(
                    (a: any) => {
                        let arrayAmenitiesSelectedBefore;
                        for (
                            let i = 0;
                            i < responseRoom?.data?.roomAmenitieTitles?.length;
                            i++
                        ) {
                            if (
                                responseRoom?.data?.roomAmenitieTitles[i]
                                    ?.amenitieTitleId === a?.id
                            ) {
                                arrayAmenitiesSelectedBefore =
                                    responseRoom?.data?.roomAmenitieTitles[
                                        i
                                    ]?.roomAmenitieSelecteds?.map(
                                        (amenitySelected: any) =>
                                            amenitySelected?.amenitie?.id,
                                    );
                            }
                            if (
                                responseRoom?.data?.roomAmenitieTitles[i]
                                    ?.amenitieTitle?.name === 'Khác'
                            ) {
                                listOtherAmenitiesRoom =
                                    responseRoom?.data?.roomAmenitieTitles[
                                        i
                                    ]?.roomAmenitieSelecteds?.map(
                                        (amenitySelected: any) =>
                                            amenitySelected?.amenitie?.name,
                                    );
                            }
                        }
                        return {
                            amenitieTitleId: a?.id,
                            name: a?.name,
                            roomAmenitieSelected:
                                arrayAmenitiesSelectedBefore ?? [],
                        };
                    },
                );
                const initValueRoomsLoad = [
                    {
                        homeStayId: responseRoom?.data?.homeStayId ?? '',
                        status: responseRoom?.data?.status ?? 'UNKNOWN',
                        roomId: responseRoom?.data?.id ?? '',
                        recieverPeople: responseRoom?.data?.capacity ?? 0,
                        listExtensionOfRoom: listOtherAmenitiesRoom ?? [],
                        isOtherAmenities:
                            listOtherAmenitiesRoom?.length > 0 ? true : false,
                        roomAmenitieTitles: initAmenitiesRoom,
                        recieverName: responseRoom?.data?.name ?? '',
                        recieveBed: responseRoom?.data?.numberOfBeds ?? 0,
                        acreageRoom: responseRoom?.data?.acreage ?? 0,
                        priceRoomNor: responseRoom?.data?.price ?? 0,
                        priceRoomWe: responseRoom?.data?.weekendPrice ?? 0,
                        mainImage: null,
                        imgTemp: responseRoom?.data?.images?.map(
                            (i: any) => i.url,
                        ),
                    },
                ];
                setInitValueRooms(initValueRoomsLoad);
                setIsSubmit(false);
            } catch (error) {
                console.log('Error fetching data', error);
                setIsSubmit(false);
                toast.error('Lấy dữ liệu thất bại!');
            }
        };

        if (roomId) {
            fetchData();
        }
    }, [roomId]);
    const { auth }: any = useAuth();
    console.log({ initValueRooms });
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
            {initValueRooms?.length > 0 && (
                <Formik
                    innerRef={formikRef}
                    initialValues={{
                        listRoom: initValueRooms,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        setIsSubmit(true);
                        console.log('test values before submit', values);
                        //return;
                        if (roomId) {
                            const newArrayRoomFormat = values?.listRoom?.map(
                                (r: any) => {
                                    let amenitiesFilter =
                                        r.roomAmenitieTitles?.filter(
                                            (a: any) =>
                                                a?.roomAmenitieSelected
                                                    ?.length > 0,
                                        );
                                    return {
                                        homeStayId: r.homeStayId,
                                        roomId: r.roomId,
                                        capacity: r.recieverPeople,
                                        roomAmenitieTitles: amenitiesFilter,
                                        otherAmenities: r.listExtensionOfRoom,
                                        name: r.recieverName,
                                        numberOfBeds: r.recieveBed,
                                        acreage: r.acreageRoom,
                                        price: r.priceRoomNor,
                                        weekendPrice: r.priceRoomWe,
                                        images: r.mainImage,
                                        status: 'ACTIVE',
                                    };
                                },
                            );                       
                            let dataSubmit = new FormData();
                            newArrayRoomFormat?.map((room: any) => {
                                dataSubmit.append(
                                    `room.homeStayId`,
                                    room?.homeStayId,
                                );
                                dataSubmit.append(`room.id`, room.roomId);
                                dataSubmit.append(`room.name`, room.name);
                                dataSubmit.append(
                                    `room.capacity`,
                                    room.capacity,
                                );
                                dataSubmit.append(
                                    `room.numberOfBeds`,
                                    room.numberOfBeds,
                                );
                                dataSubmit.append(`room.acreage`, room.acreage);
                                dataSubmit.append(`room.price`, room.price);
                                dataSubmit.append(
                                    `room.weekendPrice`,
                                    room.weekendPrice,
                                );
                                dataSubmit.append(`room.status`, 'ACTIVE');
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
                                    a < room?.roomAmenitieTitles?.length;
                                    a++
                                ) {
                                    if (
                                        room?.roomAmenitieTitles[a]
                                            ?.roomAmenitieSelected?.length > 0
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
                                                ?.roomAmenitieSelected?.length;
                                            b++
                                        ) {
                                            dataSubmit.append(
                                                `roomAmenitieTitles[${a}].roomAmenitieSelected[${b}]`,
                                                room.roomAmenitieTitles[a]
                                                    .roomAmenitieSelected[b],
                                            );
                                        }
                                    }
                                }                              
                                for (
                                    let a = 0;
                                    a < room?.roomAmenitieTitles?.length;
                                    a++
                                ) {
                                    if (room?.otherAmenities[a]?.length > 0) {
                                        dataSubmit.append(
                                            `otherAmenities[${a}]`,
                                            room.otherAmenities[a],
                                        );
                                    }
                                }
                                return true;
                            });
                            try {
                                const response: any = await roomAPI.updateRoom(
                                    dataSubmit,
                                    roomId,
                                );
                                toast.success(
                                    response?.msg ?? 'Cập nhật thành công',
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
                    }}
                >
                    {({ values }) => (
                        <Form className="panel flex flex-1 flex-col px-0 py-6 md:flex-row ltr:xl:mr-6 rtl:xl:ml-6">
                            <div className="panel flex-1 ltr:xl:mr-6 rtl:xl:ml-6">
                                <FieldArray name="listRoom">
                                    {() => (
                                        <div>
                                            {values.listRoom.map(
                                                (room: any, index: any) => (
                                                    <div
                                                        className="mt-8 px-4"
                                                        key={index}
                                                    >
                                                        <div className="flex flex-col justify-between lg:flex-row">
                                                            <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
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
                                                                        Số Lượng
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
                                                                        Số Lượng
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
                                                                        Giá Cuối
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
                                                         {/* render lịch */}
                                                        <div>
                                                        <CalendarUpdatePriceForRoom roomId={roomId} setLoading={setIsSubmit}/>
                                                        </div>
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
                                                                            Phòng
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
                                                        {/* Tiện ích phòng */}
                                                        <div className=" mx-auto p-4">
                                                            <div className="text-black-500 mb-2 ml-4 text-lg font-bold">
                                                                Tiện Ích Phòng
                                                            </div>
                                                            {/* Tiện ích phòng chung*/}
                                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                                {listRoomAmenitiesAPI?.map(
                                                                    (
                                                                        amenity: any,
                                                                        index1: any,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                amenity?.id
                                                                            }
                                                                        >
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
                                                                                    {
                                                                                        amenity?.name
                                                                                    }
                                                                                </div>
                                                                                {/* render list amenity detail of it's title */}
                                                                                {amenity?.amenities?.map(
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
                                                                                                    name={`listRoom.${index}.roomAmenitieTitles[${index1}].roomAmenitieSelected`}
                                                                                                >
                                                                                                    {({
                                                                                                        field,
                                                                                                        form,
                                                                                                    }: any) => (
                                                                                                        <label className="inline-flex">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                checked={
                                                                                                                    values.listRoom[
                                                                                                                        index
                                                                                                                    ]?.roomAmenitieTitles[
                                                                                                                        index1
                                                                                                                    ]?.roomAmenitieSelected?.findIndex(
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
                                                                                                                        const newArray =
                                                                                                                            [
                                                                                                                                ...values
                                                                                                                                    .listRoom[
                                                                                                                                    index
                                                                                                                                ]
                                                                                                                                    ?.roomAmenitieTitles[
                                                                                                                                    index1
                                                                                                                                ]
                                                                                                                                    ?.roomAmenitieSelected,
                                                                                                                                amenityDetail?.id,
                                                                                                                            ];

                                                                                                                        form.setFieldValue(
                                                                                                                            field.name,
                                                                                                                            newArray,
                                                                                                                        );
                                                                                                                    } else {
                                                                                                                        const newArray =
                                                                                                                            values.listRoom[
                                                                                                                                index
                                                                                                                            ]?.roomAmenitieTitles[
                                                                                                                                index1
                                                                                                                            ]?.roomAmenitieSelected?.filter(
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
                                                            {/* Tiện ích phòng Khác */}
                                                            <div className="rounded p-4">
                                                                <div className="mb-2 flex items-center font-bold"></div>
                                                                <div className="space-y-2">
                                                                    <label
                                                                        className="inline-flex"
                                                                        htmlFor={
                                                                            'isOtherAmenities'
                                                                        }
                                                                    >
                                                                        <Field
                                                                            type="checkbox"
                                                                            id="isOtherAmenities"
                                                                            name={`listRoom.${index}.isOtherAmenities`}
                                                                            className="peer form-checkbox outline-primary"
                                                                            checked={
                                                                                values
                                                                                    .listRoom[
                                                                                    index
                                                                                ]
                                                                                    .isOtherAmenities
                                                                            }
                                                                            // onChange={
                                                                            //     handleCheckboxChange
                                                                            // }
                                                                        />
                                                                        <span className="peer-checked:text-primary">
                                                                            Khác
                                                                        </span>
                                                                    </label>
                                                                    {/* Thêm các option khác nếu cần */}
                                                                </div>
                                                                {values
                                                                    .listRoom[
                                                                    index
                                                                ]
                                                                    .isOtherAmenities && (
                                                                    <FieldArray
                                                                        name={`listRoom.${index}.listExtensionOfRoom`}
                                                                    >
                                                                        {({
                                                                            push,
                                                                            remove,
                                                                        }) => (
                                                                            <div className="grid grid-cols-3 gap-4">
                                                                                {values.listRoom[
                                                                                    index
                                                                                ].listExtensionOfRoom.map(
                                                                                    (
                                                                                        extension: any,
                                                                                        indexValue: any,
                                                                                    ) => (
                                                                                        <div
                                                                                            className="mt-8 flex items-center px-4"
                                                                                            key={
                                                                                                indexValue
                                                                                            }
                                                                                        >
                                                                                            <div className="w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                                                                                                <div className="text-lg font-bold">
                                                                                                    {/* Tiện Ích{' '} */}
                                                                                                    {indexValue +
                                                                                                        1}

                                                                                                    .
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="flex-grow sm:mb-0">
                                                                                                <Field
                                                                                                    className="form-input w-full lg:w-[200px]"
                                                                                                    type="text"
                                                                                                    name={`listRoom.${index}.listExtensionOfRoom.${indexValue}`}
                                                                                                    placeholder={`#Nhập tiện ích ${indexValue + 1}`}
                                                                                                />
                                                                                                <div>
                                                                                                    {' '}
                                                                                                    <ErrorMessage
                                                                                                        component="a"
                                                                                                        name={`listRoom.${index}.listExtensionOfRoom.${indexValue}`}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <button
                                                                                                className="btn btn-outline-danger ml-2 rounded-lg p-2 font-extrabold"
                                                                                                onClick={() => {
                                                                                                    remove(
                                                                                                        indexValue,
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
                                                                                            push(
                                                                                                '',
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Thêm
                                                                                        Tiện
                                                                                        Ích
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </FieldArray>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </FieldArray>
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
                                                        initValueRooms[0]
                                                            ?.status,
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
const DetailRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(setPageTitle('Chi Tiết Phòng'));
    });
    const [isUpdate, setIsUpdate] = useState(false);
    const { id } = useParams();
    const [dataRoom, setDataRoom] = useState<RoomDetail>();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchRoomDetail = async (id: string) => {
            try {
                setIsLoading(true)
                const response = await roomAPI.getDetail(id);
                setDataRoom(response.data);
            } catch (err) {
                console.log(
                    'Error fetch room detail with: ',
                    err,
                    ' | id room: ',
                    id,
                );
            }finally{
                setIsLoading(false)
            }
        };
        if (typeof id === 'string' && isUpdate === false) {
            fetchRoomDetail(id);
        }
    }, [id, isUpdate]);

    return (
        <div className="flex flex-col gap-2.5">
        {isLoading && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <span className="item-center flex h-[500px] w-[500px] flex-col justify-center gap-3">
                        <h2 className="text-2xl font-bold text-white">
                            Đang tải dữ liệu...
                        </h2>
                        <span className="ml-[80px] h-[30px] w-[30px] animate-ping rounded-full bg-info"></span>
                    </span>
                </div>
            )}
            {isUpdate ? (
                <UpdateRoom roomId={id} setIsUpdate={setIsUpdate} />
            ) : (
                <div className="panel flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                    <div className="mb-4 ml-4 text-lg font-bold">
                        1. Hình Ảnh Phòng {dataRoom?.name}:
                    </div>

                    <Carousel
                        sx={{
                            margin: 'auto',
                            // width: '1250px',
                            border: 'none',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            height: { xs: 'auto', md: '500px' },
                            maxWidth: '1250px',
                        }}
                    >
                        {dataRoom?.images?.map((img, index) => (
                            <img
                                key={index}
                                src={img?.url}
                                className="h-auto w-full"
                                alt={`slide${index + 1}`}
                            />
                        ))}
                    </Carousel>

                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />

                    <div className="space-y-5 dark:text-white">
                        <div className="mt-8 px-4">
                            <div className="justify-between lg:flex-row">
                                <div className="mb-6 w-full">
                                    <div className="mb-4 text-lg font-bold">
                                        2. Thông Tin Chi Tiết Phòng:
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
                                                        className="form-input w-2/3 lg:w-[300px]"
                                                        id="nameRoom"
                                                        name="nameRoom"
                                                        type="text"
                                                        value={dataRoom?.name}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative mt-4 flex items-center">
                                                <label
                                                    htmlFor="capacity"
                                                    className="mb-0 ml-4 w-1/3 font-black ltr:mr-2 rtl:ml-2"
                                                >
                                                    Số Lượng Người:
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[300px]"
                                                        id="capacity"
                                                        name="capacity"
                                                        type="number"
                                                        value={
                                                            dataRoom?.capacity
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
                                                    Số Lượng Giường:
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[300px]"
                                                        id="numberOBed"
                                                        name="numberOBed"
                                                        type="number"
                                                        value={
                                                            dataRoom?.numberOfBeds
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
                                                    Diện Tích Phòng:
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[300px]"
                                                        id="acreage"
                                                        name="acreage"
                                                        type="number"
                                                        value={
                                                            dataRoom?.acreage
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
                                            {/* Các trường khác của Column 1 */}
                                            {/* ... */}
                                        </div>

                                        {/* Column 2 */}
                                        <div className="mb-6 w-full lg:w-1/2">
                                            {/* khu nhà, ấp, số nhà, tên đường */}
                                            <div className="mt-4 flex items-center">
                                                <label
                                                    htmlFor="priceWeek"
                                                    className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                                                >
                                                    Giá Thường Ngày:
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="priceWeek"
                                                        type="text"
                                                        name="priceWeek"
                                                        value={dataRoom?.price?.toLocaleString(
                                                            'vi-VN',
                                                            {
                                                                style: 'currency',
                                                                currency: 'VND',
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
                                                    Giá Cuối Tuần:
                                                </label>
                                                <div>
                                                    <input
                                                        className="form-input w-2/3 lg:w-[250px]"
                                                        id="dateWeekend"
                                                        name="dateWeekend"
                                                        type="text"
                                                        value={dataRoom?.weekendPrice?.toLocaleString(
                                                            'vi-VN',
                                                            {
                                                                style: 'currency',
                                                                currency: 'VND',
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
                        {id && <CalendarPriceRoom roomId={id} setLoading={setIsLoading}/>}
                    </div>

                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />

                    <div className=" ml-5 mr-5">
                        <div className="mb-5 text-lg font-bold">
                            3 . Tiện Ích Riêng Phòng:
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
                                    {dataRoom?.roomAmenitieTitles?.map(
                                        (data1, index) => (
                                            <tr key={data1.id}>
                                                <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                                                    {data1.amenitieTitle?.name}
                                                </td>
                                                <td className="flex flex-wrap whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                                                    {data1.roomAmenitieSelecteds.map(
                                                        (data2, index2) => (
                                                            <span
                                                                key={data2.id}
                                                                className="mb-3 mr-3 inline-block rounded-full bg-pink-200 px-3 py-1 text-sm font-semibold text-gray-700"
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

export default DetailRoom;
