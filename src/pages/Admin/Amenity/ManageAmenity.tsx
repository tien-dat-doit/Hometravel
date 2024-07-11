import { Fragment, useEffect, useState,useContext } from 'react';
import { UpdateContext } from '../../../context/UpdateContext';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconBell from '../../../components/Icon/IconBell';
import IconCode from '../../../components/Icon/IconCode';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import IconAirplay from '../../../components/Icon/IconAirplay';
import IconBox from '../../../components/Icon/IconBox';
import IconLayout from '../../../components/Icon/IconLayout';
import AnimateHeight from 'react-animate-height';
import amenityAPI from '../../../util/amenityAPI';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import ModalDisable from '../../Components/ModalDisable';
import ModalUpdate from '../../Components/ModalUpdate';
import AddAmenity from './AddAmenity';
import AddAmenityGeneral from './AddAmenityGeneral';
import UpdateAmenityGeneral from './UpdateAmenityGeneral';
import UpdateAmenity from './UpdateAmenity';
import AddMoreAmenity from './AddMoreAmenity';
import AddMoreAmenityGeneral from './AddMoreAmenityGeneral';
import IconPlusCircle from '../../../components/Icon/IconPlusCircle';
interface Amenities {
    id: string;
    name: string;
    status: string | null;
    amenitieTitleId: string;
}

interface AmenityTitleGeneral {
    id: string;
    name: string;
    generalAmenities: Amenities[];
}
interface Amenity {
    id: string;
    name: string;
    status: string | null;
    amenitieTitleId: string;
}

