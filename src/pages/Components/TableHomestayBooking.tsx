import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { useDispatch } from 'react-redux';
import IconEye from '../../components/Icon/IconEye';
import { setPageTitle } from '../../store/themeConfigSlice';
import MenuDropdown from '../Components/MenuDropdown';

interface Datatable {
    id: number;
    idBooking: number;
    firstName: string;
    lastName: string;
    firstNameCustomer: string;
    lastNameCustomer: string;
    numberBed: string;
    status: string;
    statusAdmin: string;
    acreage: string;
    roomfacility: string;
    startDate: string;
    dueDate: string;
    firstRoomName: string;
    lastRoomName: string;
}

interface TableHomestayBookingProps {
    rowData: Datatable[];
    setIsUpdate: (data: boolean) => void;
    setIsShowPayment: (data: boolean) => void;
    setIsShowPendingPayment: (data: boolean) => void;
    setIsShowCancelPayment: (data: boolean) => void;
    isHidden: boolean;
}

interface booingDetailObject  {
    id: string
    price: number
    roomId: string
    bookingId: string
    room: {
        id: string
        name: string
        numberOfBeds: number
        acreage: number
        capacity: number
        price: number
        status: string
        weekendPrice: number
        rejectReason: string
        startDateInActiveTemporary: string
        endDateInActiveTemporary: string
        homeStayId: string
        roomAmenitieTitles: [];
        images: [
            {
                id: string
                url: string
            },
        ];               
        homeStay: {
            id: string
            name: string
            acreage: number
            city: string
            district: string
            commune: string
            street: string
            house: string
            hamlet: string
            address: string
            checkInTime: string
            checkOutTime: string
            description: string
            totalCapacity: number
            status: string
            rejectReason:string
            createdDate: string
            rating:number
            licenseFile:string
            contractTouristFile: string
            startDateInActiveTemporary: string
            endDateInActiveTemporary: string
            ownerId: string                  
            images: [
                {
                    id: string
                    url: string          
                },
            ];
        };
    };
    booking: string
}

interface bookingObject {
    id: string
    totalPrice: number
    totalCapacity: number
    actualQuantityTourist: null;
    checkInDate: string
    checkOutDate: string
    status: string
    createdDate: string
    touristId: string
    tourist: {
        id: string
        phoneNumber: string
        email: string
        firstName: string
        lastName: string
        avatar: string
        dateOfBirth: string
        status: string
    };
    
    bookingDetails: booingDetailObject[];
}

