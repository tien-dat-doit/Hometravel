import { useEffect, useState,useContext } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconBook from '../../../components/Icon/IconBook';
import useAuth from '../../../hook/useAuth';
import { toast } from 'react-toastify';
import contractAPI from '../../../util/contractAPI';
import ModalUpdateAdminContract from './ModalUpdateAdminContract';
import { UpdateContext } from '../../../context/UpdateContext';

// declare for homestay
interface contractLogin {
    id: string;
    contractFile: string;

}

const ContractManagement = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Quản lý hợp đồng'));
    });
    const { auth }: any = useAuth();
    const { isUpdate, setIsUpdate } = useContext(UpdateContext);
    const [isShowUpdate, setIsShowUpdate] = useState(false);
    const [recordsData, setRecordsData] = useState<contractLogin>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchContract = async () => {
            try {
                const response: any =
                    await contractAPI.getContract('b982a365-36ee-48a9-a1a2-9cf48a04fbac');
                    setRecordsData(response.data);
                    console.log('response', recordsData);
                    setLoading(false);
                    setIsUpdate(false);
            } catch (error) {
                console.log('Error in get contract homestay', error);
            }
        };
        fetchContract();
    }, [isShowUpdate,isUpdate]);
    
    const navigate = useNavigate();
   
    return (
        <div>
            {loading ? (
                <div className='text-center'>
                    <span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>
                </div>
            ) : (
                <div> 
                    <ModalUpdateAdminContract
                    modal17={isShowUpdate}
                    setModal17={setIsShowUpdate}
                    />
                    <div className="panel mt-6">
                        <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setIsShowUpdate(true)}
                            >
                                <IconBook className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                Cập Nhật Hợp Đồng
                            </button>
                        </div>
                        <div className="mb-5  gap-5 md:flex-row md:items-center">
                            <h5 className=" mb-5 text-lg font-extrabold dark:text-white-light">
                                Hợp đồng sử dụng dịch vụ
                            </h5>
                            <div className='min-h-screen'>
                                <iframe
                                    src={recordsData?.contractFile + '#view=FitH'}
                                    width="80%"
                                    height="700px"
                                    style={{ border: 'none' }}
                                    allow="fullscreen"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
                    )}
        </div>
    );
};

export default ContractManagement;
