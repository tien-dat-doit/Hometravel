import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import MenuDropdown from '../Components/MenuDropdown';
import ModalUpdate from '../Components/ModalUpdate';
import roomAPI from '../../util/roomAPI';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import IconPlus from '../../components/Icon/IconPlus';

interface roomObject {
    id: string;
    numberOfBeds: number;
    name: string;
    acreage: number;
    capacity: number;
    price: number;
    status: string;
    weekendPrice: number;
    homeStayId: string;
    rejectReason: string
    startDateInActiveTemporary: string
    endDateInActiveTemporary: string
    images: imageRoom[];
}

interface imageRoom {
    id: string;
    url: string;
    roomId: string;
    homeStayId: null | string;
}

interface filterObject {
    pageIndex: number;
    pageSize: number;
    name: string;
    homeStayId: string | undefined;
    status: string 
}
const MultiColumn = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Phòng'));
    });
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 10,
        name: '',
        homeStayId: id,
        status:"ACTIVE"
    });
    const [recordsData, setRecordsData] = useState<roomObject[] | []>([]);
    const [selectedRoom, setSelectedRoom] = useState<roomObject | undefined>()
    const renderStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return { name: 'HOẠT ĐỘNG', color: '#1b5e20' };
            case 'INACTIVE TEMPORARY':
                return { name: 'TẠM NGƯNG HOẠT ĐỘNG', color: '#515ae3' };
            case 'INACTIVE':
                return { name: 'NGƯNG HOẠT ĐỘNG', color: '#515ae2' };
            case 'PENDING':
                return { name: 'CHỜ DUYỆT', color: '#ea8213' };
            case 'CANCELLED':
                return { name: 'TỪ CHỐI', color: '#ef3f3f' };
            default:
                return { name: 'CHƯA XÁC ĐỊNH', color: 'black' };
        }
    };
    useEffect(() => {
        const fetchListRoomsOfHomestay = async () => {
            try {
                const response: any = await roomAPI.getAll(filterObject);
                console.log(response.data);
                setRecordsData(response.data ?? []);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 10);
            } catch (error) {
                console.log('Error in get all rooms of homestay', error);
            }
        };
        if (id) {
            fetchListRoomsOfHomestay();
        }
    }, [filterObject, id]);
    const handleSearchByName = (e: any) => {
        setFilterObject({ ...filterObject, name: e.target.value });
    };
    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
    };
    const [isUpdate, setIsUpdate] = useState(false);
    const navigate = useNavigate()
    return (
        <div>
            <ModalUpdate
                modal17={isUpdate}
                setModal17={setIsUpdate}
                isHomestay={false}
                data={selectedRoom}           
                setFilterObject= {setFilterObject}
            />
            <div className="panel mt-6">
                <div className="mb-3 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Danh Sách Phòng
                    </h5>
                   
                    <div className="flex justify-between ltr:ml-auto rtl:mr-auto">
                       
                        <>
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
                                    setFilterObject((prev: any) => ({
                                        ...prev,
                                        status: e.target.value
                                    }));
                                }}
                                value={filterObject.status ?? "ACTIVE"}
                            >
                            
                                <option value="ACTIVE">HOẠT ĐỘNG</option>
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
                            placeholder="Tìm kiếm tên phòng..."
                            value={filterObject.name}
                            onChange={handleSearchByName}
                        />
                        </>
                    </div>
                    
                </div>
                <div className='mb-5'>
                        <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate(`/addroom/${id}`)}
                    >
                        <IconPlus className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                        Thêm Phòng Mới
                    </button>
                        </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="table-hover whitespace-nowrap"
                        records={recordsData}
                        height={recordsData?.length < 3 ? 600 : "100%"}
                        columns={[
                            {
                                accessor: 'firstName',
                                title: 'Tên Phòng',

                                render: ({ images, name, id }, index) => (
                                    <div className="flex w-max items-center">
                                        {images.length > 0 && (
                                            <Carousel
                                                sx={{
                                                    margin: 'auto',
                                                    width: '120px',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    height: '100px',
                                                }}
                                            >
                                                {images.map((i, index) => (
                                                    <img
                                                        key={index}
                                                        src={i.url}
                                                        alt="img"
                                                        style={{
                                                            objectFit: 'cover',
                                                            minHeight: '100px',
                                                        }}
                                                    />
                                                ))}
                                            </Carousel>
                                        )}
                                        <div className="ml-2 flex flex-col">
                                            <div className="mt-1 font-bold">
                                                {name}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'numberOfBeds',
                                title: 'Số Lượng Giường',
                                cellsStyle:{textAlign:"center"}, 
                                 titleStyle:{textAlign:"center"},
                            },
                            {
                                accessor: 'acreage',
                                title: 'Diện Tích Phòng',
                                cellsStyle:{textAlign:"center"}, 
                                 titleStyle:{textAlign:"center"},
                                render: (rowData) => {
                                    return (
                                        <span>
                                            {rowData.acreage}m<sup>2</sup>
                                        </span>
                                    );
                                },
                            },
                            {
                                accessor: 'capacity',
                                title: 'Sức Chứa',
                                cellsStyle:{textAlign:"center"}, 
                                 titleStyle:{textAlign:"center"},
                                render: (rowData) => {
                                    return (
                                        <span>{rowData.capacity} Người</span>
                                    );
                                },
                            },
                            {
                                accessor: 'price',
                                title: 'Giá Phòng',
                                cellsStyle:{textAlign:"center"}, 
                                 titleStyle:{textAlign:"center"},
                                render: (rowData) => {
                                    return (
                                        <span>
                                            {rowData.price?.toLocaleString()}{' '}
                                            vnđ
                                        </span>
                                    );
                                },
                            },
                            {
                                accessor: 'weekendPrice',
                                title: 'Giá Cuối Tuần',
                                cellsStyle:{textAlign:"center"}, 
                                titleStyle:{textAlign:"center"},
                                render: (rowData) => {
                                    return (
                                        <span>
                                            {rowData.weekendPrice?.toLocaleString()}{' '}
                                            vnđ
                                        </span>
                                    );
                                },
                            },
                            {
                                accessor: 'status',
                                title: 'Trạng Thái',
                                cellsStyle:{textAlign:"center"}, 
                                titleStyle:{textAlign:"center"},
                                render: (row) => (
                                    <div className={row?.status === "INACTIVE TEMPORARY" ? 'flex justify-center flex-col items-center': ""}>
                                        <span
                                            style={{
                                                color: 'white', // Default color
                                                backgroundColor: `${renderStatus(row.status).color}`, // Default background color
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {renderStatus(row.status).name}
                                        </span>
                                        {row?.status ===
                                            'INACTIVE TEMPORARY' && (
                                            <div className="text-sm">
                                                {moment(
                                                    row?.startDateInActiveTemporary,
                                                ).format('DD/MM/YYYY') +
                                                    ' - ' +
                                                    moment(
                                                        row?.endDateInActiveTemporary,
                                                    ).format('DD/MM/YYYY')}
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'action',
                                title: 'Hành Động',
                                cellsStyle:{textAlign:"center"}, 
                                titleStyle:{textAlign:"center"},
                                render: (record) => (
                                    <div className='flex justify-center'>
                                        <MenuDropdown
                                            isHomestay={false}
                                            setIsUpdate={setIsUpdate}
                                            id={record.id}
                                            data = {record}
                                            selected = {setSelectedRoom}
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
                            `Showing  ${from} to ${to} of ${totalRecords} entries`
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default MultiColumn;