const TableHomestayBooking: React.FC<TableHomestayBookingProps> = ({
    rowData,
    setIsUpdate,
    setIsShowPayment,
    setIsShowPendingPayment,
    setIsShowCancelPayment,
    isHidden,
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Phòng'));
    });
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(
        sortBy(rowData, 'firstName'),
    );
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    const images = [
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/376761048.jpg?k=7e069b19c5ba043f1e86ba488d2955b518740af4a3c900444f80ad1f3ed4d6bb&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/352509731.jpg?k=2f72d6c40a389cba4db346eba759bff85c1b72b28ebda501c152f68601d43b9c&o=&hp=1',
    ];
    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return rowData.filter((item) => {
                return (
                    item.firstName
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    item.lastName
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    item.acreage.toLowerCase().includes(search.toLowerCase()) ||
                    item.status
                        .toString()
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    item.numberBed
                        .toString()
                        .toLowerCase()
                        .includes(search.toLowerCase())
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(
            sortStatus.direction === 'desc' ? data.reverse() : data,
        );
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);
    return (
        <div className="datatables">
            <DataTable
                highlightOnHover
                className="table-hover whitespace-nowrap"
                records={recordsData}
                columns={[
                    {
                        accessor: 'idBooking',
                        title: 'STT',
                        sortable: true,
                    },
                    {
                        accessor: 'firstName',
                        title: 'Tên Homestay',
                        sortable: true,
                        render: ({ firstName, lastName, id }) => (
                            <div className="flex w-max items-center">
                                {/* <img
                                                    className="h-9 w-9 rounded-full object-cover ltr:mr-2 rtl:ml-2"
                                                    src={`/assets/images/profile-${id}.jpeg`}
                                                    alt=""
                                                /> */}
                                <Carousel
                                    sx={{
                                        margin: 'auto',
                                        width: 120,
                                        border: 'none',
                                        borderRadius: '8px',
                                    }}
                                    indicatorContainerProps={{
                                        style: {
                                            zIndex: 1,
                                            marginTop: '-24px',
                                            position: 'relative',
                                        },
                                    }}
                                >
                                    {images &&
                                        images.map((i: any, index: any) => (
                                            <img
                                                key={index}
                                                height="345"
                                                src={i}
                                                alt="img"
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ))}
                                </Carousel>
                                <div className="ml-2 flex flex-col">
                                    {/* <div className="font-semibold text-blue-700">
                                                        <p>#112</p>
                                                    </div> */}
                                    <div className="mt-1 font-bold">
                                        {firstName}
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        accessor: 'firstRoomName',
                        title: 'Tên Phòng',
                        sortable: true,
                        render: ({ firstRoomName, lastRoomName, id }) => (
                            <div className="flex w-max items-center">
                                <Carousel
                                    sx={{
                                        margin: 'auto',
                                        width: 120,
                                        border: 'none',
                                        borderRadius: '8px',
                                    }}
                                    indicatorContainerProps={{
                                        style: {
                                            zIndex: 1,
                                            marginTop: '-24px',
                                            position: 'relative',
                                        },
                                    }}
                                >
                                    {images &&
                                        images.map((i: any, index: any) => (
                                            <img
                                                key={index}
                                                height="345"
                                                src={i}
                                                alt="img"
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ))}
                                </Carousel>
                                <div className="ml-2 flex flex-col">
                                    <div className="font-semibold text-blue-700">
                                        {lastRoomName}
                                    </div>
                                    <div className="mt-1 font-bold">
                                        {firstRoomName}
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        accessor: 'fullNameCustomer',
                        title: 'Tên Khách Hàng',
                        sortable: true,
                        render: ({
                            firstNameCustomer,
                            lastNameCustomer,
                            id,
                        }) => (
                            <div className="flex w-max items-center">
                                <img
                                    className="h-12 w-12 rounded-full object-cover ltr:mr-2 rtl:ml-2"
                                    src={`/assets/images/profile-${id}.jpeg`}
                                    alt=""
                                />
                                <div className="ml-2 flex flex-col">
                                    <div className="font-semibold text-blue-700">
                                        <p>#112</p>
                                    </div>
                                    <div className="mt-1 font-bold">
                                        {lastNameCustomer +
                                            ' ' +
                                            firstNameCustomer}
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        accessor: 'startDate',
                        title: 'Ngày Nhận Phòng',
                        sortable: true,
                    },
                    {
                        accessor: 'dueDate',
                        title: 'Ngày Trả Phòng',
                        sortable: true,
                    },
                    // {
                    //     accessor: 'dob',
                    //     title: 'Start Date',
                    //     sortable: true,
                    //     render: ({ dob }) => (
                    //         <div>{formatDate(dob)}</div>
                    //     ),
                    // },

                    {
                        accessor: 'status',
                        title: 'Trạng Thái',
                        sortable: true,
                        render: (row) => (
                            <span>
                                {row.status === 'Đã Hủy' && (
                                    <span
                                        style={{
                                            color: '#EA1365', // Default color
                                            backgroundColor: 'none',
                                            // Default background color
                                            padding: '8px 65px 8px 65px',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            border: '2px solid #EA1365', // Đường viền - 2px, màu #EA1365 (điều chỉnh nếu cần)
                                            display: 'inline-block',
                                        }}
                                    >
                                        Đã Hủy
                                    </span>
                                )}
                                {row.status === 'Chờ Thanh Toán' && (
                                    <>
                                        <span
                                            style={{
                                                color: '#f4970b', // Default color
                                                backgroundColor: 'none', // Default background color
                                                padding: '8px 40px 8px 40px',
                                                borderRadius: '6px',
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                border: '2px solid #f4970b', // Đường viền - 2px, màu #EA1365 (điều chỉnh nếu cần)
                                                display: 'inline-block',
                                            }}
                                        >
                                            Chờ Thanh Toán
                                        </span>
                                    </>
                                )}
                                {row.status === 'Đã Thanh Toán' && (
                                    <span
                                        style={{
                                            color: '#515ae2', // Default color
                                            backgroundColor: 'none', // Default background color
                                            padding: '8px 40px 8px 40px',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            border: '2px solid #515ae2', // Đường viền - 2px, màu #EA1365 (điều chỉnh nếu cần)
                                            display: 'inline-block',
                                        }}
                                    >
                                        Đã Thanh Toán
                                    </span>
                                )}
                            </span>
                        ),
                    },
                    {
                        accessor: 'statusAdmin',
                        title: 'Trạng Thái Quản Trị Viên',
                        hidden: isHidden,
                        sortable: true,
                        render: (row) => (
                            <span>
                                {row.statusAdmin === 'Hủy Thanh Toán' && (
                                    <div
                                        style={{
                                            display: 'inline-block', // Đặt display cho div để nó chỉ chiếm đúng phần chữ và biểu tượng
                                            backgroundColor: '#ff0022', // Màu background
                                            borderRadius: '6px', // Bo góc
                                            padding: '8px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: 'white', // Màu chữ
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center', // Căn giữa theo chiều dọc
                                            }}
                                            onClick={() => {
                                                setIsShowCancelPayment(true);
                                            }}
                                        >
                                            Hủy Thanh Toán &nbsp;
                                            <IconEye />
                                        </span>
                                    </div>
                                )}
                                {row.statusAdmin === 'Chờ Thanh Toán' && (
                                    <div
                                        style={{
                                            display: 'inline-block', // Đặt display cho div để nó chỉ chiếm đúng phần chữ và biểu tượng
                                            backgroundColor: '#ff6200', // Màu background
                                            borderRadius: '6px', // Bo góc
                                            padding: '8px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: 'white', // Màu chữ
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center', // Căn giữa theo chiều dọc
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => {
                                                setIsShowPendingPayment(true);
                                            }}
                                        >
                                            Chờ Thanh Toán &nbsp;
                                            <IconEye />
                                        </span>
                                    </div>
                                )}
                                {row.statusAdmin === 'Hoàn Tất' && (
                                    <div
                                        style={{
                                            display: 'inline-block', // Đặt display cho div để nó chỉ chiếm đúng phần chữ và biểu tượng
                                            backgroundColor: '#316314', // Màu background
                                            borderRadius: '6px', // Bo góc
                                            padding: '8px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: 'white', // Màu chữ
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer', // Căn giữa theo chiều dọc
                                            }}
                                            onClick={() => {
                                                setIsShowPayment(true);
                                            }}
                                        >
                                            Hoàn Tất &nbsp;
                                            <IconEye />
                                        </span>
                                    </div>
                                )}
                            </span>
                        ),
                    },
                    {
                        accessor: 'price',
                        title: 'Giá Tiền',
                        render: (row) => (
                            <span>
                             100,000 VNĐ  
                            </span>
                        ),
                    },
                ]}
                totalRecords={initialRecords.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={(p) => setPage(p)}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                minHeight={200}
                paginationText={({ from, to, totalRecords }) =>
                    `Showing  ${from} to ${to} of ${totalRecords} entries`
                }
            />
        </div>
    );
};

export default TableHomestayBooking;
