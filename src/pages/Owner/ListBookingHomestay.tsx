import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconBell from '../../components/Icon/IconBell';
import Carousel from 'react-material-ui-carousel';
import IconPencil from '../../components/Icon/IconPencil';
import IconLockDots from '../../components/Icon/IconLockDots';
import MenuDropdown from '../Components/MenuDropdown';
import ModalUpdate from '../Components/ModalUpdate';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconUser from '../../components/Icon/IconUser';
import IconPhone from '../../components/Icon/IconPhone';
import IconEye from '../../components/Icon/IconEye';
import ModalPayment from '../Components/ModalPayment';
import ModalPendingPayment from '../Components/ModalPendingPayment';
import ModalCancelPayment from '../Components/ModalCancelPayment';
import TableHomestayBooking from '../Components/TableHomestayBooking';
const rowData = [
    {
        id: 1,
        idBooking: 1,
        firstName: 'Lâm Homestay',
        lastName: 'Deluxe',
        firstNameCustomer: 'Tiến Đạt',
        lastNameCustomer: 'Nguyễn Hồ',
        numberBed: 'Single Bed',
        status: 'Đã Thanh Toán',
        statusAdmin: 'Hoàn Tất',
        acreage: '12m x 10m',
        roomfacility:
            'AC, Shower, Double Bed, Towel, Bathup, Coffee Set, LED TV, Wifi',
        startDate: '28/02/2024',
        dueDate: '06/03/2024',
        firstRoomName: 'Deluxe',
        lastRoomName: 'Phòng 1',
    },
    {
        id: 2,
        idBooking: 2,
        firstName: 'Khôi Homestay',
        lastName: 'President',
        firstNameCustomer: 'Minh Thành',
        lastNameCustomer: 'Trần',
        numberBed: 'Double Bed',
        status: 'Đã Hủy',
        statusAdmin: 'Hủy Thanh Toán',
        acreage: '11m x 10m',
        roomfacility:
            'AC, Shower, Double Bed, Towel, Bathup, Coffee Set, LED TV, Wifi',
        startDate: '28/02/2024',
        dueDate: '05/03/2024',
        firstRoomName: 'Goverment',
        lastRoomName: 'Phòng 2',
    },
    {
        id: 3,
        idBooking: 3,
        firstName: 'Huy Homestay',
        lastName: 'Normal',
        firstNameCustomer: 'Tiến Đạt',
        lastNameCustomer: 'Nguyễn Hồ',
        numberBed: 'Triple Bed',
        status: 'Chờ Thanh Toán',
        statusAdmin: 'Chờ Thanh Toán',
        acreage: '11m x 10m',
        roomfacility:
            'AC, Shower, Double Bed, Towel, Bathup, Coffee Set, LED TV, Wifi',
        startDate: '28/02/2024',
        dueDate: '04/03/2024',
        firstRoomName: 'Single',
        lastRoomName: 'Phòng 2',
    },
    {
        id: 4,
        idBooking: 4,
        firstName: 'Trường Homestay',
        lastName: 'Normal',
        firstNameCustomer: 'Quốc Lâm',
        lastNameCustomer: 'Lý',
        numberBed: 'Quara Bed',
        status: 'Đã Thanh Toán',
        statusAdmin: 'Hoàn Tất',
        acreage: '11m x 10m',
        roomfacility:
            'AC, Shower, Double Bed, Towel, Bathup, Coffee Set, LED TV, Wifi',
        startDate: '28/02/2024',
        dueDate: '03/03/2024',
        firstRoomName: 'Double',
        lastRoomName: 'Phòng 2',
    },
    {
        id: 5,
        idBooking: 5,
        firstName: 'Tú Homestay',
        lastName: 'Normal',
        firstNameCustomer: 'Quang Thành',
        lastNameCustomer: 'Hồ',
        numberBed: 'Penta Bed',
        status: 'Đã Hủy',
        statusAdmin: 'Hủy Thanh Toán',
        acreage: '11m x 10m',
        roomfacility:
            'AC, Shower, Double Bed, Towel, Bathup, Coffee Set, LED TV, Wifi',
        startDate: '28/02/2024',
        dueDate: '02/03/2024',
        firstRoomName: 'Deluxe',
        lastRoomName: 'Phòng 2',
    },
];

