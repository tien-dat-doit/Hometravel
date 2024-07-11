import { DataTable } from 'mantine-datatable';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hook/useAuth';
import walletAPI from '../../util/walletAPI';
import IconEye from '../../components/Icon/IconEye';
import ModalViewTransaction from './ModalViewTransaction';

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
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        phoneNumber: string;
        status: string;
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
    };
}

interface filterObject {
    pageIndex: number;
    pageSize: number;
    walletId: string;
    createdDate?: string | null;
    status?: string | null;
    type?: string | null;
    sortKey: string;
    sortOrder: string;
    price?: number | null;
}

interface TableTransactionProps {
    walletId: string;
    isWithdrawMoney: boolean
}

const TableTransactionOwner: React.FC<TableTransactionProps> = (props) => {
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [openModalTransaction, setOpenModalTransaction] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState("")
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 10,
        walletId: '',
        sortKey: 'CreatedDate',
        sortOrder: 'DESC',
    });
    const renderStatus = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return { name: 'Thành Công', color: '#1b5e20' };
            case 'FAILED':
                return { name: 'Thất Bại', color: '#ef3f3f' };
            default:
                return { name: 'Chưa Xác Định', color: '#ef3f3f' };
        }
    };
    const renderType = (type: string) => {
        switch (type) {
            case 'TOURIST_CANCELLED_BOOKING':
                return { name: 'Thanh Toán Bị Hoàn Tiền', color: '#ef3f3f' };
            case 'WITHDRAW':
                return { name: 'Rút Tiền', color: '#004d40' };
            case 'PAID':
                return { name: 'Admin Đã Thanh Toán', color: '#006064' };
            default:
                return { name: 'CHƯA XÁC ĐỊNH', color: '#ef3f3f' };
        }
    };
    const [recordsData, setRecordsData] = useState<TransactionObject[] | []>(
        [],
    );
    useEffect(() => {
        const fetchListTransaction = async () => {
            try {
                const response: any =
                    await walletAPI.getWalletOwnerTransaction(filterObject);
                console.log(response.data);
                setRecordsData(response.data ?? []);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 10);
            } catch (error) {
                console.log('Error in get all transation', error);
            }
        };
        if (filterObject.walletId && props?.isWithdrawMoney === false) {
            fetchListTransaction();
        }
    }, [filterObject, props?.isWithdrawMoney]);
    useEffect(() => {
        setFilterObject((prev) => ({ ...prev, walletId: props.walletId }));
    }, [props.walletId]);

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
                <div className="flex items-center justify-between">
                    <h5 className="mb-3 text-lg font-semibold dark:text-white-light">
                        Danh Sách Lịch Sử Giao Dịch
                    </h5>
                    <div className="mb-3 flex justify-end gap-3">
                        <div className="flex w-[300px] items-center">
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
                                    setFilterObject((prev) => ({
                                        ...prev,
                                        status:
                                            e.target.value === 'ALL'
                                                ? null
                                                : e.target.value,
                                    }));
                                }}
                                value={filterObject?.status ?? 'ALL'}
                            >
                                <option value="ALL">TẤT CẢ</option>
                                <option value="SUCCESS">THÀNH CÔNG</option>
                                <option value="FAILED">THẤT BẠI</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="table-hover whitespace-nowrap"
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
                                accessor: 'date',
                                title: 'Ngày Giao Dịch',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (record) => (
                                    <span>
                                        {moment(record?.createdDate).format(
                                            'DD/MM/YYYY - HH:mm A',
                                        )}
                                    </span>
                                ),
                            },
                            {
                                accessor: 'price',
                                title: 'Số Tiền Giao Dịch',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (record) => (
                                    <span>
                                        {record?.price?.toLocaleString()} VNĐ
                                    </span>
                                ),
                            },
                            {
                                accessor: 'type',
                                title: 'Loại Giao Dịch',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (row) => (
                                    <div className="flex justify-center">
                                        <span
                                            style={{
                                                color: 'white', // Default color
                                                backgroundColor: `${renderType(row.type).color}`, // Default background color
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontWeight: 'bold',
                                            }}
                                            className="flex w-[200px] items-center justify-center gap-2"
                                        >
                                            {renderType(row.type).name}
                                            {row?.type==="WITHDRAW" && row?.status==="SUCCESS" && <span className='cursor-pointer' onClick={()=>{
                                                setOpenModalTransaction(true)
                                                setSelectedTransaction(row?.id)
                                            }}><IconEye/></span>}
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
                                    <div className="flex justify-center">
                                        <span
                                            style={{
                                                color: 'white', // Default color
                                                backgroundColor: `${renderStatus(row.status).color}`, // Default background color
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontWeight: 'bold',
                                            }}
                                            className="flex w-[200px] items-center justify-center gap-2"
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
                            `Hiển thi  ${from} đến ${to} của ${totalRecords}`
                        }
                    />
                </div>
            </div>
           {selectedTransaction &&  <ModalViewTransaction
            setModal17={setOpenModalTransaction}
            modal17={openModalTransaction}
            id={selectedTransaction}
            />}
        </div>
    );
};

export default TableTransactionOwner;
