import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import MenuDropdown from '../Components/MenuDropdown';
import roomAPI from '../../util/roomAPI';
import moment from 'moment';
import IconEye from '../../components/Icon/IconEye';
import bookingAPI from '../../util/bookingAPI';
import useAuth from '../../hook/useAuth';
import IconCalendar from '../../components/Icon/IconCalendar';
import { useNavigate } from 'react-router-dom';

// interface roomObject {
//     id: string;
//     name: string;
//     numberOfBeds: number;
//     acreage: number;
//     capacity: number;
//     price: number;
//     status: string;
//     weekendPrice: number;
//     homeStayId: string;
//     roomAmenitieTitles: null | string[];
//     images: null | imageRoom[];
//     homeStay: {
//         id: string;
//         name: string;
//         acreage: number;
//         city: string;
//         district: string;
//         commune: string;
//         street: string;
//         house: string;
//         hamlet: string;
//         address: string;
//         checkInTime: string;
//         checkOutTime: string;
//         description: string;
//         totalCapacity: string;
//         status: string;
//         createdDate: string;
//         ownerId: string;
//     };
// }
interface roomObject {
    id: string;
    name: string;
    numberOfBeds: number;
    acreage: number;
    capacity: number;
    price: number;
    status: string;
    weekendPrice: number;
    rejectReason: string;
    homeStayId: string;
    roomStatus: {
        id: string;
        startDate: string;
        endDate: string;
        status: string;
        roomId: string;
    };
    images: imageObject[];
}
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
interface imageObject {  
            id: string
            url: string
            roomId: string  
}
interface TableRoomProps {
    filterRoomObject: filterRoomObject;
    setFilterRoomObject: Dispatch<SetStateAction<filterRoomObject>>;
    setIsUpdate: (data: boolean) => void;
}

const TableRoom: React.FC<TableRoomProps> = ({
    filterRoomObject,
    setFilterRoomObject,
    setIsUpdate,
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Phòng'));
    });
    const navigate = useNavigate()
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [recordsRoomData, setRecordsRoomData] = useState<roomObject[]>(); 
    useEffect(() => {
        const fetchListRoomsOfHomestay = async () => {
            try {
                const response: any =
                    await roomAPI.getBookedRecent(filterRoomObject);
                console.log(response.data);
                setRecordsRoomData(response.data ?? []);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 10);
            } catch (error) {
                console.log('Error in get all rooms of homestay', error);
            }
        };
        if (filterRoomObject.homeStayId) {
            fetchListRoomsOfHomestay();
        }
    }, [filterRoomObject]);
    const handlePageChange = (p: any) => {
        setFilterRoomObject({ ...filterRoomObject, pageIndex: p });
    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterRoomObject({ ...filterRoomObject, pageSize: p, pageIndex: 1 });
    };
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
    //                 item.acreage.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.status
    //                     .toString()
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase()) ||
    //                 item.numberBed
    //                     .toString()
    //                     .toLowerCase()
    //                     .includes(search.toLowerCase())
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

    return (
        <div>
            <div className="datatables">
                <DataTable
                    highlightOnHover
                    className="table-hover whitespace-nowrap"
                    records={recordsRoomData}
                    noRecordsText='Không Có Thông Tin !!!'
                    height={
                        recordsRoomData && recordsRoomData?.length < 3
                            ? 600
                            : '100%'
                    }
                    columns={[
                        {
                            accessor: 'name',
                            title: 'Tên Phòng',
                            render: (record, index) => (
                                <div className="flex w-max items-center">
                                    <Carousel
                                        sx={{
                                            margin: 'auto',
                                            width: '120px', // Đặt chiều rộng cố định cho carousel
                                            border: 'none',
                                            borderRadius: '8px',
                                        }}
                                        indicatorContainerProps={{
                                            style: {
                                                zIndex: 1,
                                                marginTop: '-24px',
                                                position: 'relative',
                                            },
                                        }}
                                    >
                                        {record?.images &&
                                            record?.images?.map((r) => (
                                                <img
                                                    key={r.id}
                                                    height="345"
                                                    src={r.url}
                                                    alt="img"
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '100%', // Đặt chiều rộng của hình ảnh để nó đầy đủ trong carousel
                                                        height: '100px', // Đặt chiều cao cố định cho hình ảnh
                                                    }}
                                                />
                                            ))}
                                    </Carousel>
                                    <div className="ml-2 flex flex-col">
                                        <div className="font-semibold text-blue-700">
                                            <p>
                                                {index +
                                                    1 +
                                                    (page - 1) * pageSize}
                                            </p>
                                        </div>
                                        <div className="mt-1 font-bold">
                                            {record.name}
                                        </div>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            accessor: 'numberOfBeds',
                            title: 'Số Lượng Giường',
                            cellsStyle: { textAlign: 'center' },
                            titleStyle: { textAlign: 'center' },
                            render: (record) => (
                                <span>{record.numberOfBeds}</span>
                            ),
                        },
                        {
                            accessor: 'price',
                            title: 'Giá Phòng',
                            cellsStyle: { textAlign: 'center' },
                            titleStyle: { textAlign: 'center' },
                            render: (record) => (
                                <span>
                                    {record.price?.toLocaleString()} vnđ
                                </span>
                            ),
                        },
                        {
                            accessor: 'weekendPrice',
                            title: 'Giá Phòng Cuối Tuần',
                            cellsStyle: { textAlign: 'center' },
                            titleStyle: { textAlign: 'center' },
                            render: (record) => (
                                <span>
                                    {record.weekendPrice?.toLocaleString()} vnđ
                                </span>
                            ),
                        },
                        {
                            accessor: 'timeRange',
                            title: 'Ngày Đặt Gần Nhất',
                            cellsStyle: { textAlign: 'center' },
                            titleStyle: { textAlign: 'center' },
                            render: (row) => (
                                <span>
                                    {row?.roomStatus?.startDate
                                        ? moment(
                                              row?.roomStatus?.startDate,
                                          ).format('DD/MM/YYYY') +
                                          ' - ' +
                                          moment(
                                              row?.roomStatus?.endDate,
                                          ).format('DD/MM/YYYY')
                                        : 'Chưa có thông tin'}
                                </span>
                            ),
                        },                     
                        {
                            accessor: 'action',
                            title: 'Lịch',
                            cellsStyle: { textAlign: 'center' },
                            titleStyle: { textAlign: 'center' },
                            render: (row) => (
                                <div className="flex justify-center">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/booking-calendar/${row?.id}`,
                                            )
                                        }
                                    >
                                        <IconCalendar />
                                    </button>
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
    );
};

export default TableRoom;
