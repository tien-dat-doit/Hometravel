import { Fragment, useEffect, useState,useContext } from 'react';
import { UpdateContext } from '../../../context/UpdateContext';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import IconAirplay from '../../../components/Icon/IconAirplay';
import IconBox from '../../../components/Icon/IconBox';
import IconLayout from '../../../components/Icon/IconLayout';
import AnimateHeight from 'react-animate-height';
import policyAPI from '../../../util/policyAPI';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useNavigate } from 'react-router-dom';
import AddPolicy from './AddPolicy';
import UpdatePolicy from './UpdatePolicy';
import IconPlusCircle from '../../../components/Icon/IconPlusCircle';
import AddMorePolicy from './AddMorePolicy';
interface Policy {
    id: string;
    description: string;
    subDescription: string;
    policyTitleId: string;
  }
  
  interface PolicyTitle {
    id: string;
    name: string;
    policies: Policy[];
  }
const ManageAmenity = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Quản lý chính sách'));
    });
    const [active, setActive] = useState<string>('');
    const togglePara = (value: string) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    const [modal17, setModal17] = useState(false);
    const [modal18, setModal18] = useState(false);
    const [modal19, setModal19] = useState(false);

    // Tạo state mới
    const { isUpdate, setIsUpdate } = useContext(UpdateContext);
  
    const [recordsData, setRecordsData] = useState<PolicyTitle[] | []>([]);
    useEffect(() => {
        const fetchAmenity = async () => {
            try {
                const response: any = await policyAPI.getAllPolicyTitle({sortOrder: 'ASC'});
                setRecordsData(response.data);
                setIsUpdate(false);
            } catch (error) {
                console.log('Error in get general policy', error);
            }
        };
        fetchAmenity();
    }, [modal17,modal18,isUpdate]);
    const navigate = useNavigate();
    const [currentPolicyTitle, setCurrentPolicyTitle] = useState(null);

    const handleEditClick = (policyTitle : any) => {
        setCurrentPolicyTitle(policyTitle);
        setModal18(true);
    };
    const [currentPolicyTitle2, setCurrentPolicyTitle2] = useState({
        id: '',
        name: '',
        policies: [],
    });

    const handleEditClick3 = (policyTitle : any) => {
        setCurrentPolicyTitle2(policyTitle);
        setModal19(true);
    };
    console.log(currentPolicyTitle2);
    return (
        
        <div>
            <AddPolicy modal17={modal17} setModal17={setModal17} />
           
            <UpdatePolicy modal17={modal18} setModal17={setModal18} policyTitle={currentPolicyTitle} />
            <AddMorePolicy modal17={modal19} setModal17={setModal19} policyTitle3={currentPolicyTitle2} />
            <div className="space-y-8 pt-5">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                    <div className="panel" id="border_top">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">
                                Quản lý chính sách & thông tin
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
                                {recordsData.map((policyTitle, index) => {
                                    const count = index + 1;
                                    return (
                                        <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]" >
                                            <Fragment>
                                                <div className='flex  justify-items-center'>
                                                    <button
                                                        type="button"
                                                        className={`p-4 flex font-bold items-center text-black-dark dark:bg-[#1b2e4b] ${active === String(count) ? '!text-primary' : ''}`}
                                                        style={{ width: 'calc(100% - 50px)' }}
                                                        onClick={() => togglePara(String(count) )}
                                                    >
                                                        <IconAirplay className="ltr:mr-2 rtl:ml-2 text-primary shrink-0" />
                                                        {policyTitle.name}    
                                                        <div className={`ltr:ml-auto rtl:mr-auto ${active === String(count) ? 'rotate-180' : ''}`}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <div className='dark:border-[#1b2e4b] text-justify w-100 text-white-dark' style={{margin:'auto'}}>
                                                        <Tippy content="Chỉnh sửa">
                                                            <button type="button"  onClick={() => handleEditClick(policyTitle)}>
                                                            < IconPencilPaper className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                    <div className='dark:border-[#1b2e4b] text-justify w-100 text-white-dark' style={{ margin: 'auto' }}>
                                                            <Tippy content="Thêm chính sách">
                                                                <button type="button" onClick={() => handleEditClick3(policyTitle)}>
                                                                    
                                                                    <IconPlusCircle className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                                </button>
                                                            </Tippy>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <AnimateHeight duration={300} height={active === String(count)  ? 'auto' : 0}>
                                                        <div className="">
                                                            <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
                                                            {policyTitle.policies.map((policiesdetail) => (
                                                                <div className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5">
                                                                    <p><strong>{policiesdetail.description}</strong> </p>
                                                                    
                                                                    <p>{policiesdetail.subDescription.split(/[-]/).map((line, index) => (
                                                                    <p key={index}>- {line}</p>
                                                                    ))}</p>
                                                                </div>
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
