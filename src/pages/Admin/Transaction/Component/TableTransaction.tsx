import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconBell from '../../../../components/Icon/IconBell';
import Carousel from 'react-material-ui-carousel';
import IconPencil from '../../../../components/Icon/IconPencil';
import IconLockDots from '../../../../components/Icon/IconLockDots';
import ModalUpdate from '../../../Components/ModalUpdate';
import IconHorizontalDots from '../../../../components/Icon/IconHorizontalDots';
import MenuDropdown from '../../../Components/MenuDropdown';
import { useNavigate } from 'react-router-dom';
import ModalDisable from '../../../Components/ModalDisable';
import homestayAPI from '../../../../util/homestayAPI';
import useAuth from '../../../../hook/useAuth';
import Filters from '../../../Components/Filter';
import Basic from '../../../DataTables/Advanced';
import moment from 'moment';
import walletAPI from '../../../../util/walletAPI';
import transactionAPI from '../../../../util/transactionAPI';
import axiosClient from '../../../../util/axiosCustomize'; // Fixed import path

interface TransactionObject {
    id: string;
    price: number;
    status: string;
    type: string;
    createdDate: string;
    bookingId: string;
    walletId: string;
    paidUserId: string;
    admin: {
        id: string;
        username: string;
    };
    tourist: {
        id:  string;
        phoneNumber:  string;
        email:  string;
        firstName:  string;
        lastName: string;
        avatar:  string;
        gender: boolean
        dateOfBirth:  string;
        status:  string;
    };
    owner: {
        id:  string;
        email:  string;
        firstName:  string;
        lastName:  string;
        avatar:  string;
        phoneNumber:  string;
        status:  string;
    };
    wallet: {
        id: string;
        balance: 0;
        ownerId: string;
        tourist:{
            id:  string;
            phoneNumber:  string;
            email:  string;
            firstName:  string;
            lastName: string;
            avatar:  string;
            gender: boolean
            dateOfBirth:  string;
            status:  string;
        };
        admin: {
            id: string;
            username: string;
        };
        owner: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string;
            phoneNumber: string;
            status: string;
        };
    };
}

interface filterObject {
    pageIndex: number;
    pageSize: number;
    createdDate?: string | null;
    status?: string[] | string | null;
    type?: string | null;
    sortKey: string;
    sortOrder: string;
    price?: number | null
    paidUserId?: string | null;
}


