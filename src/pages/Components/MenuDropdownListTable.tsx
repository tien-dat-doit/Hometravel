import React, { useState } from 'react';
import Dropdown from '../../components/Dropdown';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import { useNavigate } from 'react-router-dom';
import ModalDisableHomestay from './ModalDisableHomestay';
import homestayAPI from '../../util/homestayAPI';
import { toast } from 'react-toastify';
import useAuth from '../../hook/useAuth';

function MenuDropdownListTable({ status, id, data, setFilterObject }: any) {
    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { auth }: any = useAuth();
    const handleCancel = async () => {
        try {
            const submitForm = new FormData();
            submitForm.append('id', data?.id);
            submitForm.append('name', data?.name);
            submitForm.append('acreage', data?.acreage);
            submitForm.append('city', data?.city);
            submitForm.append('district', data?.district);
            submitForm.append('commune', data?.commune);
            submitForm.append('street', data?.street);
            submitForm.append('house', data?.house);
            submitForm.append('hamlet', data?.hamlet);
            submitForm.append('address', data?.address);
            submitForm.append('checkInTime', data?.checkInTime);
            submitForm.append('checkOutTime', data?.checkOutTime);
            submitForm.append('description', data?.description);
            submitForm.append('status', 'SELF-CANCELLED');
            submitForm.append('rejectReason', data?.rejectReason);
            submitForm.append('rating', data?.rating ?? 0);
            submitForm.append('ownerId', auth?.user?.id);
            const response: any = await homestayAPI.updateStatus(
                submitForm,
                id,
            );
            toast.success('Cập nhật thành công');
            setFilterObject((prev: any)=> ({...prev, pageIndex:1}))
            setIsOpen(false);
        } catch (error) {
            toast.error('Cập nhật thất bại');
            setIsOpen(false);
        }
    };
    return (
        <div>
            {' '}
            <ModalDisableHomestay
                modal17={isOpen}
                setModal17={setIsOpen}
                onCancel={handleCancel}
            />
            <div className="dropdown">
                <Dropdown
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary dark:hover:text-primary"
                    button={<IconHorizontalDots className="h-6 w-6" />}
                >
                    {status === 'PENDING' && (
                        <ul className="!min-w-[170px]">
                            <li>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate(`/updateHomestay/${id}`);
                                    }}
                                >
                                    Thay Đổi Thông Tin
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(true)}
                                >
                                    Hủy Kiểm Duyệt
                                </button>
                            </li>
                        </ul>
                    )}
                </Dropdown>
            </div>
        </div>
    );
}

export default MenuDropdownListTable;