interface AmenityTitle {
    id: string;
    name: string;
    amenities: Amenity[];
}
const ManageAmenity = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Quản lý tiện ích'));
    });
    const [active2, setActive2] = useState<string>('');
    const togglePara2 = (value: string) => {
        setActive2((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    const [active, setActive] = useState<string>('');
    const togglePara = (value: string) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    const [modal17, setModal17] = useState(false);
    
    const [modal18, setModal18] = useState(false);
    const [modal19, setModal19] = useState(false);
    const [modal20, setModal20] = useState(false);
    const [modal21, setModal21] = useState(false);
    const [modal22, setModal22] = useState(false);

    const { isUpdate, setIsUpdate } = useContext(UpdateContext);
    useEffect(() => {
        if (!modal17 || !modal18 || !isUpdate) {
            // Reload the data here...
            // For example, if you're using axios to fetch data from an API:
            // axios.get('/api/amenities').then(response => setData(response.data));
        }
    }, [modal17, modal18, isUpdate]);
    const [recordsData, setRecordsData] = useState<AmenityTitleGeneral[] | []>([]);
    const [recordsAmenity, setRecordsAmenity] = useState<AmenityTitle[] | []>([]);
    useEffect(() => {
        const fetchAmenity = async () => {
            try {
                const response: any = await amenityAPI.getAllGeneralAmenity({ sortOrder: 'ASC',});
                setRecordsData(response.data);
                setIsUpdate(false);
            } catch (error) {
                console.log('Error in get general amenity', error);
            }
        };
        fetchAmenity();
        const fetchAmenityRoom = async () => {
            try {
                const response: any = await amenityAPI.getAllAmenity({ sortOrder: 'ASC',});
                setRecordsAmenity(response.data);
                setIsUpdate(false);
            } catch (error) {
                console.log('Error in get amenity', error);
            }
        };
        fetchAmenityRoom();
    }, [modal17, modal18, isUpdate]);
    const [currentPolicyTitle, setCurrentPolicyTitle] = useState(null);
    const handleEditClick = (amenityTitle : any) => {
        setCurrentPolicyTitle(amenityTitle);
        setModal19(true);
    };
    const [currentAmenityGeneralTitle, setCurrentAmenityGeneralTitle] = useState(null);
    const handleEditClick2 = (amenityTitleRoom : any) => {
        setCurrentAmenityGeneralTitle(amenityTitleRoom);
        setModal20(true);
    };
    const [currentAmenityGeneralTitleID, setCurrentAmenityGeneralTitleID] = useState({
        id: '',
        name: '',
        Amenities: [],
    });
    const handleEditClick3 = (amenityTitleRoom : any) => {
        setCurrentAmenityGeneralTitleID(amenityTitleRoom);
        setModal21(true);
    };
    const [currentAmenityGeneralTitleID4, setCurrentAmenityGeneralTitleID4] = useState({
        id: '',
        name: '',
        generalAmenities: [],
    });
    const handleEditClick4 = (amenityTitleRoom : any) => {
        setCurrentAmenityGeneralTitleID4(amenityTitleRoom);
        setModal22(true);
    };

    return (
        <div>
            <AddAmenity modal17={modal17} setModal17={setModal17} />
            <AddAmenityGeneral modal18={modal18} setModal18={setModal18} />
            <UpdateAmenityGeneral modal19={modal19} setModal19={setModal19} amenityTitle={currentPolicyTitle} />
            <UpdateAmenity modal19={modal20} setModal19={setModal20} amenityTitle1={currentAmenityGeneralTitle} />
            <AddMoreAmenity modal17={modal21} setModal17={setModal21} amenityTitle3={currentAmenityGeneralTitleID} />
            <AddMoreAmenityGeneral modal17={modal22} setModal17={setModal22} amenityTitle4={currentAmenityGeneralTitleID4} />
            
            <div className="space-y-8 pt-5">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Tiện ích chung  */}
                    <div className="panel" id="border_top">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">
                                Tiện ích chung cho Homestay
                            </h5>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setModal18(true)}
                            >
                                <IconBox className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                Thêm Mới
                            </button>
                        </div>
                        <div className="mb-5">
                            <div className="space-y-2 ">
                                {recordsData.map((amenityTitle, index) => {
                                    const count = index + 1;
                                    return (
                                        <div key={amenityTitle.id} className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]" >
                                            <Fragment>
                                                <div className='flex  justify-items-center'>
                                                    <button
                                                        type="button"
                                                        className={`p-4 font-bold  w-full flex items-center text-black-dark dark:bg-[#1b2e4b] ${active2 === String(count) ? '!text-primary' : ''}`}
                                                        onClick={() => togglePara2(String(count))}
                                                    >
                                                        <IconAirplay className="ltr:mr-2 rtl:ml-2 text-primary shrink-0" />
                                                        {amenityTitle.name}
                                                        <div className={`ltr:ml-auto rtl:mr-auto ${active2 === String(count) ? 'rotate-180' : ''}`}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <div className='dark:border-[#1b2e4b] text-justify w-100 text-white-dark' style={{ margin: 'auto' }}>
                                                            <Tippy content="Chỉnh sửa">
                                                                <button type="button" onClick={() =>  handleEditClick(amenityTitle)}>
                                                                    < IconPencilPaper className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                                </button>
                                                            </Tippy>
                                                    </div>
                                                    <div className='dark:border-[#1b2e4b] text-justify w-100 text-white-dark' style={{ margin: 'auto' }}>
                                                            <Tippy content="Thêm tiện ích">
                                                                <button type="button" onClick={() => handleEditClick4(amenityTitle)}>
                                                                    
                                                                    <IconPlusCircle className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                                </button>
                                                            </Tippy>
                                                    </div>
                                                </div>
                                                <div>
                                                    <AnimateHeight duration={300} height={active2 === String(count) ? 'auto' : 0}>
                                                        <div className="">
                                                            <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
                                                                {amenityTitle.generalAmenities.map((amenity) => (
                                                                    <div className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5">{amenity.name}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </Fragment>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {/* Tiện ích riêng  */}
                    <div className="panel" id="border_top">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">
                                Tiện ích riêng cho từng phòng
                            </h5>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setModal17(true)}
                            >
                                <IconBox className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                Thêm Mới
                            </button>
                        </div>
                        <div className="mb-5">
                            <div className="space-y-2 ">
                                {recordsAmenity.map((amenitTitleRoom, index) => {
                                    const count = index + 1;
                                    return (
                                        <div key={amenitTitleRoom.id} className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]" >
                                            <Fragment>
                                                <div className='flex  justify-items-center'>
                                                    <button
                                                        type="button"
                                                        className={`p-4 font-bold w-full flex items-center text-black-dark dark:bg-[#1b2e4b] ${active === String(count) ? '!text-primary' : ''}`}
                                                        onClick={() => togglePara(String(count))}
                                                    >
                                                        <IconAirplay className="ltr:mr-2 rtl:ml-2 text-primary shrink-0" />
                                                        {amenitTitleRoom.name}
                                                        <div className={`ltr:ml-auto rtl:mr-auto ${active === String(count) ? 'rotate-180' : ''}`}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <div className='dark:border-[#1b2e4b] text-justify w-100 text-white-dark' style={{ margin: 'auto' }}>
                                                        {/* <Link to="/edit"> */}
                                                            <Tippy content="Chỉnh sửa">
                                                                <button type="button" onClick={() => handleEditClick2(amenitTitleRoom)}>
                                                                    
                                                                    < IconPencilPaper className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                                </button>
                                                            </Tippy>
                                                        {/* </Link> */}
                                                    </div>
                                                    <div className='dark:border-[#1b2e4b] text-justify w-100 text-white-dark' style={{ margin: 'auto' }}>
                                                        {/* <Link to="/edit"> */}
                                                            <Tippy content="Thêm tiện ích">
                                                                <button type="button" onClick={() => handleEditClick3(amenitTitleRoom)}>
                                                                    
                                                                    <IconPlusCircle className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                                </button>
                                                            </Tippy>
                                                        {/* </Link> */}
                                                    </div>
                                                </div>
                                                <div>
                                                    <AnimateHeight duration={300} height={active === String(count) ? 'auto' : 0}>
                                                        <div className="">
                                                            <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
                                                                {amenitTitleRoom.amenities.map((amenityRoom) => (
                                                                    <div className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5">{amenityRoom.name}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </Fragment>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAmenity;
