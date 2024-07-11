import { useEffect, useState } from 'react';
import bookingAPI from '../../../util/bookingAPI';
import { Link } from 'react-router-dom';                
import dashboardAPI from '../../../util/dashboardAPI';
type PropsType = {
    time: { month: number; year: number };
};
interface filterObject {
    startDate: string;
    endDate: string;
}
interface Booking {
    id: string;
    totalPrice: number;
    amountOwnerReceiver: number;
    totalCapacity: number;
    actualQuantityTourist: number;
    checkInDate: string;
    checkOutDate: string;
    status: string;
    createdDate: string;
    touristId: string;
    transactions: Transaction[];
}
interface bookingObject {
    id: string;
    totalPrice: number;
    checkInDate: string | null;
    checkOutDate: string | null;
    status: string;
    createdDate: string;
    touristId: string;
    bookingDetails: [
        {
            bookingId :string;
            price: string;
        },
    ];
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
}
interface Transaction {
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
        password: string;
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
        contractFile: string;
    };
}
interface filterObject2 {
    pageSize: number;
    pageIndex: number;
    startDate: string | null;
    endDate: string | null;
    walletId: string | null;
    paidUserId: string | null;
    status: string | null;
    type: string | null;
}

const TableDashboard = () => {
    const [loading, setLoading] = useState(false);
    const todayDay = new Date().toISOString().split('T')[0];
    const [recordsData, setRecordsData] = useState<Booking[] | []>([]);
    const [recordsDataBookingStatus, setRecordsDataBookingStatus] = useState<bookingObject[]>([]);
    useEffect(() => {
        const fetchDataReport = async () => {
            try {
                setLoading(true);
                const response =
                    await bookingAPI.getReportBooking(
                        {
                            startDate: todayDay, 
                            endDate: todayDay,
                        }
                    );
                setRecordsData(response.data ?? []);
                console.log('response', response.data);

                setLoading(false);
            } catch (error) {
                console.log('error', error);
            }
        };
        const fetchAllBookingByEachStatus = async () => {
            try {  
                const response = await dashboardAPI.getAllBookingByStatusAdmin({date : todayDay})              
                setRecordsDataBookingStatus(response.data ?? []); 
            } catch (error) {
                console.log({ error });
            }
        };
        fetchAllBookingByEachStatus();
        fetchDataReport();
    }, []);

    let orderCounts = {
        paid: 0,
        deposit: 0,
        refund: 0,
        pending: 0,
        cancelled: 0,
        paymentSett: 0,
    };
    if (recordsData) {
        recordsData.forEach((record) => {
            switch (record.status) {
                case 'PAID':
                    orderCounts.paid += 1;
                    break;
                case 'DEPOSIT':
                    orderCounts.deposit += 1;
                    break;
                case 'REFUND':
                    orderCounts.refund += 1;
                    break;
                case 'PENDING':
                    orderCounts.pending += 1;
                    break;
                case 'CANCELLED':
                    orderCounts.cancelled += 1;
                    break;
                case 'EXPIRED':
                    orderCounts.cancelled += 1;
                case 'PAYMENT SETTLEMENT':
                    orderCounts.paymentSett += 1;
                    break;
                default:
                    break;
            }
        });
    }
    let orderCountsStatus = {
        paid: 0,
        deposit: 0,
        pending: 0,
        cancelled: 0,
        refund: 0,
        expired: 0,
        paymentSett: 0,
    };
    if (recordsDataBookingStatus) {
        recordsDataBookingStatus.forEach((record) => {
            switch (record.status) {
                case 'PAID':
                    orderCountsStatus.paid += 1;
                    break;
                case 'DEPOSIT':
                    orderCountsStatus.deposit += 1;
                    break;
                case 'PENDING':
                    orderCountsStatus.pending += 1;
                    break;
                case 'CANCELLED':
                    orderCountsStatus.cancelled += 1;
                    break;
                case 'REFUND':
                    orderCountsStatus.refund += 1;
                    break;
                case 'EXPIRED':
                    orderCountsStatus.expired += 1;
                    break;
                case 'PAYMENT SETTLEMENT':
                    orderCountsStatus.paymentSett += 1;
                    break;
                default:
                    break;
            }
        });
    }
    let totalPrice = 0;
    if (recordsData) {
        recordsData.forEach((record) => {
            if (record.status !== 'CANCELLED' && record.status !== 'REFUND' && record.status !== 'EXPIRED') {
                totalPrice += record.totalPrice;
            }
        });
    }
    let priceAvenue = 0;
    if (recordsData) {
        recordsData.forEach((record) => {
            if (record.status !== 'CANCELLED' && record.status !== 'REFUND') {
                record.transactions.forEach((transaction) => {
                    if (transaction.status === 'SUCCESS') {
                        if (
                            transaction.type === 'PAID_WITH_WALLET' ||
                            transaction.type === 'PAID_WITH_CASH' ||
                            transaction.type === 'PAID_WITH_VNPAY'
                        ) {
                            priceAvenue += transaction.price;
                        } else if (
                            transaction.type === 'PAID' ||
                            transaction.type === 'REFUND'
                        ) {
                            priceAvenue -= transaction.price;
                        }
                    }
                });
            }
        });
    }
  

    return (
        <div>
            {loading ? (
                <div className="text-center">
                    <span className="m-auto mb-10 inline-block h-14 w-14 animate-spin rounded-full border-8 border-[#f1f2f3] border-l-primary align-middle"></span>
                </div>
            ) : (
                <div className="app">
                    <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                        {/*  Time On-Site bao gồm đã thanh toán k tính hết hạn*/}
                        <Link to="/managebooking">
                        <div className="panel h-[150px] bg-gradient-to-r from-blue-500 to-blue-400">
                            <div className="flex justify-between">
                                <div className="text-xl font-bold ltr:mr-1 rtl:ml-1">
                                    Tổng đơn đặt phòng
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                    {' '}
                                    {recordsData.length}{' '}
                                </div>
                            </div>
                        </div>
                        </Link>
                         {/*  trừ đi cancel và refund*/}
                        <Link to="/managebooking">
                        <div className="panel h-[150px] bg-gradient-to-r from-emerald-500 to-emerald-400">
                            <div className="flex justify-between">
                                <div className="text-xl font-bold ltr:mr-1 rtl:ml-1">
                                    Tổng đơn đặt phòng thành công
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                    {' '}
                                    {(orderCounts.paid + orderCounts.deposit + orderCounts.paymentSett)}{' '}
                                </div>
                            </div>
                        </div></Link>
                        <Link to="/managebooking">
                        <div className="panel h-[150px] bg-gradient-to-r from-rose-500 to-rose-400">
                            <div className="flex justify-between">
                                <div className="text-xl font-bold ltr:mr-1 rtl:ml-1">
                                    Tổng tiền đặt phòng 
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                    {' '}
                                    {totalPrice.toLocaleString(
                                            'vi-VN',
                                            {
                                                style: 'currency',
                                                currency: 'VND',
                                            },
                                        )}
                                </div>
                            </div>
                        </div></Link>
                        <Link to="/managebooking">
                        <div className="panel h-[150px] bg-gradient-to-r from-cyan-500 to-cyan-400">
                            <div className="flex justify-between">
                                <div className="text-xl font-bold ltr:mr-1 rtl:ml-1">
                                    Tiền đã nhận từ khách hàng
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                    {' '}
                                    {priceAvenue.toLocaleString(
                                            'vi-VN',
                                            {
                                                style: 'currency',
                                                currency: 'VND',
                                            },
                                        )}
                                </div>
                                {/* <div className="badge bg-white/30">+ 2.35% </div> */}
                            </div>
                        </div>
                        </Link>

                    </div>
                </div>
            )}
        </div>
    );
};

export default TableDashboard;