const MultiColumn = () => {
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(setPageTitle('Danh Sách Phòng'));
    // });
    // const [page, setPage] = useState(1);
    // const PAGE_SIZES = [10, 20, 30, 50, 100];
    // const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    // const [initialRecords, setInitialRecords] = useState(
    //     sortBy(rowData, 'firstName'),
    // );
    // const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    // const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    //     columnAccessor: 'firstName',
    //     direction: 'asc',
    // });

    // const images = [
    //     'https://cf.bstatic.com/xdata/images/hotel/max1024x768/376761048.jpg?k=7e069b19c5ba043f1e86ba488d2955b518740af4a3c900444f80ad1f3ed4d6bb&o=&hp=1',
    //     'https://cf.bstatic.com/xdata/images/hotel/max1024x768/352509731.jpg?k=2f72d6c40a389cba4db346eba759bff85c1b72b28ebda501c152f68601d43b9c&o=&hp=1',
    // ];
    // useEffect(() => {
    //     setPage(1);
    // }, [pageSize]);

    // useEffect(() => {
    //     const from = (page - 1) * pageSize;
    //     const to = from + pageSize;
    //     setRecordsData([...initialRecords.slice(from, to)]);
    // }, [page, pageSize, initialRecords]);

    // useEffect(() => {
    //     setInitialRecords(() => {
    //         return rowData.filter((item) => {
    //             return (
    //                 item.firstName
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase()) ||
    //                 item.lastName
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase()) ||
    //                 item.acreage.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.status
    //                     .toString()
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase()) ||
    //                 item.numberBed
    //                     .toString()
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase())
    //             );
    //         });
    //     });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [search]);

    // useEffect(() => {
    //     const data = sortBy(initialRecords, sortStatus.columnAccessor);
    //     setInitialRecords(
    //         sortStatus.direction === 'desc' ? data.reverse() : data,
    //     );
    //     setPage(1);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [sortStatus]);

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
    const [isShowPayment, setIsShowPayment] = useState(false);
    const [isShowPendingPayment, setIsShowPendingPayment] = useState(false);
    const [isShowCancelPayment, setIsShowCancelPayment] = useState(false);

    const [tabs, setTabs] = useState<string>('homestay-all');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const statusHomestayDonePayment = rowData.filter(
        (r) => r.statusAdmin === 'Hoàn Tất',
    );
    const statusHomestayCancelPayment = rowData.filter(
        (r) => r.statusAdmin === 'Hủy Thanh Toán',
    );
    const statusHomestayPendingPayment = rowData.filter(
        (r) => r.statusAdmin === 'Chờ Thanh Toán',
    );

    return (
        <div>
            <ModalUpdate
                modal17={isUpdate}
                setModal17={setIsUpdate}
                isHomestay={false}
            />

            <ModalPayment
                modal17={isShowPayment}
                setModal17={setIsShowPayment}
            />

            <ModalPendingPayment
                modal17={isShowPendingPayment}
                setModal17={setIsShowPendingPayment}
            />

            <ModalCancelPayment
                modal17={isShowCancelPayment}
                setModal17={setIsShowCancelPayment}
            />

            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Quản Lý Thanh Toán
                    </h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Search..."
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
                                    onClick={() => toggleTabs('homestay-all')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'homestay-all' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconHome />
                                    Tất Cả Booking
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('homestay-done')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'homestay-done' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconDollarSignCircle />
                                    Booking Đã Được Thanh Toán
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() =>
                                        toggleTabs('homestay-pending')
                                    }
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'homestay-pending' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconDollarSignCircle />
                                    Booking Đang Chờ Thanh Toán
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() =>
                                        toggleTabs('homestay-cancel')
                                    }
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'homestay-cancel' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Booking Đã Hủy
                                </button>
                            </li>
                        </ul>
                    </div>
                    {tabs === 'homestay-all' ? (
                        <TableHomestayBooking
                            rowData={rowData}
                            setIsUpdate={setIsUpdate}
                            setIsShowCancelPayment={setIsShowCancelPayment}
                            setIsShowPendingPayment={setIsShowPendingPayment}
                            setIsShowPayment={setIsShowPayment}
                            isHidden={true}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'homestay-done' ? (
                        <TableHomestayBooking
                            rowData={statusHomestayDonePayment}
                            setIsUpdate={setIsUpdate}
                            setIsShowCancelPayment={setIsShowCancelPayment}
                            setIsShowPendingPayment={setIsShowPendingPayment}
                            setIsShowPayment={setIsShowPayment}
                            isHidden={false}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'homestay-pending' ? (
                        <TableHomestayBooking
                            rowData={statusHomestayPendingPayment}
                            setIsUpdate={setIsUpdate}
                            setIsShowCancelPayment={setIsShowCancelPayment}
                            setIsShowPendingPayment={setIsShowPendingPayment}
                            setIsShowPayment={setIsShowPayment}
                            isHidden={false}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'homestay-cancel' ? (
                        <TableHomestayBooking
                            rowData={statusHomestayCancelPayment}
                            setIsUpdate={setIsUpdate}
                            setIsShowCancelPayment={setIsShowCancelPayment}
                            setIsShowPendingPayment={setIsShowPendingPayment}
                            setIsShowPayment={setIsShowPayment}
                            isHidden={false}
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
