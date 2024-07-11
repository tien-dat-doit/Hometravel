import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import walletAPI from '../../../../util/walletAPI';
import { IRootState } from '../../../../store';
import { useSelector } from 'react-redux';
type PropsType = {
    time: number;
    walletId: string;
};
const DemoChart: React.FC<PropsType> = (props) => {
    const [seriesData, setSeriesData] = useState<any>(
        [
            {
                name: 'Lợi Nhuận',
                data: [0,0,0,0,0,0,0,0,0,0,0,0,0],
            },
        ]
    )
    useEffect(()=>{
        function getDataTransactionOfMonth(payload: any) {
            return new Promise(async (resolve, reject) => {
              try {
                const data = await walletAPI.getWalletOwnerTransaction(payload);                                       
                resolve(data);
              } catch (error) {
                reject(error);
              }
            });
          }
    const fetchDataChartProfit = async() => {
        const year = props.time; // Năm hiện tại     
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
                    walletId: props.walletId,
                    status: "SUCCESS"
                }
                return getDataTransactionOfMonth(filterObject)
            });
            const responses = await Promise.all(requests);
            const arrayDataTotalPriceOfEachMonth = responses?.map((res: any)=> {
                let totalPrice = 0
                res?.data?.map((month: any)=> {
                    if(month?.price){
                        totalPrice = totalPrice + month?.price
                    }
                    return true
                })
                return totalPrice
            })
            console.log({arrayDataTotalPriceOfEachMonth});
            setSeriesData(arrayDataTotalPriceOfEachMonth)
            
        } catch (error) {
           console.log({error}); 
        }
      };
  
      if(props.walletId){
        fetchDataChartProfit()
    }
   
    },[props])
    const isDark = useSelector(
        (state: IRootState) =>
            state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
    );
    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;
    const revenueChart: any = {
        series: [
            {
                name: 'Giao dịch',
                data: seriesData
                // data: [
                //     16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000,
                //     15000, 17000, 14000, 17000,
                // ],
            },
            // {
            //     name: 'Expenses',
            //     data: [
            //         16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000,
            //         16000, 19000, 18000, 19000,
            //     ],
            // },
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

    // const options = {
    //     chart: {
    //         zoom: {
    //             enabled: false,
    //         },
    //     },
    //     plotOptions: {
    //         bar: {
    //             horizontal: false,
    //             columnWidth: '50%',
    //             endingShape: 'rounded',
    //         },
    //     },
    //     dataLabels: {
    //         enabled: false,
    //     },
    //     xaxis: {
    //         categories: [1,2,3,4,5,6,7,8,9,10,11,12],
    //     },
    // };

    return (
        <div className="app">
            <div className="row">
                <div className="overflow-hidden rounded-lg bg-white dark:bg-black" id="chart">
                    <ReactApexChart
                        // options={options}
                        // series={series}
                        series={revenueChart.series}
                        options={revenueChart.options}
                        type="area"
                        height={300}
                    />
                </div>
            </div>
        </div>
    );
};

export default DemoChart;
