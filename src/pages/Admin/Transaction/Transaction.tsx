import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconBell from '../../../components/Icon/IconBell';
import Carousel from 'react-material-ui-carousel';
import IconPencil from '../../../components/Icon/IconPencil';
import IconLockDots from '../../../components/Icon/IconLockDots';
import ModalUpdate from '../../Components/ModalUpdate';
import IconHorizontalDots from '../../../components/Icon/IconHorizontalDots';
import MenuDropdown from '../../Components/MenuDropdown';
import { useNavigate } from 'react-router-dom';
import ModalDisable from '../../Components/ModalDisable';
import homestayAPI from '../../../util/transactionAPI';
import useAuth from '../../../hook/useAuth';
import Filters from '../../Components/Filter';
import Basic from '../../DataTables/Advanced';
import moment from 'moment';
import transactionAPI from '../../../util/transactionAPI';
import TableTransactionAdmin from './Component/TableTransaction';
import ProfitChart from './Component/ProfitChart';
import walletAPI from '../../../util/walletAPI';
interface transaction {
    id: string;
    price: number;
    status: string;
    type: string;
    createdDate: string | null;
    bookingId: string | null;
    walletId: string;
    paidUserId: string;
    tourist: {
        id: string;
        phoneNumber: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        gender: boolean;
        dateOfBirth: string;
        status: string;
    };
    owner: {
        id: string;
        phoneNumber: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        gender: boolean;
        dateOfBirth: string;
        status: string;
    };
    admin: {
        id: string;
    };
    wallet: {
        id: string;
        balance: 0;
        ownerId: string;
        touristId:{
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
        adminId: {
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
    id: string;
    // ownerId: string;
    type: string;
}

interface walletObject {
    id: string;
    balance: number;
    ownerId: string;
    touristId: string;
    adminId: string;
}
const MultiColumn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { auth }: any = useAuth();
    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Giao Dịch'));
    });
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 10,
        type: '',
        id: '',
        // ownerId: auth?.user?.id,
    });
    const walletExample = {
        id: '',
        adminId: '',
        balance: 0,
        ownerId: '',
        touristId: '',
    };
    const [walletInfo, setWalletInfo] = useState<walletObject>(walletExample);
    const renderType = (type: string) => {
        switch (type) {
            case 'ACTIVE':
                return { name: 'HOẠT ĐỘNG', color: '#EA1365' };
            case 'INACTIVE TEMORARY':
                return { name: 'TẠM NGƯNG HOẠT ĐỘNG', color: '#515ae3' };
            case 'INACTIVE':
                return { name: 'NGƯNG HOẠT ĐỘNG', color: '#515ae2' };
            default:
                return { name: 'CHƯA XÁC ĐỊNH', color: '#fff' };
        }
    };
    const [loading, setLoading] = useState(true);
    const [recordsData, setRecordsData] = useState<transaction[] | []>([]);
    useEffect(() => {
        const fetchListHomestay = async () => {
            try {
                const response: any = await transactionAPI.getALL(filterObject);
                console.log(response.data);
                setRecordsData(response.data ?? []);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 10);
                setLoading(false);
            } catch (error) {
                console.log('Error in get transaction', error);
            }
        };
        fetchListHomestay();
        if (auth?.user?.role === 'Admin') {
            const fetchWalletInfo = async () => {
                try {
                    const response: any = await walletAPI.getWalletAdminInformation(
                        auth?.user?.id,
                    );
                    setWalletInfo(response.data[0]);
                } catch (error) {
                    console.log('Error in get wallet', error);
                }
            };
            fetchWalletInfo();
        }
    }, [filterObject]);

    const [modal17, setModal17] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const handleSearchHomestay = (e: any) => {
        setFilterObject({ ...filterObject, id: e.target.value, pageIndex: 1 });
    };
    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
    };
    
    return (
        <div >
            <div className="panel">
                <div className="mb-5">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Ví Tài Khoản
                    </h5>
                </div>
                <div className="mb-5">
                    <div className="table-responsive font-semibold text-[#515365] dark:text-white-light">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="mr-2 inline-flex items-center text-4xl font-extrabold text-green-500">
                                Tổng số tiền: {Number(walletInfo.balance).toLocaleString('vi-VN')}{' '}
                                <span className="ml-3">VNĐ</span>{' '}
                            </div>
                        </div>
                    </div>
                </div>
                <TableTransactionAdmin  ></TableTransactionAdmin>
                
            </div>
            <div className="panel mt-5">
                <h5 className="text-lg font-semibold dark:text-white-light">
                Thống kê giao dịch
                </h5>
                <div className="mt-5 table-responsive font-semibold text-[#515365] dark:text-white-light">
                    <ProfitChart walletId={walletInfo.id} />
                </div>
            </div>
        </div>
    );
};

export default MultiColumn;
