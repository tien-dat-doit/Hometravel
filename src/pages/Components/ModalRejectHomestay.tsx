import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import IconCashBanknotes from '../../components/Icon/IconCashBanknotes';
import IconXCircle from '../../components/Icon/IconXCircle';

export default function ModalShowReasonRejectHomestay({ modal17, setModal17, data }: any) {
    return (
        <div>
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
                                            <IconXCircle className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="text-center text-lg font-extrabold text-[#ea1365] dark:text-[#f7f6f6]">                                     
                                        Lý Do {data?.status === "CANCELLED" ? "Hủy Kiểm Duyệt" : "Vô Hiệu Hóa" }  Homestay
                                    </div>
                                    <div className="ml-4 mr-3 mt-4">
                                        <div className='flex item-center gap-2 mb-2'>
                                        <p className='text-lg font-bold'>1. Tên Homestay:</p> 
                                        <p className='text-lg'>{data?.name}</p>
                                        </div>
                                       
                                       <p className='mb-2 text-lg font-bold'>2. Lí Do {data?.status === "CANCELLED" ? "Từ Chối" : "Vô Hiệu Hóa" }:</p>
                                       <textarea
                                                        id="descriptionHomestay"
                                                        name="descriptionHomestay"
                                                        className="form-textarea max-h-fit min-h-[100px] w-full text-[16px]"
                                                        value={
                                                            data?.rejectReason ?? ""
                                                        }
                                                        disabled
                                                    />
                                    </div>
                                    <div className="p-5">
                                        <div className="mt-2 flex items-center justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setModal17(false)
                                                }
                                                className="btn btn-outline-danger"
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
