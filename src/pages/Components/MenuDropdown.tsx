import React, { useState } from 'react';
import Dropdown from '../../components/Dropdown';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import { useNavigate } from 'react-router-dom';
import homestayAPI from '../../util/homestayAPI';
import useAuth from '../../hook/useAuth';
import { toast } from 'react-toastify';
import roomAPI from '../../util/roomAPI';
import ModalDisable from './ModalDisable';

function MenuDropdown({
    setIsUpdate,
    isHomestay,
    id,
    data,
    selected,
    setFilterObject,
}: any) {
    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;

    const navigate = useNavigate();
    const { auth }: any = useAuth();
    const [isOpenConfirm, setIsOpenConfirm] = useState(false)
    const handleInactiveHomestay = async () => {
        const submitForm = {
            id: data?.id,
            name: data?.name,
            acreage: data?.acreage,
            city: data?.city,
            district: data?.district,
            commune: data?.commune,
            street: data?.street,
            house: data?.house,
            hamlet: data?.hamlet,
            rejectReason: data?.rejectReason,
            rating: data?.rating,
            contractFile: data?.contractFile,
            licenseFile: data?.licenseFile,
            address: data?.address,         
            description: data?.description,
            status: 'INACTIVE',
            ownerId: auth?.user?.id,
        };
        try {
            const response = await homestayAPI.updateStatus(
                submitForm,
                data?.id,
            );
            toast.success('Cập nhật trạng thái thành công');
            setFilterObject((prev: any) => ({
                ...prev,
                pageIndex: 1,
            }));
        } catch (error: any) {
            toast.error(error?.response?.data?.msg || 'Cập nhật trạng thái thất bại!');
        }

    };
    const handleInActiveTemporaryHomestay = () => {
        setIsUpdate(true);
        selected(data);
    }
    const handleInactiveRoom = async () => {
        const submitForm = {
            id: data?.id,
            name: data?.name,
            numberOfBeds:
                data?.numberOfBeds,
            acreage:
                data?.acreage,
            capacity:
                data?.capacity,
            rejectReason:
                data?.rejectReason,
            price: data?.price,
            status: "INACTIVE",
            weekendPrice:
                data?.weekendPrice,
            homeStayId:
                data?.homeStayId,
        };
        try {
            const response: any = await roomAPI.updateStatus(
                submitForm,
                data?.id,
            );
            toast.success('Cập nhật trạng thái thành công');
            setFilterObject((prev: any) => ({
                ...prev,
                pageIndex: 1,
            }));
        } catch (error) {
            toast.error('Cập nhật trạng thái thất bại!');
        }

    };
    return (
        <>{isHomestay ? (
            <ModalDisable
                modal17={isOpenConfirm}
                setModal17={setIsOpenConfirm}
                inactive={handleInactiveHomestay}
                isHomestay={isHomestay}
            />
        ) : (
            <ModalDisable
            modal17={isOpenConfirm}
            setModal17={setIsOpenConfirm}
            inactive={handleInactiveRoom}
            isHomestay={isHomestay}
            />
        )}
        <div className="dropdown">
            <Dropdown
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary dark:hover:text-primary"
                button={<IconHorizontalDots className="h-6 w-6" />}
            >
             {data?.status === "ACTIVE" || data?.status === "INACTIVE TEMPORARY" ? <>
             <ul className="!min-w-[170px]">
                 
                 <li>
                 <button
                     type="button"
                     onClick={() => {
                        isHomestay ?
                        // handleInActiveTemporaryHomestay()
                        navigate(`/calendarHomestay/${data?.id}`)                      
                          :
                        navigate(`/calendarRoom/${data?.id}`)
                     }}
                 >
                     {isHomestay
                         ? 'Trạng Thái Hoạt Động'
                         : 'Trạng Thái Hoạt Động'}
                 </button>
             </li>
                                
                   
                        <li>
                            <button
                                type="button"
                                onClick={() => setIsOpenConfirm(true)}
                            >
                                Ngưng Hoạt Động
                            </button>
                        </li>
                    
                    {/* <li>
                        <button
                            type="button"
                            onClick={() =>
                                isHomestay
                                    ? navigate(`/detailhomestay/${id}`)
                                    : navigate(`/detailroom/${id}`)
                            }
                        >
                            {isHomestay
                                ? 'Xem Chi Tiết Homestay'
                                : 'Xem Chi Tiết Phòng'}
                        </button>
                    </li> */}
                    <li>
                        <button
                            type="button"
                            onClick={() =>
                                isHomestay
                                    ? navigate(`/detailhomestay/${id}`)
                                    : navigate(`/detailroom/${id}`)
                            }
                        >
                            {isHomestay
                                ? 'Chi Tiết & Cập Nhật'
                                : 'Chi Tiết & Cập Nhật'}
                        </button>
                    </li>                 
                </ul>
             </>:
             <></>
             }   
               
            </Dropdown>
        </div>
        </>
    );
}

export default MenuDropdown;
