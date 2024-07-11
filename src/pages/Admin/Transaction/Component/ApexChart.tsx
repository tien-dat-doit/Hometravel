import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import walletAPI from '../../../../util/walletAPI';
import axiosClient from '../../../../util/axiosCustomize';

type PropsType = {
    time: number;
    walletId: string;
};
interface filterObject {
    pageSize: number;
    pageIndex: number;
    startDate: string | null;
    endDate: string | null;
    walletId: string | null;
    paidUserId: string | null;
    status: string | null;
    type: string | null;
}
const DemoChart: React.FC<PropsType> = (props) => {
    const [loading, setLoading] = useState(true);
    
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageSize: 50,
        pageIndex: 1,
        startDate: '',
        endDate: '',
        status: 'SUCCESS',
        walletId :'',
        paidUserId: '',
        type: 'PAID&type=REFUND&type=TOURIST_CANCELLED_BOOKING',
    });
    const TransactionAdmin = {
        transactionAdmin(filterObject: filterObject) { // Explicitly define the type of the filterObject parameter
            const url = `/Transactions?pageIndex=1&pageSize=100&type=${filterObject.type}&startDate=${filterObject.startDate}&endDate=${filterObject.endDate}&status=${filterObject.status}&paidUserId=${filterObject.paidUserId}`;
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
        console.log({ dates });
        return dates;
    };
    
    const numberDateOfMonth = generateDatesInMonth();
    const dataGen: number[] = Array.from({
        length: numberDateOfMonth.length,
    }).map((d, index) => index + 1);
    console.log('data check', dataGen);
    const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
        {
            name: 'Tiền vào',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: 'Tiền ra ',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ]);
    useEffect(() => {
        function getDataTransactionOfMonth(payload: any) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data =
                        await walletAPI.getWalletOwnerTransaction(payload);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        }
        function getDataTransactionOfMonth2(payload: any) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data =
                        await TransactionAdmin.transactionAdmin(payload);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        }
        const fetchDataChartProfit = async () => {
            const year = props.time; // Năm hiện tại
            const ranges = [];
            for (let i = 0; i < 12; i++) {
                const startDate = moment(`${year}-${i + 1}-01`, 'YYYY-MM-DD');
                console.log(startDate.format('YYYY-MM-DD'));
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
                        walletId: props.walletId,
                        status: 'SUCCESS',
                    };
                    return getDataTransactionOfMonth(filterObject);
                });
                const requests2 = ranges?.map((month: any) => {
                    let filterObject = {
                        startDate: month.startDate,
                        endDate: month.endDate,
                        type: 'PAID&type=TOURIST_CANCELLED_BOOKING',
                        status: 'SUCCESS',
                        paidUserId: '40bbd18f-cebd-4685-b8d4-62d5e7c44fce',
                    };
                    return getDataTransactionOfMonth2(filterObject);
                });
                const requests3 = ranges?.map((month: any) => {
                    let filterObject = {
                        startDate: month.startDate,
                        endDate: month.endDate,
                        type: 'REFUND',
                        status: 'SUCCESS',
                    };
                    return getDataTransactionOfMonth(filterObject);
                });
                const requests4 = ranges?.map((month: any) => {
                    let filterObject = {
                        startDate: month.startDate,
                        endDate: month.endDate,
                        type: 'PAID&type=REFUND&type=TOURIST_CANCELLED_BOOKING',
                        status: 'SUCCESS',
                        paidUserId: '40bbd18f-cebd-4685-b8d4-62d5e7c44fce',
                    };
                    return getDataTransactionOfMonth2(filterObject);
                });
                const responses = await Promise.all(requests);
                const responses2 = await Promise.all(requests2);
                const responses3 = await Promise.all(requests3);
                const responses4 = await Promise.all(requests4);


                console.log({ responses });
                const arrayDataTotalPriceOfEachMonth = responses?.map(
                    (res: any) => {
                        let totalPrice = 0;
                        res?.data?.map((month: any) => {
                            if (month?.price) {
                                totalPrice = totalPrice + month?.price;
                            }
                            return true;
                        });
                        return totalPrice;
                    },
                );
                const arrayDataTotalPriceOfEachMonth2 = responses2?.map(
                    (res: any) => {
                        let totalPrice = 0;
                        res?.data?.map((month: any) => {
                            if (month?.price) {
                                totalPrice = totalPrice + month?.price;
                            }
                            return true;
                        });
                        return totalPrice;
                    },
                );
                const arrayDataTotalPriceOfEachMonth3 = responses3?.map(
                    (res: any) => {
                        let totalPrice = 0;
                        res?.data?.map((month: any) => {
                            if (month?.price) {
                                totalPrice = totalPrice + month?.price;
                            }
                            return true;
                        });
                        return totalPrice;
                    },
                );
                const arrayDataTotalPriceOfEachMonth4 = responses4?.map(
                    (res: any) => {
                        let totalPrice = 0;
                        res?.data?.map((month: any) => {
                            if (month?.price) {
                                totalPrice = totalPrice + month?.price;
                            }
                            return true;
                        });
                        return totalPrice;
                    },
                );
                //console.log({arrayDataTotalPriceOfEachMonth});
                setSeries([
                    {
                        name: 'Tiền vào',
                        data: arrayDataTotalPriceOfEachMonth,
                    },
                    {
                        name: 'Tiền ra',
                        data: arrayDataTotalPriceOfEachMonth4,
                    },
                    {
                        name: 'Tiền chuyển cho Chủ nhà',
                        data: arrayDataTotalPriceOfEachMonth2 ,
                    },
                    {
                        name: 'Tiền chuyển cho Du khách',
                        data: arrayDataTotalPriceOfEachMonth3 ,
                    },
                    
                ]);
                setLoading(false);
            } catch (error) {
                console.log({ error });
            }
        };

        if (props.walletId) {
            fetchDataChartProfit();
        }
    }, [props]);

    const options = {
        chart: {
            zoom: {
                enabled: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
    };

    return (
        <div>
            {loading ? (
                <div className="text-center">
                    <span className="m-auto mb-10 inline-block h-14 w-14 animate-spin rounded-full border-8 border-[#f1f2f3] border-l-primary align-middle"></span>
                </div>
            ) : (
                <div className="app">
                    <div className="row">
                        <div className="mixed-chart" id="chart">
                            <ReactApexChart
                                options={options}
                                series={series}
                                type="bar"
                                width="100%"
                                height={'400'}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemoChart;
