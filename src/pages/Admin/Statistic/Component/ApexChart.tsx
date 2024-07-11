import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import walletAPI from '../../../../util/walletAPI';
import bookingAPI from '../../../../util/bookingAPI';
import Index from '../../../Index';
import { IRootState } from '../../../../store';
import { useSelector } from 'react-redux';
import axiosClient from '../../../../util/axiosCustomize';
import { co } from '@fullcalendar/core/internal-common';
import { start } from 'repl';
import dashboardAPI from '../../../../util/dashboardAPI';
type PropsType = {
    time: { month: number; year: number };
};
interface filterObject {
    startDate: string;
    endDate: string;
}
interface Booking {
    // forEach(arg0: (record: Booking) => void): unknown;
    // forEach(arg0: (record: any) => void): unknown;
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

const TableStatistic: React.FC<PropsType> = (props) => {
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(true);
    const todayDay = new Date().toISOString().split('T')[0];
    const month = props.time.month;
    const year = props.time.year; // assuming you have year in props.time
    const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
    const endDate = moment(startDate).endOf('month')
    const labels: string[] = [];
    const endDateNumber = endDate.date(); 
    for (let i = 1; i <= endDateNumber; i++) {
        // Sử dụng hàm padStart để thêm số 0 vào phía trước nếu cần
        labels.push(String(i).padStart(2, '0'));
    }

    const TransactionAdmin = {
        transactionAdmin(filterObject2: filterObject2) {
            // Explicitly define the type of the filterObject parameter
            const url = `/Transactions?pageIndex=1&pageSize=100&type=${filterObject2.type}&startDate=${filterObject2.startDate}&endDate=${filterObject2.endDate}&status=${filterObject2.status}&paidUserId=${filterObject2.paidUserId}`;
            return axiosClient.get(url);
        },
    };
    const generateDatesInMonth = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const numDays = new Date(year, month, 0).getDate();
        const dates = [];
        for (let i = 1; i <= numDays; i++) {
            dates.push(`${year}-${month}-${i}`);
        }
        return dates;
    };
    const numberDateOfMonth = generateDatesInMonth();
    const dataGen: number[] = Array.from({
        length: numberDateOfMonth.length,
    }).map((d, index) => index + 1);
    const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
        {
            name: 'Tiền vào',
            data: [
                0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
        },
        {
            name: 'Tiền ra ',
            data: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
        },
    ]);
    useEffect(() => {
        function getDataTransactionOfDay(payload: any) {
            return new Promise(async (resolve, reject) => {
                try {
                    const startDate = moment(payload.startDate);
                    const endDate = moment(payload.endDate);
                    const days = endDate.diff(startDate, 'days') + 1;
                    const data = [];

                    for (let i = 0; i < days; i++) {
                        const day = moment(startDate)
                            .add(i, 'days')
                            .format('YYYY-MM-DD');
                        const dayPayload = { ...payload, day };
                        const dayData =
                            await walletAPI.getWalletOwnerTransaction(
                                dayPayload,
                            );
                        data.push(dayData);
                    }
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        }
        function getDataTransactionOfDay2(payload: any) {
            return new Promise(async (resolve, reject) => {
                try {
                    const startDate = moment(payload.startDate);
                    const endDate = moment(payload.endDate);
                    const days = endDate.diff(startDate, 'days') + 1;
                    const data = [];

                    for (let i = 0; i < days; i++) {
                        const day = moment(startDate)
                            .add(i, 'days')
                            .format('YYYY-MM-DD');
                        const dayPayload = { ...payload, day };
                        const dayData =
                            await TransactionAdmin.transactionAdmin(
                                dayPayload,
                            );
                        data.push(dayData);
                    }
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        }
        const fetchDataChartProfit = async () => {
            const month = props.time.month;
            const year = props.time.year; // assuming you have year in props.time
            const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
            const endDate = moment(startDate).endOf('month');
            const days = endDate.diff(startDate, 'days') + 1;

            try {
                const requests = Array.from({ length: days }).map(
                    (_, index) => {
                        const day = moment(startDate)
                            .add(index, 'days')
                            .format('YYYY-MM-DD');
                        let filterObject2 = {
                            startDate: day,
                            endDate: day,
                            status: 'SUCCESS',
                            paidUserId: '40bbd18f-cebd-4685-b8d4-62d5e7c44fce',
                        };
                        setLoading2(true);
                        return getDataTransactionOfDay(filterObject2);
                    },
                );
                const requests2= Array.from({ length: days }).map(
                    (_, index) => {
                        const day = moment(startDate)
                            .add(index, 'days')
                            .format('YYYY-MM-DD');
                        let filterObject = {
                            startDate: day,
                            endDate: day,
                            type: 'PAID&type=TOURIST_CANCELLED_BOOKING',
                            status: 'SUCCESS',
                            paidUserId: '40bbd18f-cebd-4685-b8d4-62d5e7c44fce',
                        };
                        setLoading2(true);
                        return getDataTransactionOfDay2(filterObject);
                    },
                );
                const requests3= Array.from({ length: days }).map(
                    (_, index) => {
                        const day = moment(startDate)
                            .add(index, 'days')
                            .format('YYYY-MM-DD');
                        let filterObject = {
                            startDate: day,
                            endDate: day,
                            type: 'REFUND',
                            status: 'SUCCESS',
                            paidUserId: '40bbd18f-cebd-4685-b8d4-62d5e7c44fce',
                        };
                        setLoading2(true);
                        return getDataTransactionOfDay2(filterObject);
                    },
                );

                const responses = await Promise.all(requests);
                const responses2 = await Promise.all(requests2);
                const responses3 = await Promise.all(requests3);


                const arrayDataTotalPriceOfEachDay = responses?.map(
                    (res: any) => {
                        let totalPrice = 0;
                        res[0]?.data?.map((day: any) => {
                            if (day?.price) {
                                totalPrice = totalPrice + day?.price;
                            }
                            return true;
                        });
                        return totalPrice;
                    },
                );
                const arrayDataTotalPriceOfEachDay2 = responses2?.map(
                    (res: any) => {
                        let totalPrice = 0;
                        res[0]?.data?.map((day: any) => {
                            if (day?.price) {
                                totalPrice = totalPrice + day?.price;
                            }
                            return true;
                        });
                        return totalPrice;
                    },
                );
                const arrayDataTotalPriceOfEachDay3 = responses3?.map(
                    (res: any) => {
                        let totalPrice = 0;
                        res[0]?.data?.map((day: any) => {
                            if (day?.price) {
                                totalPrice = totalPrice + day?.price;
                            }
                            return true;
                        });
                        return totalPrice;
                    },
                );
                setSeries([
                    {
                        name: 'Tiền vào',
                        data: arrayDataTotalPriceOfEachDay,
                    },
                    {
                        name: 'Tiền thanh toán cho Chủ Homestay',
                        data: arrayDataTotalPriceOfEachDay2,
                    },
                    {
                        name: 'Hoàn tiền',
                        data: arrayDataTotalPriceOfEachDay3,
                    },
                ]);
                setLoading2(false);
            } catch (error) {
                console.log({ error });
            }
        };
        fetchDataChartProfit();
    }, [props]);
    const [recordsData, setRecordsData] = useState<Booking[] | []>([]);
    // const [filterObject, setFilterObject] = useState<filterObject>({
    //     startDate: startDate.format('YYYY-MM-DD'),
    //     endDate: endDate.format('YYYY-MM-DD'),
    // });
    const [recordsDataBookingStatus, setRecordsDataBookingStatus] = useState<bookingObject[]>([]);


    useEffect(() => {
        const fetchDataReport = async () => {
            try {
                setLoading(true);
                const response =
                    await bookingAPI.getReportBooking(
                        {
                            startDate: startDate.format('YYYY-MM-DD'), 
                            endDate: endDate.format('YYYY-MM-DD'),
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

        if (props) {
            // fetchDataChartProfit();
            fetchDataReport();
        }
    }, [props]);

    let orderCounts = {
        complete: 0,
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
                case 'COMPLETED':
                    orderCounts.complete += 1;
                    break;
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
                    break;
                case 'PAYMENT SETTLEMENT':
                    orderCounts.paymentSett += 1;
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
    let priceDebit = 0;
    if (recordsData) {
        recordsData.forEach((record) => {
            record.transactions.forEach((transaction) => {
                if (record.status === 'DEPOSIT') {
                    let priceDebitRecord = 0;
                    if (transaction.status === 'SUCCESS') {
                        if (
                            transaction.type === 'PAID_WITH_WALLET' ||
                            transaction.type === 'PAID_WITH_CASH' ||
                            transaction.type === 'PAID_WITH_VNPAY'
                        ) {
                            priceDebitRecord += transaction.price;
  
                        } else if (
                            transaction.type === 'PAID' ||
                            transaction.type === 'REFUND'
                        ) {
                            priceDebitRecord -= transaction.price;
                        }
                    }
                    priceDebit =
                        priceDebit + (record.totalPrice - priceDebitRecord);
                    priceDebitRecord = 0;
                }
            });
        });
    }
    const isDark = useSelector(
        (state: IRootState) =>
            state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
    );
    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;
    const revenueChart: any = {
        series: series,
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
                colors: ['#00d492', '#2196F3', '#f4970a'],
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#00d492','#2196F3', '#E7515A'] : ['#00d492', '#2196F3', '#f4970a'],

            labels: Array.from({ length: 31 }).map(
                (_, index) => `Ngày ${index + 1}`,
            ),
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                    categories: labels,
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K VNĐ';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };
    let priceRefund = 0;
    if (recordsData) {
        recordsData.forEach((record) => {
            record.transactions.forEach((transaction) => {
                if (record.status === 'REFUND' || record.status === 'CANCELLED') {
                    if (transaction.status === 'SUCCESS') {
                        if (transaction.type === 'REFUND') {
                            priceRefund += transaction.price;
                        }
                    }
                }
            });
        });
    }
    let priceFail = 0;
    if (recordsData) {
        recordsData.forEach((record) => {
            record.transactions.forEach((transaction) => {
                if (record.status === 'CANCELLED') {
                    priceFail += record.totalPrice;
                }
            });
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
    let pricePaidOwner = 0;
    if (recordsData) {
        recordsData.forEach((record) => {
            record.transactions.forEach((transaction) => {
                    if (transaction.status === 'SUCCESS') {
                        if (transaction.type === 'PAID' || transaction.type === 'TOURIST_CANCELLED_BOOKING') {
                            pricePaidOwner += transaction.price;
                        }
                    }
            });
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
    return (
        <div>
            {loading ? (
                <div className="text-center">
                    <span className="m-auto mb-10 inline-block h-14 w-14 animate-spin rounded-full border-8 border-[#f1f2f3] border-l-primary align-middle"></span>
                </div>
            ) : (
                <div className="app">
                    <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                        {/*  Time On-Site */}
                        <div className="panel h-[160px] bg-gradient-to-r from-blue-500 to-blue-400">
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
                        <div className="panel h-[160px] bg-gradient-to-r from-emerald-500 to-emerald-400">
                            <div className="flex justify-between">
                                <div className="text-xl font-bold ltr:mr-1 rtl:ml-1">
                                    Tổng đơn đặt phòng thành công
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                    {' '}
                                    {(orderCounts.paid + orderCounts.deposit + orderCounts.paymentSett )}{' '}
                                </div>
                            </div>
                        </div>
                        <div className="panel h-[160px] bg-gradient-to-r from-gray-500 to-gray-400">
                            <div className="flex justify-between">
                                <div className="text-xl font-bold ltr:mr-1 rtl:ml-1">
                                    Tổng đơn đặt phòng đã hủy - hoàn tiền 
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                    {' '}
                                    {(orderCounts.cancelled + orderCounts.refund)}{' '}
                                </div>
                            </div>
                        </div>

                        <div className="panel h-[160px] bg-gradient-to-r from-rose-500 to-rose-300">
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
                                {/* <div className="badge bg-white/30">+ 2.35% </div> */}
                            </div>
                        </div>
                         {/* Sessions */}
                        <div className="panel h-[160px] bg-gradient-to-r from-amber-500 to-amber-400">
                            <div className="flex justify-between">
                                <div className="text-xl font-bold ltr:mr-1 rtl:ml-1">
                                    Tổng doanh thu
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                    {' '}
                                    {(totalPrice*0.05).toLocaleString(
                                            'vi-VN',
                                            {
                                                style: 'currency',
                                                currency: 'VND',
                                            },
                                        )}
                                </div>
                                {/* <div className="badge bg-white/30">- 2.35% </div> */}
                            </div>
                        </div>

                        <div className="panel h-[160px] bg-gradient-to-r from-cyan-500 to-cyan-400">
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
                          {/* Bounce Rate */}
                        <div className="panel h-[160px] bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                            <div className="flex justify-between">
                                <div className="text-xl font-bold ltr:mr-1 rtl:ml-1">
                                    Tiền đã thanh toán cho chủ Homestay
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                    {' '}
                                    {pricePaidOwner.toLocaleString(
                                            'vi-VN',
                                            {
                                                style: 'currency',
                                                currency: 'VND',
                                            },
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="panel h-[160px] bg-gradient-to-r from-orange-600 to-orange-400">
                            <div className="flex justify-between">
                                <div className="text-xl font-bold ltr:mr-1 rtl:ml-1">
                                    Tiền hoàn cho khách hàng
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                    {' '}
                                    {priceRefund.toLocaleString(
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

                    </div>
                    {loading2 ? (
                        <div className="text-center">
                            <span className="m-auto mb-10 inline-block h-14 w-14 animate-spin rounded-full border-8 border-[#f1f2f3] border-l-primary align-middle"></span>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="mb-4 text-lg font-bold">
                                Biểu đồ thống kê
                            </div>
                            <div
                                className="overflow-hidden rounded-lg bg-white p-5 dark:bg-black "
                                id="chart"
                            >
                                <ReactApexChart
                                    // options={options}
                                    series={revenueChart.series}
                                    options={revenueChart.options}
                                    type="area"
                                    height={500}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TableStatistic;
