import React from 'react';
import Dropdown from '../../components/Dropdown';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import { useNavigate } from 'react-router-dom';

function MenuDropdownBookingDetail({
    setModal17,
    setIsUpdate,
    isHomestay,
    id,
}: any) {
    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;

    const navigate = useNavigate();
    return (
        <div className="dropdown">
            <Dropdown
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary dark:hover:text-primary"
                button={<IconHorizontalDots className="h-6 w-6" />}
            >
                <ul className="!min-w-[170px]">
                    <li>
                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/detailbookinghomestay/${id}`)
                            }
                        >
                            Xem Chi Tiết
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
}

export default MenuDropdownBookingDetail;
