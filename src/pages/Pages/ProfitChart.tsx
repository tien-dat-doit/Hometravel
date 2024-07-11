import 'chartjs-adapter-moment';
import moment from 'moment';
import { useEffect, useState } from 'react';
import DemoChart from '../Components/ApexChart';

type PropsType = {
    walletId: string
};
const ProfitChart: React.FC<PropsType> = ({walletId}) => {
    const [selectedTime, setSelectedTime] = useState<number>(parseInt(moment().format('YYYY')));

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
             <div className="flex gap-3 items-center relative mb-4">
                <label>Chọn Năm: </label>
                <select
                    className="block w-[150px] appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 shadow hover:border-gray-400 focus:border-gray-500 focus:outline-none"
                    value={selectedTime}
                    onChange={(e)=>{setSelectedTime(parseInt(e.target.value))}}
                >
                    {
                    Array.from({length: 27}).map((month, index) => (
                        <option key={index} value={2024+index}>
                            Năm {2024+index}
                        </option>
                    ))}
                </select>
            </div>
            <DemoChart time={selectedTime} walletId={walletId}/>
        </div>
    );
};

export default ProfitChart;
// const data = {
//     yearSelected: 2024,
//     total: 1200000,
//     transactionOfYear: [
//         {
//             month: 1,
//             totalPrice: 100000,
//         },
//         {
//             month: 2,
//             totalPrice: 100000,
//         },
//         {
//             month: 3,
//             totalPrice: 100000,
//         },
//         {
//             month: 4,
//             totalPrice: 100000,
//         },
//         {
//             month: 5,
//             totalPrice: 100000,
//         },
//         {
//             month: 6,
//             totalPrice: 100000,
//         },
//         {
//             month: 7,
//             totalPrice: 100000,
//         },
//         {
//             month: 8,
//             totalPrice: 100000,
//         },
//         {
//             month: 9,
//             totalPrice: 100000,
//         },
//         {
//             month: 10,
//             totalPrice: 100000,
//         },
//         {
//             month: 11,
//             totalPrice: 100000,
//         },
//         {
//             month: 12,
//             totalPrice: 100000,
//         },
//     ],
// };
