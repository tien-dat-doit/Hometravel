import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState,useContext } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import ModalUpdate from '../../Components/ModalUpdate';
import { useNavigate, useLocation } from 'react-router-dom';
import ModalDisable from '../../Components/ModalDisable';
import homestayAPI from '../../../util/homestayAPI';
import useAuth from '../../../hook/useAuth';
import userAPI from '../../../util/userAPI';
import { Rating } from 'react-simple-star-rating';
import { UpdateContext } from '../../../context/UpdateContext';
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
    rating: number;
    contractFile: string;
    licenseFile: string;
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
interface Users {
    id: string;
    email: string;
    firstName: string;
    lastName: string ;
}
interface filterObject {
    pageIndex: number;
    pageSize: number;
    name: string;
    // ownerId: string;
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
    const location = useLocation();
    const [isUpdate2, setIsUpdate2] = useState(location.state?.isUpdate3);
    const { isUpdate, setIsUpdate } = useContext(UpdateContext);
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [isShowUpdate, setIsShowUpdate] = useState(false);
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 10,
        name: '',
        status: ['ACTIVE', 'INACTIVE TEMPORARY', 'INACTIVE', 'PENDING', 'CANCELLED', 'DISABLE'],
        sortKey: "CreatedDate",
        sortOrder: "DESC"
    });
    const [loading, setLoading] = useState(true);
    const [recordsData, setRecordsData] = useState<homeStay[] | []>([]);
    useEffect(() => {
        const fetchListHomestay = async () => {
            try {
                const response: any = await homestayAPI.getAll(filterObject);
                setRecordsData(response.data ?? []);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 10);
                setLoading(false);
                setIsUpdate(false);
            } catch (error) {
                console.log('Error in get all homestay', error);
            }
        };
        fetchListHomestay();
    }, [filterObject,isUpdate2,isUpdate]);

    const [modal17, setModal17] = useState(false);
    const [isUpdate3, setIsUpdate3] = useState(false);
    const handleSearchHomestay = (e: any) => {
        setFilterObject({ ...filterObject, name: e.target.value, pageIndex: 1});
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
            <ModalDisable modal17={modal17} setModal17={setModal17} />
            <ModalUpdate
                modal17={isUpdate3}
                setModal17={setIsUpdate3}
                isHomestay={true}
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
                                    // console.log(e.target.value);
                                    setFilterObject((prev)=>({...prev, status: e.target.value === "ALL" ? ['ACTIVE', 'INACTIVE TEMPORARY', 'INACTIVE', 'PENDING', 'CANCELLED', 'DISABLE'] : [e.target.value], pageIndex: 1,}));
                                    
                                }}
                                value={filterObject?.status?.length > 1 ? "ALL" : filterObject?.status[0]}
                            >
                                <option value="ALL">Tất cả Homestay</option>
                                <option value="ACTIVE">Hoạt động</option>
                                <option value="PENDING">
                                Chờ kiểm duyệt
                                </option>
                                <option value="INACTIVE TEMPORARY">
                                    Tạm ngưng hoạt động
                                </option>
                                <option value="INACTIVE">
                                    Ngưng hoạt động
                                </option>
                                <option value="INACTIVE TEMORARY">
                                    Tạm ngưng hoạt động
                                </option>
                                <option value="DISABLE">
                                    Vô hiệu hóa
                                </option>
                            </select>
                        </div>
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Tìm kiếm"
                            value={filterObject.name}
                            onChange={handleSearchHomestay}
                        />
                    </div>
                    {/* <Filters></Filters> */}
                </div>
                <div className="datatables">
                {loading ? (
                    <div className='text-center'>
                        <span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>
                        </div>
                    ) : (
                    <DataTable
                        highlightOnHover
                        className="table-hover "
                        records={recordsData}
                        noRecordsText="Không có Homestay"
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
                                accessor: 'name',
                                title: 'Tên Homestay',
                                //sortable: true,
                                render: ({ name, images, id }, index) => (
                                    <div className="flex w-max items-center" >
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

                                        <div className="ml-2 flex flex-col" style={{whiteSpace: 'pre-wrap', 
                                        maxWidth: '200px',
                                    }}>
                                            <div  
                                                className="mt-1 cursor-pointer font-bold"
                                                // onClick={() =>
                                                //     navigate(
                                                //         `/danh-sach-phong/${id}`,
                                                //     )
                                                // }
                                            >
                                                {name}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'numberOfRoom',
                                title: 'Số Phòng',
                                render: ({ rooms }) => (
                                    <div className='text-center'>{rooms?.length}</div>
                                ),
                            },
                            {
                                accessor: 'Chủ Homestay',
                                title: 'Chủ Homestay',
                                render: (rowData) => {
                                    const [ownerName, setOwnerName] = useState('');

                                    useEffect(() => {
                                        const fetchOwnerName = async () => {
                                            const response = await userAPI.getOwnerID(rowData.ownerId);
                                            setOwnerName(response.data.lastName + ' ' + response.data.firstName);
                                        };
                            
                                        fetchOwnerName();
                                    }, [rowData.ownerId]);
                                    return (
                                        <span>
                                            {ownerName}
                                        </span>
                                    );
                                },
                            },
                            {
                                accessor: 'rating',
                                title: 'Đánh giá',
                                render: ({rating}) => {
                                    return (
                                        <div className="flex h-auto flex-col">
                                                    {rating !== undefined  && (
                                                        <Rating
                                                            initialValue={
                                                                rating
                                                            }
                                                            size={20}
                                                            fillColor="#f1a545" // Màu sắc của sao được chọn (tuỳ chọn)
                                                            emptyColor="#cccccc"
                                                            iconsCount={5}
                                                            allowFraction={true}
                                                            readonly={true}
                                                            SVGclassName={
                                                                'inline-block'
                                                            }
                                                        />
                                                    )}
                                                </div>
                                    );
                                },
                            },
                            {
                                accessor: 'address',
                                title: 'Địa Chỉ',
                                render: ({
                                    city,
                                    commune,
                                    street,
                                    address,
                                }) => (
                                <div style={{ whiteSpace: 'pre-wrap', maxWidth: '250px' }}
                                    >
                                        {street
                                            ? address +
                                            ' ' +
                                            street +
                                            ', ' +
                                            city
                                            : address + ', ' + city}
                                    </div>
                                ),
                            },

                            {
                                accessor: 'status',
                                title: 'Trạng Thái',
                                // sortable: true,

                                render: (row) => (
                                    <span>
                                        {row.status === 'ACTIVE' && (
                                            <div style={{ minWidth: '60'} } className='badge badge-outline-success p-1.5 text-center'>
                                                Hoạt Động
                                            </div>
                                        )}
                                        {row.status === 'INACTIVE' && (
                                                    <div style={{ minWidth: '60'} }
                                                        className='badge badge-outline-danger p-1.5 text-center'
                                                    >
                                                        Ngưng Hoạt động
                                                    </div>
                                        )}
                                        {row.status === 'INACTIVE TEMPORARY' && (
                                                    <div style={{ minWidth: '60'} }
                                                        className='badge badge-outline-warning p-1.5 text-center'
                                                    >
                                                        Tạm ngưng hoạt động
                                                    </div>
                                        )}
                                        {row.status === 'PENDING' && (
                                                    <div style={{ minWidth: '60'} }
                                                        className='badge badge-outline-info p-1.5 text-center'
                                                    >
                                                        Chờ kiểm duyệt
                                                    </div>
                                        )}
                                        {row.status === 'SELF-CANCELLED' && (
                                                    <div style={{ minWidth: '60'} }
                                                        className='badge badge-outline-secondary p-1.5 text-center'
                                                    >
                                                        Ngưng kiểm duyệt
                                                    </div>
                                        )}
                                        {row.status === 'CANCELLED' && (
                                                    <div style={{ minWidth: '60'} } 
                                                        className='badge badge-outline-secondary p-1.5 text-center'
                                                    >
                                                        Từ chối
                                                    </div>
                                        )}
                                        {row.status === 'DISABLE' && (
                                                    <div style={{ minWidth: '60'} }
                                                        className='badge badge-outline-warning p-1.5 text-center'
                                                    >
                                                        Vô hiệu hóa
                                                    </div>
                                        )}
                                    </span>
                                ),
                            },
                            
                        ]}
                        onRowClick={({ id }) =>
                            navigate(`/managehomestay/${id}`)
                        }
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
                )}
                </div>
            </div>
        </div>
    );
};

export default MultiColumn;
