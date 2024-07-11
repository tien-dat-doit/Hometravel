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

const validationSchema = Yup.object({
    listRoom: Yup.array().of(
        Yup.object().shape({
            recieverPeople: Yup.number()
                .required('Vui lòng nhập ít nhất 1 người')
                .min(1, 'Vui lòng nhập ít nhất 1 người')
                .max(10, 'Tối đa 10 người'),
            mainImage: Yup.mixed().required('Hình Ảnh Phòng Bắt Buộc Có !'),
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
            priceRoomPromotion: Yup.number().min(
                10000,
                'Đơn giá ít nhất từ 10.000 VNĐ',
            ),
            startPricePromotion: Yup.date()
                // .required('Ngày bắt đầu (dự kiến) bắt buộc có')
                .min(
                    new Date(Date.now() - 864e5),
                    'Ngày bắt đầu (dự kiến) không được là ngày trong quá khứ!',
                ),
            endPricePromotion: Yup.date()
                // .required('Ngày kết thúc (dự kiến) bắt buộc có')
                .min(
                    Yup.ref('startPricePromotion'),
                    'Ngày kết thúc (dự kiến) phải sau ngày bắt đầu (dự kiến)',
                )
                .test(
                    'max-days',
                    'Ngày kết thúc (dự kiến) tối đa 30 ngày kể từ ngày bắt đầu',
                    function (value) {
                        try {
                            const { startPricePromotion } = this.parent;
                        const maxEndDate = new Date(
                            startPricePromotion.getTime() + 864e5 * 30,
                        );

                        return !value || value <= maxEndDate; 
                        } catch (error) {
                           return true 
                        }
                       
                    },
                ),
        }),
    ),
});
const AddRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const {homestayId} = useParams()
    const formikRef = useRef<FormikProps<FormikValues>>(null);
    useEffect(() => {
        dispatch(setPageTitle('Thêm Phòng'));
    });
    const [listRoomAmenitiesAPI, setListRoomAmenitiesAPI] = useState<any>([]);
    const [listRoomAmenitiesInitValue, setListRoomAmenitiesInitValue] =
        useState<any>([]);
 

    useEffect(() => {
 
        const fetchListRoomAmenities = async () => {
            try {
                const response = await roomAPI.getListAmenities();
                setListRoomAmenitiesAPI(response?.data ?? []);
                const newArr = response?.data?.map((a: any) => {
                    return {
                        amenitieTitleId: a?.id,
                        name: a?.name,
                        roomAmenitieSelected: [],
                    };
                });
                setListRoomAmenitiesInitValue(newArr ?? []);
                console.log('data check', newArr);
            } catch (error) {
                console.log('Error get list amenities', error);
            }
        };



        fetchListRoomAmenities()
    }, []);
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
                    <span className="h-10 w-10">
                        <h2 className="text-xl font-semibold text-red-500">
                            Vui lòng đợi...
                        </h2>
                        <span className="inline-flex h-full w-full animate-ping rounded-full bg-info"></span>
                    </span>
                </div>
            )}
            {
                listRoomAmenitiesInitValue?.length > 0 &&
                (
                    <Formik
                        innerRef={formikRef}
                        initialValues={{                         
                            listRoom: [
                                {
                                    recieverPeople: '',
                                    listExtensionOfRoom: [],
                                    isOtherAmenities: false,
                                    roomAmenitieTitles:
                                        listRoomAmenitiesInitValue,
                                    recieverName: '',
                                    recieveBed: '',
                                    acreageRoom: '',
                                    priceRoomNor: '',
                                    priceRoomWe: '',
                                    priceRoomPromotion: '',
                                    startPricePromotion: '',
                                    endPricePromotion: '',
                                    mainImage: null,
                                    imgTemp: [],
                                },
                            ],                      
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            setIsSubmit(true);
                            console.log('test values before submit', values);
                            function updateRoomWithSpecificDataSubmit(payload: any, roomId: string) {
                                return new Promise(async (resolve, reject) => {
                                  try {
                                    const data = await roomAPI.createRoom(payload);                                       
                                    resolve(data);
                                  } catch (error) {
                                    reject(error);
                                  }
                                });
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
                                        status: 'ACTIVE',
                                        roomConfig: {
                                            roomId: r.roomId,
                                            durationPrice:
                                                r.priceRoomPromotion,
                                            startDate: moment(
                                                r.startPricePromotion,
                                            ).format(
                                                'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                                            ),
                                            endDate: moment(
                                                r.endPricePromotion,
                                            ).format(
                                                'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                                            ),
                                        },
                                    };
                                });                                                  
                            const listSubmitRoom = newArrayRoomFormat?.map((room: any)=>{                                   
                                    let dataSubmit = new FormData();
                                    dataSubmit.append(
                                        `room.homeStayId`,
                                        homestayId ?? "",
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
                                        `room.status`,
                                        "ACTIVE",
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
                                    for (
                                        let c = 0;
                                        c <
                                        room.images?.length;
                                        c++
                                    ) {
                                        dataSubmit.append(
                                            `images`,
                                            room.images[c],
                                        );
                                    }

                                    if (
                                        room.roomConfig
                                            .durationPrice >= 10000
                                    ) {
                                       
                                        dataSubmit.append(
                                            `roomConfig.durationPrice`,
                                            room.roomConfig
                                                .durationPrice,
                                        );
                                        dataSubmit.append(
                                            `roomConfig.startDate`,
                                            room.roomConfig
                                                .startDate,
                                        );
                                        dataSubmit.append(
                                            `roomConfig.endDate`,
                                            room.roomConfig
                                                .endDate,
                                        );
                                    }
                                    for (
                                        let a = 0;
                                        a <
                                        room
                                            ?.roomAmenitieTitles?.length;
                                        a++
                                    ) {
                                        if (
                                            room
                                                ?.roomAmenitieTitles[a]
                                                ?.roomAmenitieSelected?.length >
                                            0
                                        ) {
                                            dataSubmit.append(
                                                `roomAmenitieTitles[${a}].amenitieTitleId`,
                                                room
                                                    .roomAmenitieTitles[a]
                                                    .amenitieTitleId,
                                            );
                                            for (
                                                let b = 0;
                                                b <
                                                room
                                                    .roomAmenitieTitles[a]
                                                    ?.roomAmenitieSelected
                                                    ?.length;
                                                b++
                                            ) {
                                                dataSubmit.append(
                                                    `roomAmenitieTitles[${a}].roomAmenitieSelected[${b}]`,
                                                    room
                                                        .roomAmenitieTitles[a]
                                                        .roomAmenitieSelected[
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
                                        room
                                            ?.roomAmenitieTitles?.length;
                                        a++
                                    ) {
                                        if (
                                            room
                                                ?.otherAmenities[a]?.length > 0
                                        ) {
                                            dataSubmit.append(
                                                `otherAmenities[${a}]`,
                                                room
                                                    .otherAmenities[a],
                                            );
                                        }
                                    }
                                    return {
                                        dataSubmit: dataSubmit,
                                        roomId: room?.roomId    
                                    }                                      
                                
                            })                              
                            try { 
                                    const requests = listSubmitRoom?.map((room: any) => updateRoomWithSpecificDataSubmit(room?.dataSubmit, room?.roomId));
                                    const responsesRoom = await Promise.all(requests);
                                    console.log({responsesRoom});
                                toast.success(                             
                                        'Tạo thành công',
                                );                               
                                navigate(-1)
                            } catch (error: any) {
                                toast.error(
                                    error?.response?.data?.msg ??
                                        'Tạo thất bại',
                                );
                            } finally {
                                setIsSubmit(false);
                            }
                        }}
                    >
                        {({ values }) => (
                            <Form className="panel flex flex-1 flex-col px-0 py-6 md:flex-row ltr:xl:mr-6 rtl:xl:ml-6">
                                <div className="panel flex-1 ltr:xl:mr-6 rtl:xl:ml-6">                             
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
                                                         {index > 0 ? (<span
                                                                className="w-[200px] btn btn-danger mb-2 me-2 rounded-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-1 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-red-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-pink-300 dark:shadow-lg dark:shadow-red-800/80 dark:focus:ring-red-800"
                                                                onClick={() => {
                                                                    // setModal17(true)
                                                                   
                                                                   
                                                                        remove(
                                                                            index,
                                                                        );                                                          
                                                                        return;
                                                                    
                                                                }}
                                                            >
                                                                <IconTrash className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />{' '}
                                                                Xóa Phòng{' '}
                                                                {index + 1}
                                                            </span>) : (<></>)}
                                                            
                                                        </div>
                                                    ),
                                                )}
                                                <div className="mb-6 mt-5 flex items-center justify-center sm:mb-0">
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
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>                                                                                               
                                </div>

                                <div className="mt-6 w-full md:ml-10 md:mt-0 md:w-96">
                                    {/* <div className="panel mb-5">
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
                                                        'Đang Chờ Kiểm Duyệt'
                                                    }
                                                    placeholder="Đang Chờ Kiểm Duyệt"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div> */}
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

export default AddRoom;
