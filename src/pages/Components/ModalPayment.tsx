import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import IconBellBing from '../../components/Icon/IconBellBing';
import { toast } from 'react-toastify';
import IconUser from '../../components/Icon/IconUser';
import IconCashBanknotes from '../../components/Icon/IconCashBanknotes';
import ModalReport from './ModalReport';

export default function ModalPayment({ modal17, setModal17 }: any) {
    const [isShowReport, setIsShowReport] = useState(false);

    return (
        <div>
            <ModalReport modal17={isShowReport} setModal17={setIsShowReport} backToPayment={setModal17} />
            {/* <button
                type="button"
                onClick={() => setModal17(true)}
                className="btn btn-primary"
            >
                Standard
            </button> */}
            <Transition appear show={modal17} as={Fragment}>
                <Dialog
                    as="div"
                    open={modal17}
                    onClose={() => setModal17(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div
                        id="standard_modal"
                        className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60"
                    >
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white">
                                    <div className="container mx-auto p-4">
                                        <div className="flex flex-col flex-wrap">
                                            <div className="mb-2 text-center text-lg font-extrabold">
                                                THANH TOÁN TỪ QUẢN TRỊ VIÊN
                                            </div>
                                            <div className="mb-4 inline-flex w-full items-baseline">
                                                <label
                                                    htmlFor="roomDeposit"
                                                    className="w-[200px] text-sm font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                >
                                                    1. Hình Ảnh Xác Thực:
                                                </label>
                                            </div>
                                            <img
                                                src="../../../public/assets/images/carousel1.jpeg"
                                                alt="Description"
                                                className="mx-auto my-auto mb-6 inline-flex h-[320px] w-[full] items-center  rounded-lg text-center"
                                            />

                                            <div className="mb-4 inline-flex w-full items-baseline">
                                                <label
                                                    htmlFor="roomDeposit"
                                                    className="mb-2 w-[200px] text-sm font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                >
                                                    2. Tiền Đặt Phòng:
                                                </label>
                                                <input
                                                    type="text"
                                                    id="roomDeposit"
                                                    className="form-input w-full border p-2"
                                                    defaultValue={
                                                        '1.000.000 VNĐ'
                                                    }
                                                    style={{
                                                        cursor: 'no-drop',
                                                    }}
                                                    disabled
                                                />
                                            </div>

                                            <div className="mb-4 inline-flex w-full items-baseline">
                                                <label
                                                    htmlFor="roomDeposit"
                                                    className="mb-2 w-[200px] text-sm font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                >
                                                    3. VAT (10%):
                                                </label>
                                                <input
                                                    type="text"
                                                    id="roomDeposit"
                                                    className="form-input w-full border p-2 text-sm"
                                                    defaultValue={'100.000 VNĐ'}
                                                    style={{
                                                        cursor: 'no-drop',
                                                    }}
                                                    disabled
                                                />
                                            </div>

                                            <div className="mb-4 inline-flex w-full items-baseline">
                                                <label
                                                    htmlFor="roomDeposit"
                                                    className="mb-2 w-[200px] text-sm font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                >
                                                    4. Phí Hoa Hồng (5%):
                                                </label>
                                                <input
                                                    type="text"
                                                    id="roomDeposit"
                                                    className="form-input w-full border p-2"
                                                    defaultValue={'50.000 VNĐ'}
                                                    style={{
                                                        cursor: 'no-drop',
                                                    }}
                                                    disabled
                                                />
                                            </div>

                                            <div className="mb-4 inline-flex w-full items-baseline">
                                                <label
                                                    htmlFor="roomDeposit"
                                                    className="mb-2 w-[200px] text-sm font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                >
                                                    5. Hoàn Tiền:
                                                </label>
                                                <input
                                                    type="text"
                                                    id="roomDeposit"
                                                    className="form-input w-full border p-2"
                                                    defaultValue={'0 VNĐ'}
                                                    style={{
                                                        cursor: 'no-drop',
                                                    }}
                                                    disabled
                                                />
                                            </div>

                                            <div className="mb-5 md:mb-0">
                                                <div className="mt-4">
                                                    <div>
                                                        <div className="flex">
                                                            <IconCashBanknotes className="h-5 w-5 text-[#bc3433] dark:text-[#f7f6f6]" />
                                                            &nbsp;
                                                            <label className="font-bold text-[#bc3433] dark:text-[#f7f6f6]">
                                                                Tổng Số Tiền
                                                                Nhận:
                                                            </label>
                                                        </div>
                                                        <input
                                                            id="status"
                                                            type="text"
                                                            name="status"
                                                            className="form-input bg-[#ea1365] text-center text-lg font-bold text-[#f7f6f6]"
                                                            defaultValue={
                                                                '850.000 VNĐ'
                                                            }
                                                            style={{
                                                                cursor: 'no-drop',
                                                            }}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-8 flex items-center justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setModal17(false);
                                                        setIsShowReport(true);
                                                    }}
                                                    className="btn btn-outline-danger flex"
                                                >
                                                    Bạn Muốn Khiếu Nại ?
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setModal17(false)
                                                    }
                                                    className="btn btn-outline-primary ltr:ml-4 rtl:mr-4"
                                                >
                                                    Đóng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
