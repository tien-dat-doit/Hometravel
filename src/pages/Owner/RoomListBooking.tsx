import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconBell from '../../components/Icon/IconBell';
import Carousel from 'react-material-ui-carousel';
import IconPencil from '../../components/Icon/IconPencil';
import IconLockDots from '../../components/Icon/IconLockDots';
import MenuDropdown from '../Components/MenuDropdown';
import ModalUpdate from '../Components/ModalUpdate';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconUser from '../../components/Icon/IconUser';
import IconPhone from '../../components/Icon/IconPhone';
import TableRoom from '../Components/TableRoom';
import useAuth from '../../hook/useAuth';
import homestayAPI from '../../util/homestayAPI';
import roomAPI from '../../util/roomAPI';

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
    status: string[];
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

const MultiColumn = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Phòng'));
    });
    const { auth }: any = useAuth();
    const [filterHomestayObject, setFilterHomestayObject] =
        useState<filterHomestayObject>({
            pageIndex: 1,
            pageSize: 100,
            name: '',
            ownerId: auth?.user?.id,
            status: ["ACTIVE"],
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
    }, []);
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

    const [isUpdate, setIsUpdate] = useState(false);

    // const [tabs, setTabs] = useState<string>('room-all');
    // const toggleTabs = (name: string) => {
    //     setTabs(name);
    // };

    return (
        <div>
            <ModalUpdate
                modal17={isUpdate}
                setModal17={setIsUpdate}
                isHomestay={false}
            />
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Danh Sách Đặt Phòng
                    </h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <div className="relative mt-4 flex items-center">
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
                </div>
                <div className="pt-5">
                    {/* <div>
                        <ul className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('room-all')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'room-all' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconHome />
                                    Tất Cả Phòng
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('room-available')}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'room-available' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconDollarSignCircle />
                                    Phòng Trống
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() =>
                                        toggleTabs('room-unavailable')
                                    }
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'room-unavailable' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="h-5 w-5" />
                                    Phòng Đã Đặt
                                </button>
                            </li>
                        </ul>
                    </div> */}
                    {/* {tabs === 'room-all' ? ( */}
                    <TableRoom
                        filterRoomObject={filterRoomObject}
                        setFilterRoomObject={setFilterRoomObject}
                        setIsUpdate={setIsUpdate}
                    />
                    {/* ) : (
                        ''
                    )} */}
                    {/* {tabs === 'room-available' ? (
                        <TableRoom
                            filterRoomObject={filterRoomObject}
                            setFilterRoomObject={setFilterRoomObject}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )}
                    {tabs === 'room-unavailable' ? (
                        <TableRoom
                            filterRoomObject={filterRoomObject}
                            setFilterRoomObject={setFilterRoomObject}
                            setIsUpdate={setIsUpdate}
                        />
                    ) : (
                        ''
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default MultiColumn;
