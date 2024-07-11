import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useEffect, useState } from 'react';

// import TableTransactionOwner from './Component/TableTransaction';
import TableStatistic from './Component/ApexChart';
import 'chartjs-adapter-moment';
import moment from 'moment';
interface walletObject {
    id: string;
    balance: number;
    ownerId: string;
    touristId: string;
    adminId: string;
}
const Statistic = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Thông tin người dùng'));
    });

    const { id } = useParams<{ id: string }>();
    const {type} = useParams<{type: string}>();
    const [role, setRole] = useState<string | null>(null);
    const walletExample = {
        id: '',
        adminId: '',
        balance: 0,
        ownerId: '',
        touristId: '',
    };
    const [walletInfo, setWalletInfo] = useState<walletObject>(walletExample);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [selectedTime, setSelectedTime] = useState<{ month: number, year: number }>({ month: moment().month() + 1, year: moment().year() });        
    return (
        <div className='panel'>
            <div className="pt-5">
                <div className="mb-4 text-lg font-bold">
                    Thống kê:
                </div>
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">   
                    </div>
                    <div className="flex gap-3 items-center relative mb-4">
                    <label>Chọn Tháng: </label>
                    <select
                        className="block w-[150px] appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 shadow hover:border-gray-400 focus:border-gray-500 focus:outline-none"
                        // value={`${selectedTime.month < 10 ? '0' + selectedTime.month : selectedTime.month}-${selectedTime.year}`}
                        value={`${(selectedTime.year < currentYear || (selectedTime.year === currentYear && selectedTime.month <= currentMonth)) ? (selectedTime.month < 10 ? '0' + selectedTime.month : selectedTime.month) : ''}-${selectedTime.year}`}
                        onChange={(e) => {
                            const [month, year] = e.target.value.split('-');
                            setSelectedTime({ month: parseInt(month), year: parseInt(year) });
                        }}
                    >
                        {
                        Array.from({length: 12 }).map((_, index) => {
                            const date = moment().subtract(index - 3, 'months');
                            return (
                                <option key={index} value={date.format('MM-YYYY')}>
                                    Tháng {date.format('MM-YYYY')}
                                </option>
                            );
                        })
                        }
                    </select>
                </div>
                
                <TableStatistic time={selectedTime} />
            </div>
        </div>
    );
};

export default Statistic;
