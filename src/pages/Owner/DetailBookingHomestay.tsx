import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import IconX from '../../components/Icon/IconX';
import { setPageTitle } from '../../store/themeConfigSlice';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'tippy.js/dist/tippy.css';
import IconArrowBackward from '../../components/Icon/IconArrowBackward';
import IconPencil from '../../components/Icon/IconPencil';
import IconSquareCheck from '../../components/Icon/IconSquareCheck';
import bookingAPI from '../../util/bookingAPI';
import ModalCheckInCheckOut from '../Components/ModalCheckInCheckOut';

interface bookingDetailObject {
    id: string;
    price: number;
    roomId: string;
    bookingId: string;
    room: {
        id: string;
        name: string;
        numberOfBeds: number;
        acreage: number;
        capacity: number;
        price: number;
        status: string;
        weekendPrice: number;
        homeStayId: string;
        roomAmenitieTitles: [];
        images: [];
        homeStay: {
            id: string;
            name: string;
            acreage: number;
            city: string;
            district: string;
            commune: string;
            street: string;
            house: string | null;
            hamlet: string | null;
            address: string;
            checkInTime: string;
            checkOutTime: string;
            description: string;
            status: string;
            createdDate: string | null;
            ownerId: string;
            depositRate: number;
            penaltyDate: number;
            penaltyRate: number;
        };
    };
    booking: {
        id: string;
        totalPrice: number;
        totalCapacity: number;
        actualQuantityTourist: number;
        checkInDate: string | null;
        checkOutDate: string | null;
        status: string;
        isCheckin: boolean | null;
        createdDate: string;
        touristId: string;
        tourist: {
            id: string;
            phoneNumber: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string;
            gender: boolean;
            dateOfBirth: string;
            status: string | null;
        };
    };
}
interface objectDetailPriceCancel {
    TotalPriceBooking: number;
    AmountDeposit: number;
    AmountPaid: number;
    AmountPenalty: number;
    AmountRefund: number;
}

