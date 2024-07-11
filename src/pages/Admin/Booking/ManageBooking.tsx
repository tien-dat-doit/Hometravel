// import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import ModalUpdate from '../../Components/ModalUpdate';
import IconHome from '../../../components/Icon/IconHome';
import IconDollarSignCircle from '../../../components/Icon/IconDollarSignCircle';
import IconUser from '../../../components/Icon/IconUser';
import TableBooking from './Component/TableBooking';

const MultiColumn = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Quản lý đặt phòng'));
    });

    const [search, setSearch] = useState('');

    // const formatDate = (date: any) => {
    //     if (date) {
    //         const dt = new Date(date);
    //         const month =
    //             dt.getMonth() + 1 < 10
    //                 ? '0' + (dt.getMonth() + 1)
    //                 : dt.getMonth() + 1;
    //         const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
    //         return day + '/' + month + '/' + dt.getFullYear();
    //     }
    //     return '';
    // };

    const [isUpdate, setIsUpdate] = useState(false);

    const [tabs, setTabs] = useState<string>('ALL');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    return (
        <div>
            <ModalUpdate
                modal17={isUpdate}
                setModal17={setIsUpdate}
                isHomestay={false}
            />

            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Danh Sách Đặt Phòng
                    </h5>
                    {/* <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Nhập tên homestay"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div> */}
                </div>
                <div className="pt-5">
                    <div>
                        <ul className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('ALL')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'ALL' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconHome />
                                    Tất cả đơn hàng
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('PAID')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'PAID' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconDollarSignCircle />
                                    Hoàn Tất Thanh Toán
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('DEPOSIT')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'DEPOSIT' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconDollarSignCircle />
                                    Hoàn Tất Tiền Cọc
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('PENDING')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'PENDING' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconDollarSignCircle />
                                    Đang Chờ Thanh Toán
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('CANCELLED')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'CANCELLED' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Đã Hủy
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('REFUND')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'REFUND' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Hoàn Tiền
                                </button>
                            </li>
                            {/* <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('EXPIRED')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'EXPIRED' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Đơn quá hạn
                                </button>
                            </li> */}
                             <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('PAYMENT SETTLEMENT')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'REFUND' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Đang Giải Quyết Thanh Toán
                                </button>
                            </li>
                        </ul>
                    </div>
                    {tabs ===  'ALL' ? (
                        <TableBooking
                            status={tabs}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'PAID' ? (
                        <TableBooking
                            status={tabs}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'DEPOSIT' ? (
                        <TableBooking
                            status={tabs}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'PENDING' ? (
                        <TableBooking
                            status={tabs}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'CANCELLED' ? (
                        <TableBooking
                            status={tabs}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'REFUND' ? (
                        <TableBooking
                            status={tabs}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'PAYMENT SETTLEMENT' ? (
                        <TableBooking
                            status={tabs}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )}
                    {/* {tabs === 'EXPIRED' ? (
                        <TableBooking
                            status={tabs}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default MultiColumn;
