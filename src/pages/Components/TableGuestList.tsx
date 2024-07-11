// import sortBy from 'lodash/sortBy';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
// import Carousel from 'react-material-ui-carousel';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
// import MenuDropdown from './MenuDropdown';
import moment from 'moment';
import { toast } from 'react-toastify';
import IconChecks from '../../components/Icon/IconChecks';
import useAuth from '../../hook/useAuth';
import bookingAPI from '../../util/bookingAPI';
import MenuDropdownBookingDetail from './MenuDropdownBookingDetail';
import ModalDepositBooking from './ModalDepositBooking';

interface TableGuestListProps {
    searchName: string
    status: string;
}
interface filterObject {
    pageIndex: number;
    pageSize: number;
    status: string | null;
    name?: string | null;
    sortKey?: string | null;
    sortOrder?: string | null
}
// interface bookingObjectFix{
//     id: string
//     price: number
//     roomId: string
//     bookingId: string
//     room: {
//       id: string
//       name:string
//       numberOfBeds: number
//       acreage: number
//       capacity: number
//       price: number
//       status: string
//       weekendPrice: number
//       homeStayId: string
//       roomAmenitieTitles: [],
//       images: [],
//       homeStay: {
//         id: string
//         name: string
//         acreage: number
//         city: string
//         district: string
//         commune: string
//         street: string
//         house: string | null,
//         hamlet: string | null,
//         address: string
//         checkInTime: string
//         checkOutTime: string
//         description: string
//         status: string
//         createdDate: string | null,
//         ownerId: string
//       }
//     },
//     booking: {
//       id: string
//       totalPrice: number
//       checkInDate: string | null,
//       checkOutDate: string | null,
//       status: string
//       createdDate: string
//       touristId: string
//       tourist: {
//         id: string
//         phoneNumber: string
//         email: string
//         firstName: string
//         lastName: string
//         avatar: string
//         gender: boolean
//         dateOfBirth: string
//         status: string | null
//       }
//     }
//   }
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
const TableGuestList: React.FC<TableGuestListProps> = ({
    searchName,
    status,
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Phòng'));
    });
    const { auth }: any = useAuth();
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 10,
        status: null,
        sortKey:"CreatedDate",
        sortOrder:"DESC"
    });
    const [selectedBooking, setSelectedBooking] = useState<any>()
    const [recordsData, setRecordsData] = useState<bookingObject[] | []>([]);
    const [isOpen, setIsOpen] = useState(false)
    // const [page, setPage] = useState(1);
    // const PAGE_SIZES = [10, 20, 30, 50, 100];
    // const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    // const [initialRecords, setInitialRecords] = useState(
    //     sortBy(rowData, 'firstName'),
    // );
    // const [recordsData, setRecordsData] = useState(initialRecords);

    // const [search, setSearch] = useState('');
    // const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    //     columnAccessor: 'firstName',
    //     direction: 'asc',
    // });
    const renderStatus = (status: string) => {
        switch (status) {
            case 'PAID':
                return { name: 'Thanh Toán Hoàn Tất', color: '#304ffe' };
            case 'DEPOSIT':
                return { name: 'Đã Thanh Toán Cọc', color: '#01579b' };
            case 'CANCELLED':
                return { name: 'Đã Bị Hủy', color: '#EA1365' };
            case 'REFUND':
                return { name: 'Đã Hoàn Tiền', color: '#f800df' };
            case 'PENDING':
                return { name: 'Chờ Thanh Toán', color: '#f4973b' };        
            case 'PAYMENT SETTLEMENT':
                return { name: 'Đang Giải Quyết Thanh Toán', color: '#f4973b' };
            case 'EXPIRED':
                return { name: 'Đơn Quá Hạn', color: '#3e2723' };
            default:
                return { name: 'Chưa Xác Định', color: '#EA1365' };
        }
    };
    useEffect(() => {
        const fetchListBookingForOwner = async () => {
            try {
                const response: any = await bookingAPI.getAll(
                    {
                        ...filterObject,
                        status: status === 'ALL' ? ["PAID", "DEPOSIT", "PENDING", "REFUND", "CANCELLED", "PAYMENT SETTLEMENT","DONE"] 
                                : (status === 'CHECKINNULL' || status === 'CHECKINTRUE' || status === 'CHECKINFALSE' )   ? ["PAID", "DEPOSIT"]
                                :  status === 'NOTDONE' ? ["PAID", "DEPOSIT"]
                                : status,
                        isCheckin:  status === 'CHECKINTRUE' ? true 
                                    : status === 'CHECKINFALSE' ? false 
                                    : status === 'NOTDONE' ? false
                                    : null,
                        name: searchName ? searchName : null
                    },
                    auth?.user?.id,
                );
                setRecordsData(response.data ?? []);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 10);
            } catch (error) {
                console.log('error', error);
                toast.error('Một số lỗi đã xảy ra, vui lòng thử lại sau!');
            }
        };
        fetchListBookingForOwner();
    }, [filterObject, status, searchName]);


    // useEffect(() => {
    //     if (status !== 'ALL') {
    //         setFilterObject({ ...filterObject, status: status });
    //     } else {
    //         setFilterObject({ ...filterObject, status: null });
    //     }
    // }, [status]);
    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
    };
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
    //                 item.orderDate
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase()) ||
    //                 item.checkIn.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.checkOut
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase()) ||
    //                 item.roomName
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase()) ||
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
   
    return (
        <div>
            {selectedBooking && <ModalDepositBooking
            modal17={isOpen}
            setModal17={setIsOpen}
            data={selectedBooking}
            setFilterObject={setFilterObject}     
            />}
            <div className="datatables">
                <DataTable
                    highlightOnHover
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    noRecordsText='Không Có Thông Tin !!!'
                    height={recordsData?.length < 3 ? 600 : "100%"}
                    columns={[
                        {
                            accessor: 'STT',
                            title: 'STT',
                            cellsStyle:{textAlign:"center"}, 
                            titleStyle:{textAlign:"center"},
                            render: (record, index) => {
                                return (
                                    <span>
                                        {index + 1 + (page - 1) * pageSize}
                                    </span>
                                );
                            },
                        },
                        {
                            accessor: 'fullName',
                            title: 'Tên Khách Hàng',
                            // sortable: true,
                            render: (row) => (
                                <div className="flex w-max items-center">
                                    <img
                                        className="h-14 w-14 rounded-lg object-cover ltr:mr-2 rtl:ml-2"
                                        src={row.tourist.avatar}
                                        alt="avatar"
                                    />
                                    <div className="ml-2 flex flex-col">
                                        {/* <div className="font-semibold text-blue-700">
                                            <p>{row.tourist.id}</p>
                                        </div> */}
                                        <div className="mt-1 font-bold">
                                            {row.tourist.lastName +
                                                ' ' +
                                                row.tourist.firstName}
                                        </div>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            accessor: 'orderDate',
                            title: 'Ngày Đặt Phòng',
                            cellsStyle:{textAlign:"center"}, 
                            titleStyle:{textAlign:"center"},
                            // sortable: true,
                            render: (row) => (
                                <span>
                                    {moment(row.createdDate).format(
                                        'DD/MM/yyyy',
                                    )}
                                </span>
                            ),
                        },
                        {
                            accessor: 'checkIn',
                            title: 'Ngày Nhận Phòng',
                            cellsStyle:{textAlign:"center"}, 
                            titleStyle:{textAlign:"center"},
                            // sortable: true,
                            render: (row) => (
                                <span>
                                    {row.checkInDate
                                        ? moment(row.checkInDate).format(
                                              'DD/MM/yyyy',
                                          )
                                        : 'Chưa xác định'}
                                </span>
                            ),
                        },
                        {
                            accessor: 'checkOut',
                            title: 'Ngày Trả Phòng',
                            cellsStyle:{textAlign:"center"}, 
                            titleStyle:{textAlign:"center"},
                            render: (row) => (
                                <span>
                                    {row.checkOutDate
                                        ? moment(row.checkOutDate).format(
                                              'DD/MM/yyyy',
                                          )
                                        : 'Chưa xác định'}
                                </span>
                            ),
                        },
                        {
                            accessor: 'roomPrice',
                            title: 'Thành Tiền',
                            cellsStyle:{textAlign:"center"}, 
                            titleStyle:{textAlign:"center"},
                            // sortable: true,
                            render: (row) => (
                                <span>
                                    {row.totalPrice?.toLocaleString()} vnđ
                                </span>
                            ),
                        },
                        {
                            accessor: 'status',
                            title: 'Trạng Thái',
                            titleStyle:{textAlign:"center"},
                            cellsStyle:{textAlign:"center"}, 
                            // sortable: true,
                            render: (row) => (
                                <span
                                    className="flex cursor-pointer items-center justify-center"
                                    style={{
                                        color: 'white', // Default color
                                        backgroundColor: `${renderStatus(row.status).color}`,
                                        // Default background color
                                        padding: '8px 0px 8px 0px',
                                        borderRadius: '6px',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        border: `2px solid ${renderStatus(row.status).color}`, // Đường viền - 2px, màu #EA1365 (điều chỉnh nếu cần)
                                    }}
                                >
                                    {row?.status === 'DEPOSIT' && (
                                        <span
                                            className="cursor-pointer"
                                            onClick={() =>{
                                                setSelectedBooking(row)
                                                setIsOpen(true)
                                            }}
                                        >
                                            <IconChecks />
                                        </span>
                                    )}

                                    {renderStatus(row.status).name}
                                </span>
                            ),
                        },
                        {
                            accessor: 'action',
                            title: 'Hành Động',
                            cellsStyle:{textAlign:"center"}, 
                            titleStyle:{textAlign:"center"},
                            render: (row) => (
                                <div className='flex justify-center'>
                                    <MenuDropdownBookingDetail id={row.id} />
                                </div>
                            ),
                        },
                    ]}
                    totalRecords={totalRecords}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={handlePageChange}
                    recordsPerPageOptions={[5, 10, 15]}
                    onRecordsPerPageChange={handleRecordPerPageChange}
                    // totalRecords={initialRecords.length}
                    // recordsPerPage={pageSize}
                    // page={page}
                    // onPageChange={(p) => setPage(p)}
                    // recordsPerPageOptions={PAGE_SIZES}
                    // onRecordsPerPageChange={setPageSize}
                    // sortStatus={sortStatus}
                    // onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) =>
                        `Hiển Thị Từ ${from} Đến ${to} Trong ${totalRecords}`
                    }
                />
            </div>
        </div>
    );
};

export default TableGuestList;