const Add = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isUpdate, setIsUpdate] = useState(false);
    const { id } = useParams();
    const [quantityTourist, setQuantityTourist] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [canCheckin, setCanCheckin] = useState(false);
    const [canCheckout, setCanCheckout] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const objectCancel = {
        AmountDeposit: 0,
        AmountPaid: 0,
        AmountPenalty: 0,
        AmountRefund: 0,
        TotalPriceBooking: 0,
    };
    const [errorNumberPeople, setErrorNumberPeople] = useState('');
    const [dataDetailCancel, setDataDetailCancel] =
        useState<objectDetailPriceCancel>(objectCancel);
    const handleUpdate = async () => {
        if (id) {
            try {
                const dataSubmit = {
                    id: id,
                    totalPrice: dataDetail[0]?.booking?.totalPrice,
                    totalCapacity: dataDetail[0]?.booking?.totalCapacity,
                    actualQuantityTourist: quantityTourist,
                    checkInDate: dataDetail[0]?.booking?.checkInDate,
                    checkOutDate: dataDetail[0]?.booking?.checkOutDate,
                    status: dataDetail[0]?.booking?.status,
                    isCheckin: dataDetail[0]?.booking?.isCheckin,
                    touristId: dataDetail[0]?.booking?.touristId,
                };
                const response: any = await bookingAPI.updateBookingInfo(
                    dataSubmit,
                    id,
                );
                setIsUpdate(false);
                toast.success(response?.msg ?? 'Cập nhật thành công');
            } catch (error) {
                toast.error('Cập nhật thất bại!');
            }
        }
    };
    useEffect(()=>{
        const handleCheckInAndCheckOut = async (isCheckIn: boolean) => {        
            if (id) {
                try {
                    const dataSubmit = {
                        id: id,
                        totalPrice: dataDetail[0]?.booking?.totalPrice,
                        totalCapacity: dataDetail[0]?.booking?.totalCapacity,
                        actualQuantityTourist:
                            dataDetail[0]?.booking?.actualQuantityTourist,
                        checkInDate: dataDetail[0]?.booking?.checkInDate,
                        checkOutDate: dataDetail[0]?.booking?.checkOutDate,
                        status: dataDetail[0]?.booking?.status,
                        isCheckin: isCheckIn ? true : false,
                        touristId: dataDetail[0]?.booking?.touristId,
                    };
                    const response: any = await bookingAPI.updateBookingInfo(
                        dataSubmit,
                        id,
                    );
                    setIsUpdate(false);
                    toast.success(response?.msg ?? 'Cập nhật thành công');
                } catch (error) {
                    toast.error('Cập nhật thất bại!');
                }
            }
        };
        if(dataDetail[0]?.booking?.isCheckin === null || dataDetail[0]?.booking?.isCheckin === true){
        handleCheckInAndCheckOut(dataDetail[0].booking.isCheckin === null ? true : false)
        }
    },[isConfirm])
   
    useEffect(() => {
        dispatch(setPageTitle('Chi Tiết Booking'));
    });
    const renderStatus = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'Thanh Toán Hoàn Tất';
            case 'DEPOSIT':
                return 'Đã Thanh Toán Cọc';
            case 'CANCELLED':
                return 'Đã Bị Hủy';
            case 'REFUND':
                return 'Đã Hoàn Tiền';
            case 'PENDING':
                return 'Chờ Thanh Toán';
            case 'EXPIRED':
                return 'Đơn Quá Hạn';
            case 'PAYMENT SETTLEMENT':
                return 'Đang Giải Quyết Thanh Toán';
            case 'DONE':
                return 'ADMIN Đã Thanh Toán Cho Chủ Homestay';
            default:
                return 'Chưa Xác Định';
        }
    };
    const renderTextTotalPrice = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'Đã Thanh Toán';
            case 'PENDING':
                return 'Tiền Cần Thanh Toán';
            default:
                return 'Tổng Giá Tiền';
        }
    };
    const [dataDetail, setDataDetail] = useState<bookingDetailObject[] | []>(
        [],
    );
    useEffect(() => {
        const fetchData = async (id: string) => {
            try {
                const response = await bookingAPI.getDetail(id);
                setDataDetail(response.data ?? []);
                console.log(response.data);
                setQuantityTourist(
                    response?.data[0]?.booking?.actualQuantityTourist ?? 0,
                );
                if (response?.data[0]?.booking?.status === 'CANCELLED') {
                    const responseDetailCancel =
                        await bookingAPI.getInfoPriceWithBookingCanceled(id);
                    setDataDetailCancel(
                        responseDetailCancel?.data || objectCancel,
                    );
                }
                const validStatusForCheckInOrCheckOut = [
                    'PAID',
                    'DEPOSIT',
                    'PAYMENT SETTLEMENT',
                ];
                // Chưa check in
                if (response?.data[0]?.booking?.isCheckin === null) {
                    const currentTime = moment();
                    const timeCheckin = moment(
                        response?.data[0]?.booking?.checkInDate + 'T14:00',
                    );
                    // So sánh thời gian checkin của booking và thời gian render hiện tại
                    if (timeCheckin.isBefore(currentTime)) {
                        if (
                            validStatusForCheckInOrCheckOut.includes(
                                response?.data[0]?.booking?.status,
                            )
                        ) {
                            setCanCheckin(true);
                        }
                    } else {
                        if (
                            validStatusForCheckInOrCheckOut.includes(
                                response?.data[0]?.booking?.status,
                            )
                        ) {
                            setCanCheckin(false);
                        }
                    }
                }
                // Đã check in
                if (response?.data[0]?.booking?.isCheckin === true) {
                    if (
                        validStatusForCheckInOrCheckOut.includes(
                            response?.data[0]?.booking?.status,
                        )
                    ) {
                        setCanCheckout(false);
                    }
                }
            } catch (error) {
                toast.error('Một số lỗi đã xảy ra, vui lòng thử lại sau');
            }
        };
        if (id && isUpdate === false) fetchData(id);
    }, [id, isUpdate]);
    console.log({ canCheckin });
    return (
        <div className="flex flex-col gap-2.5 xl:flex-row">
            <div className="panel flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                <div className="flex flex-wrap justify-between px-4">
                    <div className="flex w-full lg:w-1/2 lg:max-w-fit">
                        <div className="mb-4 flex items-center justify-center">
                            <div className="md:h-54 md:w-54 h-40 w-40 overflow-hidden rounded-full bg-gray-300 sm:h-48 sm:w-48 lg:h-56 lg:w-56 xl:h-60 xl:w-60">
                                <img
                                    src={
                                        dataDetail[0]?.booking?.tourist?.avatar
                                    }
                                    alt="img"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="ml-10">
                            <div className="mb-4 text-lg font-bold">
                                Thông Tin Khách Hàng:
                            </div>
                            <div className="flex items-center">
                                <label
                                    htmlFor="idBookingCustomer"
                                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2 lg:w-[110px]"
                                >
                                    ID Booking:
                                </label>
                                <input
                                    id="idBookingCustomer"
                                    type="text"
                                    name="inv-num"
                                    className="form-input w-2/3 cursor-not-allowed lg:w-[280px]"
                                    // placeholder="#191829"
                                    value={id}
                                    disabled
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label
                                    htmlFor="nameCustomer"
                                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2 lg:w-[110px]"
                                >
                                    Họ Tên:
                                </label>
                                <input
                                    id="nameCustomer"
                                    type="text"
                                    name="inv-label"
                                    className="form-input w-2/3 cursor-not-allowed lg:w-[280px]"
                                    // placeholder="Phan Hải Quân"
                                    value={
                                        dataDetail[0]?.booking?.tourist
                                            ?.lastName +
                                        ' ' +
                                        dataDetail[0]?.booking?.tourist
                                            ?.firstName
                                    }
                                    disabled
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label
                                    htmlFor="phoneNumber"
                                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2 lg:w-[110px]"
                                >
                                    Số Điện Thoại:
                                </label>
                                <input
                                    id="phoneNumber"
                                    type="number"
                                    name="inv-label"
                                    className="form-input w-2/3 cursor-not-allowed lg:w-[280px]"
                                    // placeholder="0528687148"
                                    value={
                                        dataDetail[0]?.booking?.tourist
                                            ?.phoneNumber
                                    }
                                    disabled
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label
                                    htmlFor="email"
                                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2 lg:w-[110px]"
                                >
                                    Email:
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="inv-date"
                                    className="form-input w-2/3 cursor-not-allowed lg:w-[280px]"
                                    // placeholder="example@gmail.com"
                                    value={
                                        dataDetail[0]?.booking?.tourist?.email
                                    }
                                    disabled
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label
                                    htmlFor="email"
                                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2 lg:w-[110px]"
                                >
                                    Sức Chứa Tối Đa:
                                </label>
                                <input
                                    id="quantity"
                                    className="form-input w-2/3 cursor-not-allowed lg:w-[280px]"
                                    value={
                                        dataDetail[0]?.booking?.totalCapacity ??
                                        0
                                    }
                                    disabled
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label
                                    htmlFor="totalTourist"
                                    className="mb-0 flex-1 ltr:mr-2 rtl:ml-2 lg:w-[140px]"
                                >
                                    Số Người Thực Tế:
                                </label>

                                <input
                                    id="totalTourist"
                                    type="number"
                                    ref={inputRef}
                                    className={`form-input w-2/3 ${isUpdate === false && 'cursor-not-allowed'} lg:w-[280px]`}
                                    value={quantityTourist}
                                    onChange={(e) => {
                                        const numberPeopleInput = parseInt(
                                            e.target.value,
                                        );
                                        if (
                                            e.target.value &&
                                            numberPeopleInput >= 0
                                        ) {
                                            if (
                                                numberPeopleInput >
                                                dataDetail[0]?.booking
                                                    ?.totalCapacity
                                            ) {
                                                setErrorNumberPeople(
                                                    'Số người thực tế vượt quá sức chứa tối đa!',
                                                );
                                            } else {
                                                setErrorNumberPeople('');
                                            }
                                            setQuantityTourist(
                                                numberPeopleInput,
                                            );
                                        }
                                    }}
                                    disabled={isUpdate ? false : true}
                                />
                            </div>
                            {errorNumberPeople && (
                                <span className="text-base font-semibold text-red-400">
                                    * Số người thực tế vượt quá sức chứa tối đa!
                                </span>
                            )}
                            {dataDetail[0]?.booking?.status === 'DEPOSIT' && (
                                <div className="flex w-full justify-center">
                                    {isUpdate ? (
                                        <div className="flex w-full gap-2">
                                            <button
                                                className="btn btn-warning mt-2 w-full"
                                                onClick={() => {
                                                    setIsUpdate(false);
                                                    setErrorNumberPeople('');
                                                }}
                                            >
                                                <IconX className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                                Hủy Cập Nhật
                                            </button>
                                            <button
                                                className="btn btn-success mt-2 w-full"
                                                onClick={handleUpdate}
                                                disabled={
                                                    errorNumberPeople
                                                        ? true
                                                        : false
                                                }
                                            >
                                                <IconSquareCheck className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                                Cập Nhật
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn btn-primary mt-2 w-full gap-2"
                                            onClick={() => {
                                                setIsUpdate(true);
                                                if (inputRef?.current) {
                                                    inputRef.current.disabled =
                                                        false;
                                                    inputRef.current.focus();
                                                }
                                            }}
                                        >
                                            <IconPencil className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Cập Nhật Số Lượng Người Thuê
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                <div className="mt-8 px-4">
                    <div className="justify-between lg:flex-row">
                        <div className="mb-6 w-full">
                            <div className="text-lg font-bold">
                                Thông Tin Đặt Phòng:
                            </div>
                            <div className="text-center">
                                <div className="table-responsive text-center">
                                    <table className="table-hover text-center">
                                        <thead className="text-center">
                                            <tr className="text-center">
                                                <th
                                                    className="font-bold"
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    STT
                                                </th>
                                                <th
                                                    className="font-bold"
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Tên Homestay
                                                </th>
                                                <th
                                                    className="font-bold"
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Tên Phòng
                                                </th>
                                                <th
                                                    className="font-bold"
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Sức Chứa
                                                </th>
                                                <th
                                                    className="font-bold"
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Giá Phòng
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-center">
                                            {dataDetail.map((data, index) => (
                                                <tr key={data.id}>
                                                    <td
                                                        style={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {
                                                            data.room.homeStay
                                                                .name
                                                        }
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {data.room.name}
                                                    </td>
                                                    <td
                                                        className="text-center"
                                                        style={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {data.room.capacity}
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {data.price.toLocaleString(
                                                            'vi-VN',
                                                            {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            },
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
            </div>
            <div className="mt-6 w-full xl:mt-0 xl:w-96">
                <div className="panel mb-5">
                    <div className="mt-4">
                        <div>
                            <label htmlFor="shipping-charge">
                                Trạng Thái Thanh Toán
                            </label>
                            <input
                                id="shipping-charge"
                                type="number"
                                name="shipping-charge"
                                className="form-input"
                                placeholder={renderStatus(
                                    dataDetail[0]?.booking?.status,
                                )}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="shipping-charge">
                                Ngày Nhận Phòng
                            </label>
                            <input
                                id="shipping-charge"
                                type="number"
                                name="shipping-charge"
                                className="form-input"
                                placeholder={moment(
                                    dataDetail[0]?.booking?.checkInDate,
                                ).format('DD/MM/yyyy')}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="shipping-charge">
                                Ngày Trả Phòng
                            </label>
                            <input
                                id="shipping-charge"
                                type="number"
                                name="shipping-charge"
                                className="form-input"
                                placeholder={moment(
                                    dataDetail[0]?.booking?.checkOutDate,
                                ).format('DD/MM/yyyy')}
                                disabled
                            />
                        </div>
                        {dataDetail[0]?.booking?.isCheckin !== null && (
                            <div className="mt-2">
                                <label>Trạng Thái Nhận Và Trả Phòng:</label>
                                <input
                                    className="form-input"
                                    placeholder={
                                        dataDetail[0]?.booking?.isCheckin
                                            ? 'Đã Checkin'
                                            : 'Đã Checkout'
                                    }
                                    disabled
                                />
                            </div>
                        )}

                        {dataDetail[0]?.booking?.isCheckin === null && (
                            <div className="mt-2 w-full">
                                <button
                                    className="btn btn-info w-full"
                                    onClick={() => {
                                        setIsOpen(true)
                                    }}
                                    disabled={canCheckin ? false : true}
                                >
                                    Check in
                                </button>
                            </div>
                        )}
                        {dataDetail[0]?.booking?.isCheckin === true && (
                            <div className="mt-2 w-full">
                                <button
                                    className="btn btn-success w-full"
                                    onClick={() => {
                                        setIsOpen(true);
                                    }}
                                    disabled={canCheckout ? false : true}
                                >
                                    Check out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="panel">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="w-[700px] text-lg font-extrabold text-red-400">
                                {renderTextTotalPrice(
                                    dataDetail[0]?.booking?.status,
                                )}
                                :
                            </p>
                            <p className="flex items-center justify-center text-center">
                                <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                    {dataDetail[0]?.booking?.totalPrice?.toLocaleString(
                                        'vi-VN',
                                        {
                                            style: 'currency',
                                            currency: 'VND',
                                        },
                                    )}
                                </span>
                            </p>
                        </div>

                        {dataDetail[0]?.booking?.status === 'DEPOSIT' && (
                            <>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-extrabold text-red-400">
                                        Số Tiền Đã Cọc (
                                        {
                                            dataDetail[0]?.room?.homeStay
                                                ?.depositRate
                                        }
                                        %):
                                    </p>
                                    <p className="flex items-center justify-center text-center">
                                        <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                            {(
                                                dataDetail[0]?.booking
                                                    ?.totalPrice *
                                                (dataDetail[0]?.room?.homeStay
                                                    ?.depositRate === 0
                                                    ? 1
                                                    : dataDetail[0]?.room
                                                          ?.homeStay
                                                          ?.depositRate / 100)
                                            )?.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-extrabold text-red-400">
                                        Số Tiền Còn Lại:
                                    </p>
                                    <p className="flex items-center justify-center text-center">
                                        <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                            {(
                                                dataDetail[0]?.booking
                                                    ?.totalPrice -
                                                dataDetail[0]?.booking
                                                    ?.totalPrice *
                                                    (dataDetail[0]?.room
                                                        ?.homeStay
                                                        ?.depositRate === 0
                                                        ? 1
                                                        : dataDetail[0]?.room
                                                              ?.homeStay
                                                              ?.depositRate /
                                                          100)
                                            )?.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                        {dataDetail[0]?.booking?.status === 'CANCELLED' && (
                            <>
                                {dataDetailCancel?.AmountPaid > 0 ? (
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-extrabold text-red-400">
                                            Đã Thanh Toán:
                                        </p>
                                        <p className="flex items-center justify-center text-center">
                                            <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                                {dataDetailCancel?.AmountPaid?.toLocaleString(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    },
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-extrabold text-red-400">
                                            Số Tiền Đã Cọc (
                                            {
                                                dataDetail[0]?.room?.homeStay
                                                    ?.depositRate
                                            }
                                            %):
                                        </p>
                                        <p className="flex items-center justify-center text-center">
                                            <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                                {dataDetailCancel?.AmountDeposit?.toLocaleString(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    },
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-extrabold text-red-400">
                                        Phí Phạt (
                                        {
                                            dataDetail[0]?.room?.homeStay
                                                ?.penaltyRate
                                        }
                                        %):
                                    </p>
                                    <p className="flex items-center justify-center text-center">
                                        <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                            {dataDetailCancel?.AmountPenalty?.toLocaleString(
                                                'vi-VN',
                                                {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                },
                                            )}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-extrabold text-red-400">
                                        Số Tiền Đã Hoàn:
                                    </p>
                                    <p className="flex items-center justify-center text-center">
                                        <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                            {dataDetailCancel?.AmountRefund?.toLocaleString(
                                                'vi-VN',
                                                {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                },
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                        <button
                            className="btn btn-primary mt-2 w-full gap-2"
                            onClick={() => navigate('/guestlist')}
                        >
                            <IconArrowBackward className="shrink-0 ltr:mr-2 rtl:ml-2" />
                            Quay Lại
                        </button>
                    </div>
                </div>
            </div>
            {dataDetail[0]?.booking && <ModalCheckInCheckOut
             modal17={isOpen}
             setModal17={setIsOpen}
             setIsConfirm={setIsConfirm}
             isCheckin={dataDetail[0]?.booking?.isCheckin === null ? true : false}
            />}
        </div>
    );
};

export default Add;
