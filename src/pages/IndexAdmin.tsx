import moment from 'moment';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { Rating } from 'react-simple-star-rating';
import useAuth from '../hook/useAuth';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import bookingAPI from '../util/bookingAPI';
import dashboardAPI from '../util/dashboardAPI';
import homestayAPI from '../util/homestayAPI';
import TableDashboard from '../pages/Admin/Dashboard/ApexChart'
import { ex } from '@fullcalendar/core/internal-common';
import { serialize } from 'v8';
import { stat } from 'fs';
interface filterHomestayObject {
    pageIndex: number;
    pageSize: number;
    name: string;
    ownerId: string;
    status: string[];
}
interface homeStay {
    id: string;
    name: string;
    createdDate: string;
    status: string;
}
interface homestayObjectRevenue {
    id: string;
    name: string;
    rating: number;
    totalRevenue: number;
    totalRoom: number;
    images: [
        {
            id: string;
            url: string;
        },
    ];
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
const IndexAdmin = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Trang Chủ'));
    });
    const [loading2, setLoading2] = useState(true);
    const isDark = useSelector(
        (state: IRootState) =>
            state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
    );
    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;
    const handleRowClick = (bookingId: string) => {
                window.location.href = `/detailbooking/${bookingId}`;
            };
    const handleRowClick2 = (bookingId: string) => {
            window.location.href = `/managehomestay/${bookingId}`;
    };
    const todayDay = new Date().toISOString().split('T')[0];
    const [loading] = useState(false);
    const { auth }: any = useAuth();
    const [filterHomestayObject, setFilterHomestayObject] =
        useState<filterHomestayObject>({
            pageIndex: 1,
            pageSize: 100,
            name: '',
            ownerId: auth?.user?.id,
            status: ['ACTIVE'],
        });
    const [recordsHomestayData, setRecordsHomestayData] = useState<
        homeStay[] | []
    >([]);
    useEffect(() => {
        const fetchListHomestay = async () => {
            try {
                const response: any =
                    await homestayAPI.getAll(filterHomestayObject);
                setRecordsHomestayData(response.data ?? []);
                setSelectedHomestay(response?.data[0]);
            } catch (error) {
                console.log('Error in get all homestay', error);
            }
        };
        fetchListHomestay();
    }, []);
    const [searchResultsHomestay, setSearchResultsHomestay] = useState<
        homeStay[]
    >([]);
    const [listTop10Homestay, setListTop10Homestay] = useState<
        homestayObjectRevenue[]
    >([]);
    const [listRecentBooking, setListRecentBooking] = useState<bookingObject[]>(
        [],
    );
    const [selectedHomestay, setSelectedHomestay] = useState<homeStay>({
        id: '',
        name: '',
        createdDate: '',
        status: '',
    });
    const [dataRevenue, setDataRevenue] = useState<number[]>([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    const [dataForChartHomestayWithStatus, setDataForChartHomestayWithStatus] =
        useState([1, 2, 3, 4, 5, 6, 7]);
    const [dataForChartBookingWithStatus, setDataForChartBookingWithStatus] =
        useState([1, 2, 3, 4, 5]);
        
    const [recordsDataBookingStatus, setRecordsDataBookingStatus] = useState<bookingObject[]>([]);

    useEffect(() => {
        const fetchAllHomestayByEachStatus = async () => {
            try {
                const response = await dashboardAPI.getAllHomestayByStatusAdmin();
                const numberArray = [];
                if (response.data) {
                    for (const key in response.data) {
                        if (typeof response.data[key] === 'number') {
                            numberArray.push(response.data[key]);
                        }
                    }
                }
                setDataForChartHomestayWithStatus(
                    numberArray || [1, 2, 3, 4, 5, 6, 7],
                );
            } catch (error) {
                console.log({ error });
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
        const fetchTop10Homestay = async () => {
            try {
                const response = await dashboardAPI.getTop10HomestayAdmin();
                setListTop10Homestay(response?.data || []);
            } catch (error) {
                console.log({ error });
            }
        };
        const fetchListBookingForOwner = async () => {
            try {
                const response: any = await bookingAPI.getAllBooking(
                    {
                        pageIndex: 1,
                        pageSize: 5,
                        sortKey: 'CreatedDate',
                        sortOrder: 'DESC',
                        status: ['PAID', 'DEPOSIT', 'PENDING', 'CANCELLED', 'REFUND', 'PAYMENT SETTLEMENT'],
                    },
                );
                setListRecentBooking(response.data ?? []);
            } catch (error) {
                console.log('error', error);
            }
        };
        fetchListBookingForOwner();
        fetchTop10Homestay();
        fetchAllHomestayByEachStatus();
        fetchAllBookingByEachStatus();
    }, []);
    const renderStatus = (status: string) => {
        switch (status) {
            case 'PAID':
                return { name: 'Thanh Toán Hoàn Tất', color: '#38761d' };
            case 'DEPOSIT':
                return { name: 'Đã Thanh Toán Cọc', color: '#0047bb' };
            case 'CANCELLED':
                return { name: 'Đã Bị Hủy', color: '#EA1365' };
            case 'REFUND':
                return { name: 'Đã Hoàn Tiền', color: '#f1c232' };
            case 'PENDING':
                return { name: 'Chờ Thanh Toán', color: '#b45f06' };
            case 'COMPLETED':
                return { name: 'Đã Hoàn Thành', color: '#515ae2' };
            case 'PAYMENT SETTLEMENT':
                return { name: 'Đang Giải Quyết Thanh Toán', color: '#073763' };
            case 'EXPIRED':
                return { name: 'Hết hạn thanh toán', color: '#a855f7' };
            default:
                return { name: 'Chưa Xác Định', color: '#EA1365' };
        }
    };
    useEffect(() => {
        const orderBookingStatus = {
            paid: 0,
            deposit: 0,
            pending: 0,
            cancelled: 0,
            refund: 0,
            // expired: 0,
            // paymentSett: 0,
        };
        if (recordsDataBookingStatus) {
            recordsDataBookingStatus.forEach((record) => {
                switch (record.status) {
                    case 'PAID':
                        orderBookingStatus.paid += 1;
                        break;
                    case 'DEPOSIT':
                        orderBookingStatus.deposit += 1;
                        break;
                    case 'PENDING':
                        orderBookingStatus.pending += 1;
                        break;
                    case 'CANCELLED':
                        orderBookingStatus.cancelled += 1;
                        break;
                    case 'REFUND':
                        orderBookingStatus.refund += 1;
                        break;
                    // case 'EXPIRED':
                    //     orderBookingStatus.expired += 1;
                    //     break;
                    // case 'PAYMENT SETTLEMENT':
                    //     orderBookingStatus.paymentSett += 1;
                    //     break;
                    default:
                        break;
                }
            });
            console.log('orderBookingStatus', orderBookingStatus);
        }
        const dataArray = Object.values(orderBookingStatus);
        console.log('dataArray', orderBookingStatus);
        setDataForChartBookingWithStatus(dataArray);
        setLoading2(false);
    }, [recordsDataBookingStatus]); 

    const statisticHomestay: any = {
        series: dataForChartHomestayWithStatus,
        options: {
            chart: {
                type: 'donut',
                height: 550,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 20,
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                offsetY: 20,
                height: 100,
            },
            colors: isDark
                ? [
                      '#004225',
                      '#002FA7',
                      '#E30B5C',
                      '#000000',
                      '#B8860B',
                      '#CB410B',
                      '#880e4f'
                  ]
                : [
                      '#004225',
                      '#002FA7',
                      '#E30B5C',
                      '#000000',
                      '#B8860B',
                      '#CB410B',
                      '#880e4f'
                  ],
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '16px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '16px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Tổng Số',
                                color: '#888ea8',
                                fontSize: '18px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(
                                        function (a: any, b: any) {
                                            return a + b;
                                        },
                                        0,
                                    );
                                },
                            },
                        },
                    },
                },
            },
            labels: [
                'HOẠT ĐỘNG',
                'TẠM NGƯNG HOẠT ĐỘNG',
                'NGƯNG HOẠT ĐỘNG',
                'ĐANG CHỜ KIỂM DUYỆT',
                'ĐÃ BỊ HỦY',
                'NGƯNG KIỂM DUYỆT',
                "VÔ HIỆU HÓA"
            ],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    const statisticBooking: any = {
        series: dataForChartBookingWithStatus,
        
        options: {
            chart: {
                type: 'donut',
                height: 550,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 20,
                //colors: isDark ? '#0e1726' : '#fff',
            },

            colors: isDark
                ? [
                      '#004225',
                      '#E48400',
                      '#002FA7',
                      '#E30B5C',
                      '#CB410B',
                      '#a855f7',
                      '#8B004B',
                  ]
                : [
                      '#004225',
                      '#E48400',
                      '#002FA7',
                      '#E30B5C',
                      '#CB410B',
                      '#a855f7',
                      '#8B004B',
                  ],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 100,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '16px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '16px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Tổng Số',
                                color: '#888ea8',
                                fontSize: '16px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(
                                        function (a: any, b: any) {
                                            return a + b;
                                        },
                                        0,
                                    );
                                },
                            },
                        },
                    },
                },
            },
            labels: [
                'HOÀN TẤT THANH TOÁN',
                'HOÀN TẤT TIỀN CỌC',
                'ĐANG CHỜ THANH TOÁN',
                'KHÁCH ĐÃ HỦY',
                'HOÀN TIỀN',
                // 'HẾT HẠN THANH TOÁN',
                // 'ĐANG GIẢI QUYẾT THANH TOÁN',
            ],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    return (
        <div>
            <div className="pt-5">
                <div className="mb-6  gap-6 ">
                    <div className="panel h-full xl:col-span-2">
                        <div className="mb-5 items-center justify-between dark:text-white-light">
                            <h5 className="text-lg font-semibold pb-5">
                                Cập Nhật Hôm Nay
                            </h5>
                            <TableDashboard></TableDashboard>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="panel h-full">
                            <div className="mb-5 flex items-center">
                                <h5 className="text-lg font-semibold dark:text-white-light">
                                    Thống Kê Đặt Phòng Hôm Nay
                                </h5>
                            </div>
                            <div className="pb-5">
                                <div className=" rounded-lg bg-white dark:bg-black">
                                    {loading2 ? (
                                        <div className="text-center">
                                            <span className="m-auto mb-10 inline-block h-14 w-14 animate-spin rounded-full border-8 border-[#f1f2f3] border-l-primary align-middle"></span>
                                        </div>
                                    ) : (
                                        <ReactApexChart
                                            series={statisticBooking.series}
                                            options={statisticBooking.options}
                                            type="donut"
                                            height={400}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* chart donus 2 */}
                        <div className="panel h-full">
                            <div className="mb-5 flex items-center">
                                <h5 className="text-lg font-semibold dark:text-white-light">
                                    Thống Kê Homestay 
                                </h5>
                            </div>
                            <div>
                                <div className="rounded-lg bg-white dark:bg-black">
                                    {loading ? (
                                        <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                            <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                        </div>
                                    ) : (
                                        <ReactApexChart
                                            series={statisticHomestay.series}
                                            options={statisticHomestay.options}
                                            type="donut"
                                            height={400}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    <div className="panel h-full w-full lg:col-span-3">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">
                                Các Đơn Đặt Phòng Gần đây
                            </h5>
                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">
                                            STT
                                        </th>
                                        <th>Mã đặt phòng</th>
                                        <th className='!text-center'>Thành Tiền</th>
                                        <th className='!text-center'>Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listRecentBooking?.map(
                                        (booking, index) => (
                                            <tr
                                                key={booking?.id}
                                                className="group text-white-dark hover:text-black dark:hover:text-white-light/90"
                                                onClick={() => handleRowClick(booking?.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td className='!text-center'>{index + 1}</td>
                                                <td className="min-w-[150px] text-black dark:text-white">
                                                    <div className="flex items-center">
                                                        
                                                        <span className="whitespace-nowrap">
                                                            {booking?.bookingDetails[0]?.bookingId.substring(0, 8)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='!text-center'>
                                                    {booking.totalPrice?.toLocaleString()}{' '}
                                                    vnđ
                                                </td>
                                                <td>
                                                    <div
                                                        className="flex cursor-pointer text-center justify-center"
                                                        style={{
                                                            color: 'white', // Default color
                                                            backgroundColor: `${renderStatus(booking.status).color}`,
                                                            // Default background color
                                                            padding:
                                                                '8px 0px 8px 0px',
                                                            borderRadius: '6px',
                                                            fontWeight: 'bold',
                                                            fontSize: '14px',
                                                            border: `2px solid ${renderStatus(booking.status).color}`, // Đường viền - 2px, màu #EA1365 (điều chỉnh nếu cần)
                                                        }}
                                                    >
                                                        {
                                                            renderStatus(
                                                                booking.status,
                                                            ).name
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="panel h-full w-full lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">
                                Top 5 Homestay Về Doanh Thu
                            </h5>
                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr className="border-b-0">
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">
                                            Homestay
                                        </th>
                                        <th>Tổng Doanh Thu</th>
                                        <th>Đánh Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listTop10Homestay?.map((h,index) => (
                                        <tr
                                            key={h.id}
                                            className="group text-white-dark hover:text-black dark:hover:text-white-light/90"
                                            onClick={() => handleRowClick2(listTop10Homestay?.[index]?.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="min-w-[150px] text-black dark:text-white">
                                                <div className="flex">
                                                    <img
                                                        className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3"
                                                        src={h?.images[0]?.url}
                                                        alt="avatar"
                                                    />
                                                    <p className="whitespace-nowrap">
                                                        {h?.name}
                                                        <span className="block text-xs text-primary">
                                                            {h?.totalRoom} Phòng
                                                        </span>
                                                    </p>
                                                </div>
                                            </td>

                                            <td>
                                                {h?.totalRevenue?.toLocaleString()}{' '}
                                                VNĐ
                                            </td>
                                            <td>
                                                <Rating
                                                    initialValue={h?.rating}
                                                    size={14}
                                                    fillColor="#f1a545" // Màu sắc của sao được chọn (tuỳ chọn)
                                                    emptyColor="#cccccc"
                                                    iconsCount={5}
                                                    allowFraction={true}
                                                    readonly={true}
                                                    SVGclassName={
                                                        'inline-block'
                                                    }
                                                />
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
            
    );
};

export default IndexAdmin;
