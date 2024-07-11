import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import IconBellBing from '../../components/Icon/IconBellBing';
import { toast } from 'react-toastify';
import IconUser from '../../components/Icon/IconUser';
import IconUsersGroup from '../../components/Icon/IconUsersGroup';

export default function ModalReport({ modal17, setModal17, backToPayment }: any) {
    // const [modal17, setModal17] = useState(false);
    return (
        <div>
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
                                    <div className="flex items-center justify-center p-5 text-base font-medium text-[#f3f3f3] dark:text-white">
                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ea1365] dark:bg-[#ef1262]">
                                            <IconUsersGroup className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="text-center text-lg font-extrabold text-[#ea1365] dark:text-[#f7f6f6]">
                                        {' '}
                                        Khiếu Nại{' '}
                                    </div>
                                    <div className="relative ml-4 mr-3 mt-4">
                                        {/* Input cho chủ đề khiếu nại */}
                                        <input
                                            className="w-full rounded-md border border-gray-300 bg-transparent p-4"
                                            placeholder="Chủ đề khiếu nại..."
                                            // Số dòng bạn muốn hiển thị
                                        ></input>
                                    </div>
                                    <div className="relative ml-4 mr-3 mt-4">
                                        <div className="font-bold">
                                            Bạn Muốn Khiếu Nại Điều Gì ?
                                        </div>
                                        {/* Khối texture */}
                                        <div className="left-0 top-0 h-full w-full rounded-md bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 opacity-20"></div>
                                        {/* Textarea */}
                                        <textarea
                                            className="h-40 w-full rounded-md border border-gray-300 bg-transparent p-4 "
                                            placeholder="Hãy mô tả rõ ràng điều bạn muốn khiếu nại..."
                                        ></textarea>
                                    </div>
                                    <div className="p-5">
                                        <div className="mt-8 flex items-center justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    backToPayment(true)
                                                }
                                                className="btn btn-outline-danger"
                                            >
                                                Quay Lại
                                            </button>

                                            <button
                                                type="submit"
                                                onClick={() => {
                                                    setModal17(false);
                                                    toast.success(
                                                        'Khiếu Nại Của Bạn Đã Được Gửi Tới Quản Trị Viên !!!',
                                                    );
                                                }}
                                                className="btn btn-outline-success ltr:ml-4 rtl:mr-4"
                                            >
                                                Tôi Đồng Ý
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
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
