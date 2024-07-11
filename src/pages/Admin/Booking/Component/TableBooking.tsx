// import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
// import Carousel from 'react-material-ui-carousel';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
// import MenuDropdown from './MenuDropdown';
import bookingAPI from '../../../../util/bookingAPI';
import useAuth from '../../../../hook/useAuth';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { s } from '@fullcalendar/core/internal-common';
import { string } from 'yup';
import axiosClient from '../../../../util/axiosCustomize';
interface TableBookingProps {
    setIsUpdate: (data: boolean) => void;
    status: string;
}
interface filterObject {
    pageIndex: number;
    pageSize: number;
    status:  string |  null;
    sortKey: string;
    sortOrder: string;
}
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
const TableBooking: React.FC<TableBookingProps> = ({
    setIsUpdate,
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
        status: status === "ALL" ? 'PAID&status=DEPOSIT&status=PENDING&status=REFUND&status=CANCELLED&status=PAYMENT+SETTLEMENT' : status,
        sortKey:"CreatedDate",
        sortOrder:"DESC"
    });
    // setFilterObject((prev)=>({...prev, status: status === "ALL" ? 'PAID&status=DEPOSIT&status=PENDING&status=REFUND&status=CANCELLED&status=PAYMENT+SETTLEMENT' : status, pageIndex: 1,}));
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
            case 'COMPLETED':
                return { name: 'Đã Hoàn Thành', color: '#515ae2' };
            case 'PAYMENT SETTLEMENT':
                return { name: 'Đang Giải Quyết Thanh Toán', color: '#f4973b' };
            case 'EXPIRED':
                return { name: 'Hết hạn thanh toán', color: '#6d6d74' };
            default:
                return { name: 'Chưa Xác Định', color: '#EA1365' };
        }
    };
    const [recordsData, setRecordsData] = useState<bookingObject[] | []>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const getAllBooking = {
        getAllBookingAPI(filterObject: filterObject) { // Explicitly define the type of the filterObject parameter
            const url = `/Bookings?pageIndex=${filterObject.pageIndex}&pageSize=${filterObject.pageSize}&status=${filterObject.status}&sortKey=${filterObject.sortKey}&sortOrder=${filterObject.sortOrder}`;
            return axiosClient.get(url);
        },
    };
    useEffect(() => {
        const fetchListBookingForOwner = async () => {
            try {
                // const response: any = await bookingAPI.getAllBooking(
                //     {
                //         ...filterObject,
                //         status: status === 'ALL' ? ["PAID", "DEPOSIT", "PENDING", "REFUND", "CANCELLED", "PAYMENT SETTLEMENT"] : status,

                //     },
                // );
                const response: any = await getAllBooking.getAllBookingAPI(filterObject);
                setRecordsData(response.data ?? []);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 10);
                setLoading(false);
            } catch (error) {
                console.log('error', error);
                toast.error('Một số lỗi đã xảy ra, vui lòng thử lại sau!');
            }
        };
        fetchListBookingForOwner();
    }, [filterObject, status]);

  
    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
    };

    return (
        <div>
            <div className="datatables">
            {loading ? (
            <div className='text-center'>
                <span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>
            </div>
        ) : (
                <DataTable
                    highlightOnHover
                    className="table-hover whitespace-nowrap"
                    noRecordsText="Không có đơn đặt phòng" 
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'STT',
                            title: 'STT',
                            render: (record, index) => {
                                return (
                                    <span>
                                        {index + 1 + (page - 1) * pageSize}
                                    </span>
                                );
                            },
                        },
                        {
                            accessor: 'Mã Đặt Phòng',
                            title: 'Mã Đặt Phòng',
                            render: ( row ) => {
                                return (
                                    <span>{row.id.substring(0, 8)}</span>
                                );
                            },
                        },
                        // {
                        //     accessor: 'fullName',
                        //     title: 'Tên Khách Hàng',
                        //     // sortable: true,
                        //     render: (row) => (
                        //         <div className="flex w-max items-center">
                        //             <img
                        //                 className="h-14 w-14 rounded-lg object-cover ltr:mr-2 rtl:ml-2"
                        //                 src={row.tourist.avatar}
                        //                 alt="avatar"
                        //             />
                        //             <div className="ml-2 flex flex-col">
                        //                 {/* <div className="font-semibold text-blue-700">
                        //                     <p>{row.tourist.id}</p>
                        //                 </div> */}
                        //                 <div className="mt-1 font-bold">
                        //                     {row.tourist.lastName +
                        //                         ' ' +
                        //                         row.tourist.firstName}
                        //                 </div>
                        //             </div>
                        //         </div>
                        //     ),
                        // },
                        {
                            accessor: 'orderDate',
                            title: 'Ngày Đặt Phòng',
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
                            // sortable: true,
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
                            // sortable: true,
                            render: (row) => (
                                <span>
                                    {row.totalPrice.toLocaleString('vi-VN', {
                                        
                                        currency: 'VND',
                                    })} vnđ
                                </span>
                            ),
                        },
                        {
                            accessor: 'status',
                            title: 'Trạng Thái',
                            // sortable: true,
                            render: (row) => (
                                <span style={{ maxWidth: '170px', width: '170px' }}>
                                    {row.status === 'CANCELLED' && (
                                        <span
                                        className='btn btn-danger p-1.5'
                                        >
                                            Đã Hủy
                                        </span>
                                    )}
                                    {row.status === 'DEPOSIT' && (
                                        <>
                                            <span
                                                className='btn btn-primary p-1.5'
                                            >
                                                Đã Thanh Toán Cọc
                                            </span>
                                        </>
                                    )}
                                    {row.status === 'PAID' && (
                                        <span className='btn btn-success p-1.5'
                                        >
                                            Thanh Toán Hoàn Tất
                                        </span>
                                    )}
                                    {row.status === 'REFUND' && (
                                        <span
                                        className='btn btn-warning p-1.5'
                                        >
                                            Hoàn Tiền
                                        </span>
                                    )}
                                    {row.status === 'PENDING' && (
                                        <span
                                        className='btn btn-warning p-1.5'
                                        >
                                            Chờ thanh toán
                                        </span>
                                    )}
                                    {row.status === 'EXPIRED' && (
                                        <span
                                        className='btn btn-warning bg-purple-500 p-1.5'
                                        >
                                            Đã hết hạn
                                        </span>
                                    )}
                                    {row.status === 'PAYMENT SETTLEMENT' && (
                                        <span
                                        className='btn btn-warning p-1.5'
                                        >
                                            Đang Giải Quyết Thanh Toán
                                        </span>
                                    )}
                                    
                                    
                                </span>
                            ),
                        },
                    ]}
                    onRowClick={({ id }) =>
                        navigate(`/detailbooking/${id}`)
                    }
                    totalRecords={totalRecords}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={handlePageChange}
                    recordsPerPageOptions={[5, 10, 15]}
                    onRecordsPerPageChange={handleRecordPerPageChange}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) =>
                        `Hiển thị  ${from} đến ${to} của ${totalRecords} `
                    }
                />
            )}
            </div>
        </div>
    );
};

export default TableBooking;
