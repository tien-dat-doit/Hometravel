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
        touristId: string;
        adminId: string;
        owner: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string;
            phoneNumber: string;
            status: string;
        };
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
    };
}

interface filterObject {
    pageIndex: number;
    pageSize: number;
    bookingId: string;
    sortKey: string;
    sortOrder: string;
}

interface TableTransactionProps {
    bookingId: string;
}

const TableTransactionOwner: React.FC<TableTransactionProps> = (props) => {
    const navigate = useNavigate();
    const { auth }: any = useAuth();
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 50,
        bookingId: props.bookingId,
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
                return { name: 'THANH TOÁN BẰNG TIỀN MẶT', color: '#1b5e20' };  
            case 'PAID_WITH_VNPAY':
                return { name: 'THANH TOÁN BẰNG VNPAY', color: '#1b5e20' };    
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
    useEffect(() => {
        const fetchListTransaction = async () => {
            try {
                const response: any = await walletAPI.getWalletOwnerTransaction(filterObject);
                console.log(response.data);
                setRecordsData(response.data ?? []);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 50);
            } catch (error) {
                console.log('Error in get all transation', error);
            }
        };
        if(filterObject.bookingId){fetchListTransaction()}
    }, [filterObject]);
    useEffect(() => {
        setFilterObject((prev)=>({...prev, bookingId: props.bookingId}));
    }, [props.bookingId]);

    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
    };

    return (
        <div>        
            <div>
                <div className='flex items-center justify-between'>
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">
                        Lịch Sử Giao Dịch
                    </h5>
                    
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="table-hover"
                        records={recordsData} 
                        noRecordsText="Không có dữ liệu"                 
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
                                accessor: 'Người nhận',
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
                                    <span>{record?.price?.toLocaleString()} VNĐ</span>
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
                                        
                                    className='flex items-center justify-center gap-2 w-[250px]' 
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
                        // totalRecords={totalRecords}
                        // recordsPerPage={pageSize}
                        // page={page}
                        // onPageChange={handlePageChange}
                        // recordsPerPageOptions={[5, 10, 15]}
                        // onRecordsPerPageChange={handleRecordPerPageChange}
                        // sortStatus={sortStatus}
                        // onSortStatusChange={setSortStatus}
                        minHeight={200}
                    />
                </div>
            </div>
        </div>
    );
};

export default TableTransactionOwner;
