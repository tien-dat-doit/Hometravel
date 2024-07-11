import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconEye from '../../components/Icon/IconEye';
import IconHome from '../../components/Icon/IconHome';
import useAuth from '../../hook/useAuth';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import homestayAPI from '../../util/homestayAPI';
import MenuDropdownListTable from '../Components/MenuDropdownListTable';
import ModalShowReasonRejectHomestay from '../Components/ModalRejectHomestay';

interface homeStay {
    id: string;
    name: string;
    acreage: number;
    city: string;
    district: string;
    commune: string;
    street: string;
    house: string;
    hamlet: string;
    address: string;
    description: string;
    isInActiveTemporary: boolean;
    status: string;
    ownerId: string;
    rooms: roomObject[];
    images: imageHomestayObject[];
}

interface imageHomestayObject {
    id: string;
    url: string;
    roomId: null | string;
    homeStayId: string;
}

interface roomObject {
    id: string;
    name: string;
    numberOfBeds: number;
    acreage: number;
    capacity: number;
    price: number;
    status: string;
    weekendPrice: number;
    homeStayId: string;
    roomAmenitieTitles: null | string[] | undefined;
    images: null | string[] | undefined;
}

interface filterObject {
    pageIndex: number;
    pageSize: number;
    name: string;
    ownerId: string;
    status: string[];
    sortKey: string;
    sortOrder: string;
}
const OrderSorting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { auth }: any = useAuth();
    useEffect(() => {
        dispatch(setPageTitle('Thông Tin Homestay'));
    });
    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;

    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Homestay'));
    });
    const renderStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return { name: 'HOẠT ĐỘNG', color: '#1b5e20' };
            case 'INACTIVE TEMPORARY':
                return { name: 'TẠM NGƯNG HOẠT ĐỘNG', color: '#515ae3' };
            case 'INACTIVE':
                return { name: 'NGƯNG HOẠT ĐỘNG', color: '#515ae2' };
            case 'PENDING':
                return { name: 'ĐANG CHỜ KIỂM DUYỆT', color: '#ea8213' };
            case 'CANCELLED':
                return { name: 'ĐÃ TỪ CHỐI', color: '#ef3f3f' };
            case 'SELF-CANCELLED':
                return { name: 'NGƯNG KIỂM DUYỆT', color: '#ef3f3f' };
            case 'DISABLE':
                return { name: 'VÔ HIỆU HÓA', color: '#880e4f' };
            default:
                return { name: 'CHƯA XÁC ĐỊNH', color: '#ef3f3f' };
        }
    };
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(5);
    const [pageSize, setPageSize] = useState(5);
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 5,
        name: '',
        ownerId: auth?.user?.id,
        status: ['ACTIVE', 'PENDING', 'DISABLE', 'CANCELLED'],
        sortKey: 'CreatedDate',
        sortOrder: 'DESC',
    });
    const [isOpen, setIsOpen] = useState(false);
    const [recordsData, setRecordsData] = useState<homeStay[] | []>([]);
    useEffect(() => {
        const fetchListHomestay = async () => {
            try {
                const response: any = await homestayAPI.getAll(filterObject);
                console.log(response.data);
                setRecordsData(response.data ?? []);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 5);
            } catch (error) {
                console.log('Error in get all homestay', error);
            }
        };
        fetchListHomestay();
    }, [filterObject]);
    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
    };
    const [selectedHomestay, setSelectedHomestay] = useState<homeStay | null>(
        null,
    );
    const handleSearchHomestay = (e: any) => {
        setFilterObject({ ...filterObject, name: e.target.value });
    };
    return (
        <div>
            {selectedHomestay && (
                <ModalShowReasonRejectHomestay
                    modal17={isOpen}
                    setModal17={setIsOpen}
                    data={selectedHomestay}
                />
            )}
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate('/addhomestay')}
                    >
                        <IconHome className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                        Tạo Mới Homestay
                    </button>
                    <div className="flex ltr:ml-auto rtl:mr-auto">
                        <div className="flex items-center">
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
                                                ? [
                                                      'ACTIVE',
                                                      'PENDING',
                                                      'DISABLE',
                                                      'CANCELLED',
                                                  ]
                                                : [e.target.value],
                                    }));
                                }}
                                value={
                                    filterObject?.status?.length > 1
                                        ? 'ALL'
                                        : filterObject?.status[0]
                                }
                            >
                                <option value="ALL">TẤT CẢ</option>
                                <option value="ACTIVE">HOẠT ĐỘNG</option>
                                <option value="PENDING">
                                    ĐANG CHỜ KIỂM DUYỆT
                                </option>
                                <option value="CANCELLED">ĐÃ TỪ CHỐI</option>
                                <option value="DISABLE">VÔ HIỆU HÓA</option>
                            </select>
                        </div>
                        <input
                            type="text"
                            className="form-input w-[240px]"
                            placeholder="Tìm kiếm tên homestay..."
                            value={filterObject.name}
                            onChange={handleSearchHomestay}
                        />
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className={`${isRtl ? 'table-hover whitespace-nowrap' : 'table-hover whitespace-nowrap'}`}
                        records={recordsData}
                        noRecordsText="Không Có Thông Tin !!!"
                        height={recordsData?.length < 3 ? 600 : '100%'}
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
                                accessor: 'name',
                                title: 'Tên Homestay',

                                render: (record, index) => (
                                    <div className="flex items-center gap-2">
                                        {record?.images.length > 0 && (
                                            <img
                                                src={record?.images[0].url}
                                                alt="img"
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '20%',
                                                }}
                                            />
                                        )}
                                        <span>{record?.name}</span>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'numberOfRoom',
                                title: 'Số Lượng Phòng',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: ({ rooms }) => (
                                    <span>{rooms?.length} Phòng</span>
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
                                                backgroundColor: `${row?.isInActiveTemporary ? "#515ae3" :renderStatus(row.status).color}`, // Default background color
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontWeight: 'bold',
                                            }}
                                            className="flex w-[200px] items-center justify-center gap-2"
                                        >
                                            {(row.status === 'CANCELLED' ||
                                                row.status === 'DISABLE') && (
                                                <span
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedHomestay(
                                                            row,
                                                        );
                                                        setIsOpen(true);
                                                    }}
                                                >
                                                    <IconEye />
                                                </span>
                                            )}
                                            {row?.isInActiveTemporary ? "TẠM NGƯNG HOẠT ĐỘNG" :renderStatus(row.status).name}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'action',
                                title: 'Hành Động',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (row) => (
                                    <div className="flex justify-center">
                                        <MenuDropdownListTable
                                            id={row?.id}
                                            status={row?.status}
                                            data={row}
                                            setFilterObject={setFilterObject}
                                        />
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
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) =>
                            `Hiển Thị Từ ${from} Đến ${to} Trong ${totalRecords}`
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderSorting;
