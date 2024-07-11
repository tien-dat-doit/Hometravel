import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconBook from '../../components/Icon/IconBook';
import IconEye from '../../components/Icon/IconEye';
import ModalUpdateTouristContract from '../Components/ModalUpdateTouristContract';
import homestayAPI from '../../util/homestayAPI';
import useAuth from '../../hook/useAuth';
import { toast } from 'react-toastify';
import bookingAPI from '../../util/bookingAPI';
import moment from 'moment';
import ModalViewPDF from '../Components/ModalViewPDF';

// declare for homestay
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
    checkInTime: string;
    checkOutTime: string;
    totalCapacity: number;
    createdDate: string;
    description: string;
    status: string;
    licenseFile: string
    contractTouristFile: string
    homeStayGeneralAmenitieTitles: [];
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
    roomAmenitieTitles: null | string[];
    images: null | imageRoom[];
    homeStay: {
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
        checkInTime: string;
        checkOutTime: string;
        description: string;
        totalCapacity: string;
        status: string;
        createdDate: string;
        ownerId: string;
    };
}

interface filterHomestayObject {
    pageIndex: number;
    pageSize: number;
    name: string;
    ownerId: string;
    status: string;
}
// declare for room

interface imageRoom {
    id: string;
    url: string;
    roomId: string;
    homeStayId: null | string;
}
interface filterRoomObject {
    pageIndex: number;
    pageSize: number;
    name: string;
    homeStayId: string | null;
    status: string | null;
}
interface filterObject {
    pageIndex: number;
    pageSize: number;
    name: string | null;
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


const ContractManagement = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Contract Management'));
    });
    const { auth }: any = useAuth();
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 10,
        name: null
    });
    const [recordsData, setRecordsData] = useState<bookingObject[] | []>([]);
    const [filterHomestayObject, setFilterHomestayObject] =
        useState<filterHomestayObject>({
            pageIndex: 1,
            pageSize: 100,
            name: '',
            ownerId: auth?.user?.id,
            status: 'ACTIVE',
        });
    const [recordsHomestayData, setRecordsHomestayData] = useState<
        homeStay[] | []
    >([]);
    const [filterRoomObject, setFilterRoomObject] = useState<filterRoomObject>({
        pageIndex: 1,
        pageSize: 10,
        name: '',
        homeStayId: '',
        status: null,
    });
    useEffect(() => {
        const fetchListHomestay = async () => {
            try {
                const response: any =
                    await homestayAPI.getAll(filterHomestayObject);
                setRecordsHomestayData(response.data ?? []);
                setFilterRoomObject({
                    ...filterRoomObject,
                    homeStayId: response?.data[0]?.id ?? '',
                });
                setSelectedHomestay(response?.data[0]);
            } catch (error) {
                console.log('Error in get all homestay', error);
            }
        };
        fetchListHomestay();
    }, [filterHomestayObject]);
    useEffect(() => {
        const fetchListBookingForOwner = async () => {
            try {
                const response: any = await bookingAPI.getAll(
                   filterObject,
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
    }, [filterObject]);
    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
    };
    const [searchResultsHomestay, setSearchResultsHomestay] = useState<
        homeStay[]
    >([]);
    const [selectedHomestay, setSelectedHomestay] = useState<homeStay>({
        id: '',
        name: '',
        acreage: 250,
        city: 'Đà Lạt',
        district: 'Lâm Đồng',
        commune: 'Phường 6',
        street: 'Ngô Quyền',
        house: '',
        hamlet: '',
        address: '133 Ngô Quyền',
        checkInTime: '',
        checkOutTime: '',
        description: '',
        totalCapacity: 0,
        status: '',
        createdDate: '',
        ownerId: '',
        contractTouristFile:"",
        licenseFile:"",
        homeStayGeneralAmenitieTitles: [],
        rooms: [
            {
                id: '',
                name: '',
                numberOfBeds: 1,
                acreage: 30,
                capacity: 2,
                price: 230000,
                status: 'ACTIVE',
                weekendPrice: 250000,
                homeStayId: '',
                roomAmenitieTitles: [],
                images: [],
                homeStay: {
                    id: '',
                    name: '',
                    acreage: 250,
                    city: '',
                    district: '',
                    commune: '',
                    street: '',
                    house: '',
                    hamlet: '',
                    address: '',
                    checkInTime: '',
                    checkOutTime: '',
                    description: '',
                    totalCapacity: '',
                    status: 'ACTIVE',
                    createdDate: '',
                    ownerId: '',
                },
            },
        ],
        images: [
            {
                id: '',
                url: '',
                roomId: '',
                homeStayId: '',
            },
        ],
    });
    const [showOption, setShowOption] = useState<Boolean>(false);
    const handleInputChange = (event: any) => {
        const term = event.target.value;
        setShowOption(true);
        if (typeof term === 'string') {
            setSelectedHomestay({ ...selectedHomestay, name: term });
        }
        const filteredResults = recordsHomestayData.filter((option) =>
            option?.name.includes(term),
        );
        setSearchResultsHomestay(filteredResults);
    };

    const handleResultClick = (result: homeStay) => {
        setSelectedHomestay(result);
        setFilterRoomObject({ ...filterRoomObject, homeStayId: result.id });
        setShowOption(false);
    };
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

    // useEffect(() => {
    //     setPage(1);
    // }, [pageSize]);

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
    //                 item.contractFile
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase()) ||
    //                 item.email.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.age
    //                     .toString()
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase()) ||
    //                 item.innitiatedDate
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase()) ||
    //                 item.phone.toLowerCase().includes(search.toLowerCase())
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

    // const formatDate = (date: any) => {
    //     if (date) {
    //         const dt = new Date(date);
    //         const month =
    //             dt.getMonth() + 1 < 10
    //                 ? '0' + (dt.getMonth() + 1)
    //                 : dt.getMonth() + 1;
    //         const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
    //         return day + '/' + month + '/' + dt.getFullYear();
    //     }
    //     return '';
    // };

    const navigate = useNavigate();
    const [isShowUpdate, setIsShowUpdate] = useState(false);
    const [isShowPDF, setIsShowPDF] = useState(false);
    return (
        <div>
            <ModalUpdateTouristContract
                modal17={isShowUpdate}
                setModal17={setIsShowUpdate}
                data={selectedHomestay}
                setFilterObject={setFilterHomestayObject}
                />
            {selectedHomestay && <ModalViewPDF modal17={isShowPDF}
                setModal17={setIsShowPDF}
                data={selectedHomestay}/>}
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-extrabold dark:text-white-light">
                        Hợp Đồng Du Lịch Khách Hàng
                    </h5>
                    
                </div>
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    {/* <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setIsShowUpdate(true)}
                    >
                        <IconBook className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                        Cập Nhật Hợp Đồng
                    </button> */}
                    <a className="flex items-center rounded bg-rose-400 px-4 py-2 font-bold text-white hover:bg-rose-500"
                    // onClick={()=>setIsShowPDF(true)}
                    href={selectedHomestay?.contractTouristFile}
                    target='_blank'
                    >
                                        <IconEye className="mr-2" /> Xem Hợp Đồng
                                    </a>
                    <div className="ltr:ml-auto rtl:mr-auto flex items-center gap-3">
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <div className="relative flex items-center">
                            <label
                                htmlFor="city"
                                className="mb-0 ml-4 w-1/3 ltr:mr-2 rtl:ml-2"
                            >
                                Chọn Homestay
                            </label>
                            <div>
                                <input
                                    className="form-input w-2/3 lg:w-[250px]"
                                    id="city"
                                    type="text"
                                    placeholder="Chọn Homestay"
                                    value={selectedHomestay?.name}
                                    onFocus={() => {
                                        setShowOption(true);
                                        setSearchResultsHomestay(
                                            recordsHomestayData,
                                        );
                                    }}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                />
                                <div
                                    id="searchResults"
                                    className={`absolute left-[50] top-full z-10 mt-2 max-h-[250px] min-w-[250px] max-w-[440px] overflow-y-scroll rounded-md border bg-white ${
                                        showOption ? '' : 'hidden'
                                    }`}
                                >
                                    {searchResultsHomestay.length === 0 && (
                                        <div className="text-center">
                                            Không Kết Quả Tìm Kiếm Phù Hợp
                                        </div>
                                    )}
                                    {searchResultsHomestay.length > 0 &&
                                        searchResultsHomestay.map((result) => (
                                            <div
                                                key={result.id}
                                                className=" cursor-pointer p-2 hover:bg-gray-100"
                                                onClick={() =>
                                                    handleResultClick(result)
                                                }
                                            >
                                                {result.name}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                        <div>
                        <input
                            type="text"
                            className="form-input w-auto lg:w-[240px]"
                            placeholder="Tìm kiếm tên khách hàng..."               
                            value={filterObject?.name ?? ""}
                            onChange={(e) => setFilterObject((prev)=>({...prev, name: e.target.value}))}
                        />
                        </div>
                        
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="table-hover whitespace-nowrap"
                        records={recordsData}
                        height={recordsData?.length < 3 ? 600 : "100%"}
                        columns={[
                            {
                                accessor: 'id',
                                title: 'STT',
                                cellsStyle:{textAlign:"center"}, titleStyle:{textAlign:"center"},
                                render: (record, index) => {
                                    return (
                                        <span>
                                            {index + 1 + (page - 1) * pageSize}
                                        </span>
                                    );
                                },
                            },
                            {
                                accessor: 'firstName',
                                title: 'Tên Khách Hàng',
                                cellsStyle:{textAlign:"center"}, titleStyle:{textAlign:"center"},
                                render: (record) => (
                                    <div className="flex w-max items-center">
                                        <img
                                            className="h-9 w-9 rounded-full object-cover ltr:mr-2 rtl:ml-2"
                                            src={record?.tourist?.avatar}
                                            alt=""
                                        />
                                        <div>{record?.tourist?.lastName + ' ' + record?.tourist?.firstName}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'createdDate',
                                title: 'Ngày Khởi Tạo',
                                cellsStyle:{textAlign:"center"}, titleStyle:{textAlign:"center"},
                                render: (record) => (
                                    <div>{moment(record?.createdDate).format("DD/MM/YYYY")}</div>
                                ),
                            },
                            { accessor: 'email', cellsStyle:{textAlign:"center"}, titleStyle:{textAlign:"center"},
                            render: (record) => (
                                <span>{record?.tourist?.email}</span>
                            ), },
                            {
                                accessor: 'phone',
                                title: 'Số Điện Thoại',
                                cellsStyle:{textAlign:"center"}, titleStyle:{textAlign:"center"},
                                render: (record) => (
                                    <span>{record?.tourist?.phoneNumber}</span>
                                ),

                            },
                            // {
                            //     accessor: 'contractFile',
                            //     title: 'Hợp Đồng',
                            //     
                            //     render: () => (
                            //         <button className="flex items-center rounded bg-rose-400 px-4 py-2 font-bold text-white hover:bg-rose-500">
                            //             <IconEye className="mr-2" /> Hợp Đồng
                            //         </button>
                            //     ),
                            // },
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
                            `Showing  ${from} to ${to} of ${totalRecords} entries`
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default ContractManagement;
