import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconBell from '../../components/Icon/IconBell';
import Carousel from 'react-material-ui-carousel';
import IconPencil from '../../components/Icon/IconPencil';
import IconLockDots from '../../components/Icon/IconLockDots';
import ModalUpdate from '../Components/ModalUpdate';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import MenuDropdown from '../Components/MenuDropdown';
import { useNavigate } from 'react-router-dom';
import ModalDisable from '../Components/ModalDisable';
import homestayAPI from '../../util/homestayAPI';
import useAuth from '../../hook/useAuth';
import Filters from '../Components/Filter';
import Basic from '../DataTables/Advanced';
import moment from 'moment';

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
    status: string;
    ownerId: string;
    rejectReason: string;
    createdDate: string;
    rating: string;
    contractFile: string;
    licenseFile: string;
    isInActiveTemporary:boolean;
    startDateInActiveTemporary: string;
    endDateInActiveTemporary: string;
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
    sortKey: string
    sortOrder: string
}

const MultiColumn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { auth }: any = useAuth();
    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Homestay'));
    });
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(5);
    const [pageSize, setPageSize] = useState(5);
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 5,
        name: '',
        ownerId: auth?.user?.id,
        status: ['ACTIVE', 'INACTIVE TEMPORARY', 'INACTIVE'],
        sortKey: "CreatedDate",
        sortOrder: "DESC"
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
            case 'CANCELED':
                return { name: 'ĐÃ TỪ CHỐI', color: '#ef3f3f' };
            case 'SELF-CANCELED':
                return { name: 'NGƯNG KIỂM DUYỆT', color: '#ef3f3f' };
            default:
                return { name: 'CHƯA XÁC ĐỊNH', color: '#fff' };
        }
    };
    const [recordsData, setRecordsData] = useState<homeStay[] | []>([]);
    const [selectedHomestay, setSelectedHomestay] = useState<
        homeStay | undefined
    >();
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

    const [modal17, setModal17] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const handleSearchHomestay = (e: any) => {
        setFilterObject({ ...filterObject, name: e.target.value });
    };
    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
    };
    
    return (
        <div>
            <ModalUpdate
                modal17={isUpdate}
                setModal17={setIsUpdate}
                isHomestay={true}
                data={selectedHomestay}
                setFilterObject={setFilterObject}
            />
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Danh Sách Homestay
                    </h5>
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
                                                      'INACTIVE TEMPORARY',
                                                      'INACTIVE',
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
                                <option value="ACTIVE">HOẠT ĐỘNG </option>
                                <option value="INACTIVE TEMPORARY">
                                    TẠM NGƯNG HOẠT ĐỘNG
                                </option>
                                <option value="INACTIVE">
                                    NGƯNG HOẠT ĐỘNG
                                </option>
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
                    {/* <Filters></Filters> */}
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="table-hover whitespace-nowrap "
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
                                //sortable: true,
                                render: ({ name, images, id }, index) => (
                                    <div className="flex w-max items-center">
                                        {/* <img
                                            className="h-9 w-9 rounded-full object-cover ltr:mr-2 rtl:ml-2"
                                            src={`/assets/images/profile-${id}.jpeg`}
                                            alt=""
                                        /> */}
                                        {images.length > 0 && (
                                            <img
                                                // height="345"
                                                src={images[0].url}
                                                alt="img"
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '120px',
                                                    height: '100px',
                                                    borderRadius: '20%',
                                                }}
                                            />
                                        )}

                                        <div className="ml-2 flex flex-col">
                                            <div
                                                className="mt-1 cursor-pointer font-bold"
                                                onClick={() =>
                                                    navigate(
                                                        `/danh-sach-phong/${id}`,
                                                    )
                                                }
                                            >
                                                {name}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'numberOfRoom',
                                title: 'Số Lượng Phòng',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: ({ rooms }) => (
                                    <span>{rooms?.length}</span>
                                ),
                            },
                            {
                                accessor: 'acreage',
                                title: 'Diện tích',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (rowData) => {
                                    return (
                                        <span>
                                            {rowData.acreage}m<sup>2</sup>
                                        </span>
                                    );
                                },
                            },
                            {
                                accessor: 'address',
                                title: 'Địa Chỉ',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                // width:"100px",
                                render: ({
                                    city,
                                    district,
                                    commune,
                                    street,
                                    house,
                                    hamlet,
                                    address,
                                }) => (
                                    <span
                                        style={{
                                            overflow: 'auto',
                                            maxWidth: '100px',
                                        }}
                                    >
                                        {street
                                            ? address +
                                              ' ' +
                                              street +
                                              ', ' +
                                              city
                                            : address + ', ' + city}
                                    </span>
                                ),
                            },

                            {
                                accessor: 'status',
                                title: 'Trạng Thái',
                                // sortable: true,
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (row) => (
                                    <div
                                        className={
                                            row?.status === 'INACTIVE TEMPORARY'
                                                ? 'flex flex-col items-center justify-center'
                                                : ''
                                        }
                                    >
                                        <span
                                            style={{
                                                color: 'white', // Default color
                                                backgroundColor: `${row?.isInActiveTemporary ? "#515ae3" :renderStatus(row.status).color}`, // Default background color
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {row?.isInActiveTemporary ? "TẠM NGƯNG HOẠT ĐỘNG" : renderStatus(row.status).name}
                                        </span>
                                        
                                    </div>
                                ),
                            },
                            {
                                accessor: 'action',
                                title: 'Hành Động',
                                cellsStyle: { textAlign: 'center' },
                                titleStyle: { textAlign: 'center' },
                                render: (record) => (
                                    <div className="flex justify-center">
                                        <MenuDropdown
                                            setModal17={setModal17}
                                            isHomestay={true}
                                            setIsUpdate={setIsUpdate}
                                            id={record.id}
                                            data={record}
                                            selected={setSelectedHomestay}
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

export default MultiColumn;
