import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Fragment, useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Tab } from '@headlessui/react';
import IconHome from '../../../components/Icon/IconHome';
import IconPhone from '../../../components/Icon/IconPhone';
import IconUser from '../../../components/Icon/IconUser';
import { NavLink } from 'react-router-dom';
import IconEye from '../../../components/Icon/IconEye';
import IconSettings from '../../../components/Icon/IconSettings';
import Dropdown from '../../../components/Dropdown';
import { IRootState } from '../../../store';
import userAPI from '../../../util/userAPI';
import TableUsers from './Component/TableUsers';

interface Users {
    id: string;
    phoneNumber: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    gender: boolean;
    dateOfBirth: string;
    status: string;
    type: string;
}
const ListUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Homestay'));
    });
    const [users, setUsers] = useState<Users[]>([]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    // const [initialRecords, setInitialRecords] = useState(
    //     sortBy(recordsData, 'firstName'),
    // );
    const [recordsData, setRecordsData] = useState<Users[] | []>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        // setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize]);

    const [isUpdate, setIsUpdate] = useState(false);

    const [tabs, setTabs] = useState<string>('owner');

    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    return (
        <div className="panel">
            <div className="mt-6">
                <div className="mb-1 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Danh Sách Người dùng
                    </h5>
                    {/* <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Tìm kiếm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div> */}
                </div>
                <div className="">
                    <div>
                        <ul className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
                            {/* <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('all-user')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'all-user' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser />
                                    Tất Cả Người Dùng
                                </button>
                            </li> */}
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('owner')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'owner' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser />
                                    Tất Cả Chủ Nhà
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() =>
                                        toggleTabs('tourist')
                                    }
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'tourist' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Tất Cả Du Khách
                                </button>
                            </li>
                        </ul>
                    </div>
                    {/* {tabs === 'all-user' ? (
                        <TableUsers
                            rowData={''}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        null
                    )} */}
                    {tabs === 'owner' ? (
                        <TableUsers
                        rowData={'Owner'}
                        setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'tourist' ? (
                        <TableUsers
                        rowData={'Tourist'}
                        setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListUsers;
