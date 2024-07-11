import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import IconMail from '../../../components/Icon/IconMail';
import IconPhone from '../../../components/Icon/IconPhone';
import IconUser from '../../../components/Icon/IconUser';
import userAPI from '../../../util/userAPI';
import walletAPI from '../../../util/walletAPI';
import { toast } from 'react-toastify';
import { co } from '@fullcalendar/core/internal-common';
import TableTransactionOwner from './Component/TableTransaction';
import ProfitChart from './Component/ProfitChart'
interface Users {
    id: string;
    phoneNumber: string;
    email: string;
    firstName: string;
    lastName: string ;
    avatar: string;
    gender: boolean;
    dateOfBirth: string;
    status: string;
    type: string;
    contractFile: string;
    homeStays: [];
    wallets: [
        {
          id: string;
          balance: 0,
          ownerId: string;
          touristId:string;
          adminId: string;
        }
    ]

}
interface walletObject {
    id: string;
    balance: number;
    ownerId: string;
    touristId: string;
    adminId: string;
}
const Profile = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Thông tin người dùng'));
    });

    const [recordsData, setRecordsData]  = useState<Users>();
    const { id } = useParams<{ id: string }>();
    const {type} = useParams<{type: string}>();
    const walletExample = {
        id: '',
        adminId: '',
        balance: 0,
        ownerId: '',
        touristId: '',
    };

    const [walletInfo, setWalletInfo] = useState<walletObject>(walletExample);
    const [statusChange, setstatusChange] = useState(false);

    useEffect(() => {
        if (type === 'Tourist') {
            const fetchTourist = async () => {
                try {
                    const response:any = await userAPI.getTouristID(id || '');
                    if (response.data.id != '') {
                        setRecordsData(response.data);
                        setstatusChange(response.data.status);
                        }
                } catch (error) {
                    console.log('Error tourist', error);
                }
            };
            const fetchDataWallet = async (id: string) => {
                if (!id) return;
                try {
                    const response = await walletAPI.getWalletTouristInformation(id);
                    setWalletInfo(response.data[0] ?? walletExample);
                } catch (error) {
                    console.log({ error });
                }
            };
            if (id){
                fetchTourist();
                fetchDataWallet(id);
                }
            
        } else if (type === 'Owner'){
            const fetchOwner = async () => {
                if (!id) return;
                try {
                    const response:any = await userAPI.getOwnerID(id);
                    if (response.data.id != '') {
                    setRecordsData(response.data);
                    setstatusChange(response.data.status);
                    }
    
                } catch (error) {
                    console.log('Error Owner', error);
                }
            };
            const fetchDataWallet = async (id: string) => {
                if (!id) return;
                try {
                    const response = await walletAPI.getWalletOwnerInformation(id);
                    console.log('112',response.data);
                    setWalletInfo(response.data[0] ?? walletExample);
                } catch (error) {
                    console.log({ error });
                }
            };
            if (id){
            fetchOwner();
            fetchDataWallet(id);
            }
            
        };
        
    }, [id,statusChange]);
    const handleUpdate = async (id: string) => {
        
        if (window.confirm('Xác nhận thay đổi trạng thái người dùng')) {
            if (type === 'Tourist') {
                const payload = {
                    id: id,
                    phoneNumber: recordsData?.phoneNumber,
                    email: recordsData?.email,
                    firstName: recordsData?.firstName,
                    lastName: recordsData?.lastName,
                    avatar: recordsData?.avatar,
                    gender: recordsData?.gender,
                    dateOfBirth: recordsData?.dateOfBirth,
                    status: '',
                }
                try {
                    if (recordsData?.status === 'ACTIVE') {
                        payload.status = 'DISABLE';
                        const response = await userAPI.updateProfileTourist(id, payload);
                    }
                    else if (recordsData?.status === 'DISABLE') {
                        payload.status = 'ACTIVE';
                        const response = await userAPI.updateProfileTourist(id, payload);
                    }
                    setstatusChange(true);
                    toast.success('Cập nhật thành công');
                } catch (error) {
                    console.log(error);
                    toast.error('Cập nhật thất bại');
                }
            }
            else if (type === 'Owner') {
                const payload = {
                    id: id,
                    phoneNumber: recordsData?.phoneNumber,
                    email: recordsData?.email,
                    firstName: recordsData?.firstName,
                    lastName: recordsData?.lastName,
                    avatar: recordsData?.avatar,
                    contractFile: recordsData?.contractFile,
                    status: '',
                }
            try {
                if (recordsData?.status === 'ACTIVE') {
                    payload.status = 'DISABLE';
                    const response = await userAPI.updateProfileOwner(id, payload);
                }
                else if (recordsData?.status === 'DISABLE') {
                    payload.status = 'ACTIVE';
                    const response = await userAPI.updateProfileOwner(id, payload);
                }
                setstatusChange(true);
                    toast.success('Cập nhật thành công');
                } catch (error) {
                    console.log(error);
                    toast.error('Cập nhật thất bại');
                }
            }
        }
    };     
    return (
        <div>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">
                                Thông tin người dùng
                            </h5>
                        </div>
                        <div className="mb-5">
                            <div className="flex flex-col items-center justify-center">
                                <img
                                    src={recordsData?.avatar !== null ? recordsData?.avatar : '/public/assets/images/no-image.jpg'}
                                    alt="Avatar"
                                    className="mb-5 h-24 w-24 rounded-full  object-cover"
                                />
                                <p className="text-xl font-semibold ">
                                {recordsData?.firstName + ' '+  recordsData?.lastName}
                                </p>
                            </div>
                            <ul className="m-auto mt-5 flex max-w-[180px] flex-col space-y-4 font-semibold text-white-dark">
                                <li>
                                    <button className="flex items-center gap-2">
                                        <IconMail className="h-5 w-5 shrink-0" />
                                        <span className="truncate text-dark">
                                        {recordsData?.email}
                                        </span>
                                    </button>
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconPhone />
                                    <span
                                        className="whitespace-nowrap"
                                        dir="ltr"
                                    >
                                        {recordsData?.phoneNumber}
                                    </span>
                                </li>
                                <li className={`flex items-center gap-2 ${recordsData?.status === 'ACTIVE' ? 'text-success' : recordsData?.status === 'DISABLE' ? 'text-danger' : ''}`}>
                                    <IconUser className="shrink-0" />
                                    {recordsData?.status === 'ACTIVE' ? 'Đang hoạt động' : recordsData?.status === 'DISABLE' ? 'Vô hiệu hóa' : ''}
                                </li>
                            </ul>
                            <div className='flex content-center justify-center pt-5'>
                            {recordsData?.status === 'ACTIVE' ? 
                                <button type="button" className="btn btn-danger"
                                        onClick={() => {
                                            handleUpdate(recordsData?.id);
                                        }}>
                                    Vô hiệu hóa tài khoản
                                </button> 
                                : 
                                recordsData?.status === 'DISABLE' ? 
                                <button type="button" className="btn btn-primary"
                                        onClick={() => {
                                            handleUpdate(recordsData?.id);

                                        }}>
                                    Kích hoạt tài khoản
                                </button>
                                : null
                            }
                            </div>
                        </div>
                    </div>
                    <div className="panel lg:col-span-2 lg:col-span-1 xl:col-span-2">
                    <div className="mb-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">
                                Ví Tài Khoản
                            </h5>
                        </div>
                        <div className="mb-5">
                            <div className="table-responsive font-semibold text-[#515365] dark:text-white-light">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="mr-2 inline-flex items-center text-4xl font-extrabold text-green-500">
                                        {Number(
                                            walletInfo.balance,
                                        ).toLocaleString('vi-VN')}{' '}
                                        <span className="ml-3">VNĐ</span>{' '}
                                    </div>
                                </div>
                                <ProfitChart walletId={walletInfo.id}/>
                            </div>
                        </div>
                    </div>
                    <div className="panel lg:col-span-3 lg:col-span-1 xl:col-span-3">
                        <div className="mb-5 "></div>
                        <TableTransactionOwner paidUserId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
