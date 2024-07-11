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
import IndexAdmin from './IndexAdmin';
import IndexOwner from './IndexOwner';
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
const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Trang Chủ'));
    });
    const isDark = useSelector(
        (state: IRootState) =>
            state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
    );
    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;

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
    const [showOption, setShowOption] = useState<Boolean>(false);
    const [totalPriceFromOneHomestay, setTotalPriceFromOneHomestay] =
        useState<number>(0);
    const [selectedTime, setSelectedTime] = useState<number>(
        parseInt(moment().format('YYYY')),
    );
    const handleInputChange = (event: any) => {
        const term = event.target.value;
        setShowOption(true);
        if (typeof term === 'string') {
            setSelectedHomestay({ ...selectedHomestay, name: term });
        }
        const filteredResults = recordsHomestayData.filter((option) =>
            option?.name.includes(term),
        );
        setSearchResultsHomestay(filteredResults);
    };
    const [dataRevenue, setDataRevenue] = useState<number[]>([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    const [dataForChartHomestayWithStatus, setDataForChartHomestayWithStatus] =
        useState([1, 2, 3, 4, 5, 6, 7]);
    const [dataForChartBookingWithStatus, setDataForChartBookingWithStatus] =
        useState([1, 2, 3, 4, 5, 6]);
    const handleResultClick = (result: homeStay) => {
        setSelectedHomestay(result);
        setShowOption(false);
    };
    useEffect(() => {
        function getDataTransactionOfMonth(payload: any, id: string) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await bookingAPI.getAll(payload, id);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        }
        const fetchDataChartProfit = async () => {
            const year = selectedTime; // Năm hiện tại
            const ranges = [];
            for (let i = 0; i < 12; i++) {
                const startDate = moment(`${year}-${i + 1}-01`, 'YYYY-MM-DD');

                const endDate = moment(startDate).endOf('month');

                ranges.push({
                    startDate: startDate.format('YYYY-MM-DD'),
                    endDate: endDate.format('YYYY-MM-DD'),
                });
            }
            try {
                const requests = ranges?.map((month: any) => {
                    let filterObject = {
                        startDate: month.startDate,
                        endDate: month.endDate,
                        pageSize: 100,
                        status: 'PAID',
                        homeStayId: selectedHomestay.id,
                    };
                    return getDataTransactionOfMonth(
                        filterObject,
                        auth?.user?.id,
                    );
                });
                const responses = await Promise.all(requests);

                let totalPriceFromOneHomestay = 0;
                const arrayDataTotalPriceOfEachMonth = responses?.map(
                    (res: any) => {
                        let totalPrice = 0;
                        res?.data?.map((month: any) => {
                            if (month?.amountOwnerReceiver) {
                                totalPrice =
                                    totalPrice + month?.amountOwnerReceiver;
                                totalPriceFromOneHomestay =
                                    totalPriceFromOneHomestay +
                                    month?.amountOwnerReceiver;
                            }
                            return true;
                        });
                        return totalPrice;
                    },
                );
                //console.log({arrayDataTotalPriceOfEachMonth});
                setDataRevenue(arrayDataTotalPriceOfEachMonth);
                setTotalPriceFromOneHomestay(totalPriceFromOneHomestay);
            } catch (error) {
                console.log({ error });
            }
        };

        if (selectedHomestay?.id) {
            fetchDataChartProfit();
        }
    }, [selectedHomestay, selectedTime]);
    useEffect(() => {
        const fetchAllHomestayByEachStatus = async () => {
            try {
                const response = await dashboardAPI.getAllHomestayByStatus(auth?.user?.id);
                console.log({ response });
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
                const response = await dashboardAPI.getAllBookingByStatus(auth?.user?.id)
                console.log({response});
                const numberArray = [];
                if (response.data) {
                    for (const key in response.data) {
                        if (typeof response.data[key] === 'number') {
                            numberArray.push(response.data[key]);
                        }
                    }
                }
                setDataForChartBookingWithStatus(
                    numberArray ?? [1, 2, 3, 4, 5, 6, 7],
                );
            } catch (error) {
                console.log({ error });
            }
        };
        const fetchTop10Homestay = async () => {
            try {
                const response = await dashboardAPI.getTop10Homestay(
                    auth?.user?.id,
                );
                setListTop10Homestay(response?.data || []);
            } catch (error) {
                console.log({ error });
            }
        };
        const fetchListBookingForOwner = async () => {
            try {
                const response: any = await bookingAPI.getAll(
                    {
                        pageIndex: 1,
                        pageSize: 10,
                    },
                    auth?.user?.id,
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
    
    //Revenue Chart
    const revenueChart: any = {
        series: [
            {
                name: 'Doanh Thu',
                data: dataRevenue,
            },
        ],
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
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
            labels: [
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12',
            ],
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

    const statisticHomestay: any = {
        series: dataForChartHomestayWithStatus,
        options: {
            chart: {
                type: 'donut',
                height: 460,
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
                height: 50,
                offsetY: 20,
            },
            colors: isDark
                ? [
                      '#004225',
                      '#002FA7',
                      '#E30B5C',
                      '#002FA7',
                      '#B8860B',
                      '#CB410B',
                      '#880e4f'
                  ]
                : [
                      '#004225',
                      '#002FA7',
                      '#E30B5C',
                      '#002FA7',
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
                                    console.log({ val });
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
                height: 460,
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
                      '#8B004B',
                  ]
                : [
                      '#004225',
                      '#E48400',
                      '#002FA7',
                      '#E30B5C',
                      '#CB410B',
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
                height: 50,
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
                'ĐANG GIẢI QUYẾT THANH TOÁN',
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
            {auth?.user?.role === "Owner" && ( 
                <IndexOwner></IndexOwner>
            )}
            {auth?.user?.role === "Admin" && ( 
                <IndexAdmin></IndexAdmin>
            )}
        </div>
    );
};

export default Index;
