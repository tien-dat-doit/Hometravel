// import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
// import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
// import IconBell from '../../components/Icon/IconBell';
// import Carousel from 'react-material-ui-carousel';
// import IconPencil from '../../components/Icon/IconPencil';
// import IconLockDots from '../../components/Icon/IconLockDots';
// import MenuDropdown from '../Components/MenuDropdown';
import ModalUpdate from '../Components/ModalUpdate';
// import IconLinkedin from '../../components/Icon/IconLinkedin';
// import IconTwitter from '../../components/Icon/IconTwitter';
// import IconFacebook from '../../components/Icon/IconFacebook';
// import IconGithub from '../../components/Icon/IconGithub';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconUser from '../../components/Icon/IconUser';
// import IconPhone from '../../components/Icon/IconPhone';
// import IconEye from '../../components/Icon/IconEye';
// import ModalPayment from '../Components/ModalPayment';
// import ModalPendingPayment from '../Components/ModalPendingPayment';
// import ModalCancelPayment from '../Components/ModalCancelPayment';
import TableGuestList from '../Components/TableGuestList';

const MultiColumn = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Khách Hàng'));
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
                        Danh Sách Khách Hàng
                    </h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-[300px]"
                            placeholder="Tên khách hàng..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
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
                                    Tất Cả Khách Hàng
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('CHECKINNULL')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'CHECKINNULL' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser />
                                    Đợi Nhận Phòng
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('CHECKINTRUE')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'CHECKINTRUE' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser />
                                    Đã Nhận Phòng
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('CHECKINFALSE')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'CHECKINFALSE' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser />
                                    Đã Trả Phòng
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('PAYMENT SETTLEMENT')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'PAYMENT SETTLEMENT' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Trả Phòng Trễ
                                </button>
                            </li>
                            {/* <li className="inline-block">
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
                            </li> */}
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
                                    Khách Đã Hủy
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
                                    onClick={() => toggleTabs('PAYMENT SETTLEMENT')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'PAYMENT SETTLEMENT' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Đang Giải Quyết Thanh Toán
                                </button>
                            </li> */}
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('NOTDONE')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'NOTDONE' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Chờ Thanh Toán Cho Chủ Nhà
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('DONE')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'DONE' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Đã Thanh Toán Cho Chủ
                                </button>
                            </li>
                        </ul>
                    </div>
                    {tabs === 'ALL' ? (
                        <TableGuestList
                            status={tabs}
                            searchName = {search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'PAID' ? (
                        <TableGuestList
                            status={tabs}
                            searchName = {search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'DEPOSIT' ? (
                        <TableGuestList
                            status={tabs}
                            searchName = {search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'PENDING' ? (
                        <TableGuestList
                            status={tabs}
                            searchName = {search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'CANCELLED' ? (
                        <TableGuestList
                            status={tabs}
                            searchName = {search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'REFUND' ? (
                        <TableGuestList
                            status={tabs}
                            searchName = {search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'PAYMENT SETTLEMENT' ? (
                        <TableGuestList
                            status={tabs}
                            searchName = {search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'DONE' ? (
                        <TableGuestList
                            status={tabs}
                            searchName = {search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'CHECKINNULL' ? (
                        <TableGuestList
                            status={tabs}
                            searchName={search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'CHECKINTRUE' ? (
                        <TableGuestList
                            status={tabs}
                            searchName={search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'CHECKINFALSE' ? (
                        <TableGuestList
                            status={tabs}
                            searchName={search}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'NOTDONE' ? (
                        <TableGuestList
                            status={tabs}
                            searchName={search}
                        />
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultiColumn;
