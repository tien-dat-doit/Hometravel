import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import IconX from '../../../components/Icon/IconX';
import { setPageTitle } from '../../../store/themeConfigSlice';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'tippy.js/dist/tippy.css';
import IconArrowBackward from '../../../components/Icon/IconArrowBackward';
import IconPencil from '../../../components/Icon/IconPencil';
import IconSquareCheck from '../../../components/Icon/IconSquareCheck';
import bookingAPI from '../../../util/bookingAPI';
import walletAPI from '../../../util/walletAPI';
import TableTransactionOwner from './Component/TableTransaction';
import { s } from '@fullcalendar/core/internal-common';
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
        bookingDetails: {
            room: {
                homeStay: {
                    id: string;
                };
            };
        };
    };
}
interface TransactionObject {
    id: string;
    price: number;
    status: string;
    type: string;
    createdDate: string;
    bookingId: string;
    walletId: string;
    paidUserId: string;
    admin: {
        id: string;
        username: string;
    };
    tourist: {
        id: string;
        phoneNumber: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        gender: boolean;
        dateOfBirth: string;
        status: string;
    };
    owner: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        phoneNumber: string;
        status: string;
    };
    wallet: {
        id: string;
        balance: 0;
        ownerId: string;
        touristId: string;
        adminId: string;
        owner: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string;
            phoneNumber: string;
            status: string;
        };
        tourist: {
            id: string;
            phoneNumber: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string;
            gender: boolean;
            dateOfBirth: string;
            status: string;
        };
    };
}
const Add = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isUpdate, setIsUpdate] = useState(false);
    const { id } = useParams();
    const [quantityTourist, setQuantityTourist] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);

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
            case 'COMPLETE':
                return 'Đã Hoàn Thành';
            case 'PAYMENT SETTLEMENT':
                return 'Đang Giải Quyết Thanh Toán';
            case 'EXPIRED':
                return 'Hết hạn thanh toán';
            default:
                return 'Chưa Xác Định';
        }
    };
    const [dataDetail, setDataDetail] = useState<bookingDetailObject[] | []>(
        [],
    );
    const [recordsData, setRecordsData] = useState<TransactionObject[] | []>(
        [],
    );
    useEffect(() => {
        const fetchData = async (id: string) => {
            try {
                const response = await bookingAPI.getDetail(id);
                const responseTransaction =
                    await walletAPI.getWalletOwnerTransaction({
                        bookingId: id,
                    });
                setRecordsData(responseTransaction.data ?? []);
                setDataDetail(response.data ?? []);
                setQuantityTourist(
                    response?.data[0]?.booking?.actualQuantityTourist ?? 0,
                );
            } catch (error) {
                toast.error('Một số lỗi đã xảy ra, vui lòng thử lại sau');
            }
        };
        if (id && isUpdate === false) fetchData(id);
    }, [id, isUpdate]);
    console.log('dataDetail[0]?.booking?.status', recordsData);
    let priceRefund = 0;
    let pricePaid = 0;
    let pricePhat = 0;

    if (dataDetail[0]?.booking?.status === 'REFUND') {
        if (recordsData) {
            recordsData.forEach((record) => {
                if (record.status === 'SUCCESS' && record.type === 'REFUND') {
                    priceRefund += record.price;
                }
                if (
                    record.status === 'SUCCESS' &&
                    (record.type === 'PAID_WITH_WALLET' ||
                        record.type === 'PAID_WITH_VNPAY')
                ) {
                    pricePaid += record.price;
                }
                if (
                    record.status === 'SUCCESS' &&
                    (record.type === 'TOURIST_CANCELLED_BOOKING')
                ) {
                    pricePhat += record.price;
                }
            });
        }
    }
    if (dataDetail[0]?.booking?.status === 'CANCELLED') {
        if (recordsData) {
            recordsData.forEach((record) => {
                if (record.status === 'SUCCESS' &&  record.type === 'REFUND') {
                    priceRefund += record.price;
                }
                if (record.status === 'SUCCESS' &&  record.type === 'TOURIST_CANCELLED_BOOKING') {
                    pricePhat += record.price;
                }
                if (
                    record.status === 'SUCCESS' &&
                    (record.type === 'PAID_WITH_WALLET' ||
                        record.type === 'PAID_WITH_VNPAY')
                ) {
                    pricePaid += record.price;
                }
            });
        }
    }
    return (
        <div className="flex flex-col gap-2.5 xl:flex-row">
            <div className="panel flex-1 px-0 py-6 lg:w-2/3  ltr:xl:mr-6 rtl:xl:ml-6">
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
                                    Sức chứa tối đa:
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
                                        if (
                                            e.target.value &&
                                            parseInt(e.target.value) >= 0
                                        ) {
                                            setQuantityTourist(
                                                parseInt(e.target.value),
                                            );
                                        }
                                    }}
                                    disabled={isUpdate ? false : true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                <div className="mt-8 px-4">
                    <div className="justify-between lg:flex-row">
                        <div className=" w-full">
                            <div className="mb-6 text-lg font-bold">
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
                                            {dataDetail.map(
                                                (data, index) => (
                                                    console.log('data', data),
                                                    (
                                                        <tr key={data.id}>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                {/* <Link to={`/managehomestay/${data.booking.bookingDetails.room.homeStay.id}`}> */}
                                                                {
                                                                    data.room
                                                                        .homeStay
                                                                        .name
                                                                }
                                                                {/* </Link> */}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                {data.room.name}
                                                            </td>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                {
                                                                    data.room
                                                                        .capacity
                                                                }
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                {data.price.toLocaleString(
                                                                    'vi-VN',
                                                                    {
                                                                        style: 'currency',
                                                                        currency:
                                                                            'VND',
                                                                    },
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                <div className="mt-8 px-4">
                    <TableTransactionOwner bookingId={id || ''} />
                </div>
            </div>
            <div className="mt-6 w-full lg:w-1/3  xl:mt-0 xl:w-96">
                <div className="panel mb-5">
                    <div className="mt-4">
                        <div>
                            <label htmlFor="shipping-charge">Trạng Thái</label>
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
                    </div>
                </div>
                <div className="panel">
                    {dataDetail[0]?.booking?.status === 'PAID' && (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền đã nhận:
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
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền chưa nhận:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        0 ₫
                                    </span>
                                </p>
                            </div>
                            <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Tổng giá tiền:
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
                        </>
                    )}
                    {dataDetail[0]?.booking?.status === 'PENDING' && (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền đã nhận:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        0 ₫
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền chưa nhận:
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
                            <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Tổng giá tiền:
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
                        </>
                    )}
                    {dataDetail[0]?.booking?.status === 'DEPOSIT' && (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền đã nhận:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {(
                                            dataDetail[0]?.booking?.totalPrice *
                                            (dataDetail[0]?.room?.homeStay
                                                ?.depositRate === 0
                                                ? 1
                                                : dataDetail[0]?.room?.homeStay
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
                                    % Cọc:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {
                                            dataDetail[0]?.room?.homeStay
                                                ?.depositRate
                                        }{' '}
                                        %
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền chưa nhận:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {(
                                            dataDetail[0]?.booking?.totalPrice -
                                            dataDetail[0]?.booking?.totalPrice *
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
                            <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Tổng giá tiền:
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
                        </>
                    )}
                    {dataDetail[0]?.booking?.status === 'CANCELLED' && (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền đã nhận:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {pricePaid.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền phạt:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {pricePhat.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền đã hoàn:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {priceRefund.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </span>
                                </p>
                            </div>
                            <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Tổng giá tiền:
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
                        </>
                    )}
                    {dataDetail[0]?.booking?.status === 'REFUND' && (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền đã nhận :
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {pricePaid.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền đã hoàn:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {priceRefund.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </span>
                                </p>
                            </div>

                            <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Tổng giá tiền:
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
                        </>
                    )}
                    {dataDetail[0]?.booking?.status ===
                        'PAYMENT SETTLEMENT' && (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền đã nhận:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {(
                                            dataDetail[0]?.booking?.totalPrice *
                                            (dataDetail[0]?.room?.homeStay
                                                ?.depositRate === 0
                                                ? 1
                                                : dataDetail[0]?.room?.homeStay
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
                                    % Cọc:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {
                                            dataDetail[0]?.room?.homeStay
                                                ?.depositRate
                                        }{' '}
                                        %
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Số tiền chưa nhận:
                                </p>
                                <p className="flex items-center justify-center text-center">
                                    <span className="items-center justify-center text-center text-2xl font-bold text-gray-800">
                                        {(
                                            dataDetail[0]?.booking?.totalPrice -
                                            dataDetail[0]?.booking?.totalPrice *
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
                            <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-red-400">
                                    Tổng giá tiền:
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Add;