const TableTransactionAdmin = () => {
    const navigate = useNavigate();
    const { auth }: any = useAuth();
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);

    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 10,
        paidUserId: '40bbd18f-cebd-4685-b8d4-62d5e7c44fce',
        // type: undefined,
        type: 'PAID_WITH_WALLET&type=PAID_WITH_CASH&type=PAID_WITH_VNPAY&type=PAID&type=REFUND&type=TOURIST_CANCELLED_BOOKING',
        sortKey: 'CreatedDate',
        sortOrder: 'DESC',
    });
    const renderStatus = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return { name: 'THÀNH CÔNG', color: '#1b5e20' };
            case 'FAILED':
                return { name: 'THẤT BẠI', color: '#ef3f3f' };          
            default:
                return { name: 'CHƯA XÁC ĐỊNH', color: '#ef3f3f' };
        }
    };
    const renderType = (type: string) => {
        switch (type) {
            case 'TOPUP':
                return { name: 'NẠP TIỀN', color: '#80d8ff' };
            case 'PAID_WITH_WALLET':
                return { name: 'THANH TOÁN BẰNG VÍ', color: '#1b5e20' };  
            case 'PAID_WITH_CASH':
                return { name: 'THANH TOÁN TIỀN MẶT', color: '#1b5e20' };  
            case 'PAID_WITH_VNPAY':
                return { name: 'THANH TOÁN VNPAY', color: '#1b5e20' };
            case 'PAID':
                return { name: 'THANH TOÁN CHO CHỦ NHÀ', color: '#206ba3' };           
            case 'REFUND':
                return { name: 'HOÀN TIỀN', color: '#FABF14' };      
            case 'TOURIST_CANCELLED_BOOKING':
                return { name: 'PHẠT HỦY ĐẶT PHÒNG', color: '#206ba3' };
            default:
                return { name: 'CHƯA XÁC ĐỊNH', color: '#ef3f3f' };
        }
    };
    
    const [recordsData, setRecordsData] = useState<TransactionObject[] | []>([]);
    const [loading, setLoading] = useState(true);
    const TransactionAdmin = {
        transactionAdmin(filterObject: filterObject) { // Explicitly define the type of the filterObject parameter
            const url = `/Transactions?pageIndex=${filterObject.pageIndex}&pageSize=${filterObject.pageSize}&type=${filterObject.type}&sortKey=${filterObject.sortKey}&sortOrder=${filterObject.sortOrder}&paidUserId=${filterObject.paidUserId}`;
            return axiosClient.get(url);
        },
    };
    useEffect(() => {
        const fetchListTransaction = async () => {
            try {
                const response: any = await TransactionAdmin.transactionAdmin(filterObject);
                // const response: any = await transactionAPI.getALL(filterObject); // Use the transactionAPI.getALL method instead of the TransactionAdmin.transactionAdmin method
                console.log('response123', response);
                setRecordsData(response.data ?? []);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 10);
                setLoading(false);
            } catch (error) {
                console.log('Error in get all transation', error);
            }
        };
        if(filterObject){fetchListTransaction()}
    }, [filterObject]);
    

    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
        setLoading(true);

    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
        setLoading(true);

    };

    return (
        <div> 
            {loading ? (
            <div className='text-center'>
                <span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>
            </div>
        ) : (       
            <div>
                <div className='flex items-center justify-between'>
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">
                        Lịch Sử Giao Dịch
                    </h5>
                    <div className="flex justify-end mb-3 gap-3">
                        <div className="flex items-center w-[300px]">
                        <label
                                htmlFor="typeFilter"
                                className="mr-2  text-right"
                            >
                                Loại giao dịch: 
                            </label>
                            <select
                                id="typeFilter"
                                className="form-select mr-1 w-full text-black"
                                onChange={(e) => {
                                    console.log('123',e.target.value);
                                    setFilterObject((prev)=>({...prev, type: e.target.value === "ALL" ? 'PAID_WITH_WALLET&type=PAID_WITH_CASH&type=PAID_WITH_VNPAY&type=PAID&type=REFUND' : e.target.value, pageIndex: 1,}));
                                    setLoading(true);
                                }}
                                value={filterObject?.type ?? "ALL"}
                            >
                                <option value="ALL">TẤT CẢ</option>
                                <option value="PAID_WITH_WALLET">THANH TOÁN BẰNG VÍ</option>
                                <option value="PAID_WITH_CASH">
                                THANH TOÁN BẰNG TIỀN MẶT
                                </option>   
                                <option value="PAID_WITH_VNPAY">
                            THANH TOÁN BẰNG VNPAY
                                </option>   
                                <option value="PAID">
                            THANH TOÁN CHO CHỦ NHÀ
                                </option> 
                                <option value="REFUND">
                            HOÀN TIỀN
                                </option> 
                                <option value="TOURIST_CANCELLED_BOOKING">
                            PHẠT HỦY ĐẶT PHÒNG
                                </option>                                                 
                            </select>
                        </div> 
                        <div className="flex items-center w-[300px]">
                        <label
                                htmlFor="statusFilter"
                                className="mr-2 w-[140px] text-right"
                            >
                                Trạng Thái
                            </label>
                            <select
                                id="statusFilter"
                                className="form-select mr-1 w-full text-black"
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    setFilterObject((prev)=>({...prev, status: e.target.value === "ALL" ? null : e.target.value, pageIndex: 1,}));
                                    setLoading(true);
                                }}
                                value={filterObject?.status ?? "ALL"}
                            >
                                <option value="ALL">TẤT CẢ</option>
                                <option value="SUCCESS">THÀNH CÔNG</option>
                                <option value="FAILED">
                                    THẤT BẠI
                                </option>                              
                            </select>
                        </div>
                    </div>
                    
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="table-hover whitespace-nowrap"
                        noRecordsText="Không có giao dịch"
                        records={recordsData}                  
                        columns={[
                            {
                                accessor: 'STT',
                                title: 'STT',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (record, index) => {
                                    return (
                                        <span>
                                            {index + 1 + (page - 1) * pageSize}
                                        </span>
                                    );
                                },
                            },
                            {
                                accessor: 'Người giao dịch',
                                title: 'Người giao dịch',
                                render: ({
                                    paidUserId,
                                    owner,
                                    tourist,
                                    admin,

                                }) => {
                                    let roleName = '';
                                    if (
                                        tourist &&
                                        paidUserId === tourist.id
                                    ) {
                                        roleName =
                                            tourist.firstName +
                                            ' ' +
                                            tourist.lastName;
                                    } else if (
                                        owner &&
                                        paidUserId === owner.id
                                    ) {
                                        roleName =
                                            owner.firstName +
                                            ' ' +
                                            owner.lastName;
                                    } else if (
                                        admin &&
                                        paidUserId === admin.id
                                    ) {
                                        roleName = 'Quản trị viên';
                                    }

                                    return <span>{roleName}</span>;
                                },
                            },
                            {
                                accessor: 'Người giao dịch',
                                title: 'Người nhận',
                                render: ({
                                    paidUserId,
                                    owner,
                                    tourist,
                                    admin,
                                    wallet
                                }) => {
                                    let roleName = '';
                                    if (
                                        tourist || owner
                                    ) {
                                        roleName = 'Quản trị viên';
                                    } else if (
                                        admin &&
                                        wallet.owner
                                    ) {
                                        roleName =
                                            wallet.owner.firstName +
                                            ' ' +
                                            wallet.owner.lastName;
                                    } else if (
                                        admin &&
                                        wallet.tourist
                                    ) {
                                        roleName =
                                            wallet.tourist.firstName +
                                            ' ' +
                                            wallet.tourist.lastName;
                                    }

                                    return <span>{roleName}</span>;
                                },
                            },
                            {
                                accessor: 'date',
                                title: 'Ngày Giao Dịch',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (record) => (
                                    <span>{moment(record?.createdDate).format("DD/MM/YYYY - HH:mm")}</span>
                                ),
                            },
                            {
                                accessor: 'price',
                                title: 'Số Tiền Giao Dịch',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (record) => (
                                    <span>{record?.type === 'REFUND' || record?.type === 'PAID' || record?.type === 'TOURIST_CANCELLED_BOOKING' ? '-' : ''}
                                        {record?.price?.toLocaleString()} VNĐ</span>
                                ),
                            },
                            {
                                accessor: 'type',
                                title: 'Loại Giao Dịch',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (row) => (
                                    <div className='flex justify-center'>
                                    <span
                                        style={{
                                            color: 'white', // Default color
                                            backgroundColor: `${renderType(row.type).color}`, // Default background color
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                        }}
                                        
                                    className='flex items-center justify-center gap-2 w-[200px]' 
                                    >                              
                                        {renderType(row.type).name}
                                    </span>
                                    </div> 
                                ),
                            },
                            {
                                accessor: 'status',
                                title: 'Trạng Thái',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (row) => (
                                    <div className='flex justify-center'>
                                    <span
                                        style={{
                                            color: 'white', // Default color
                                            backgroundColor: `${renderStatus(row.status).color}`, // Default background color
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                        }}
                                        
                                    className='flex items-center justify-center gap-2 w-[200px]' 
                                    >                              
                                        {renderStatus(row.status).name}
                                    </span>
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
                        // sortStatus={sortStatus}
                        // onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) =>
                            `Hiển thị  ${from} đến ${to} của ${totalRecords}`
                        }
                    />
                </div>
            </div>
            )}
        </div>
    );
};

export default TableTransactionAdmin;
