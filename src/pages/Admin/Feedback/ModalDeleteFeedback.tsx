import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState,useContext } from 'react';
import { UpdateContext } from '../../../context/UpdateContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { toast } from 'react-toastify';
import IconEdit from '../../../components/Icon/IconEdit';
import useAuth from '../../../hook/useAuth';
import homestayAPI from '../../../util/homestayAPI';

export default function ModalDeleteFeedback({
    modal17,
    setModal17,
    feedbackId,
    // setFilterObject,
}: any) {
    const { auth }: any = useAuth();
    const { setIsUpdate } = useContext(UpdateContext);
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
                                <Dialog.Panel className="panel my-8 w-full max-w-[600px] overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white">
                                    <div className="flex items-center justify-center p-5 text-base font-medium text-[#f3f3f3] dark:text-white">
                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ea1365] dark:bg-[#ef1262]">
                                            <IconEdit className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="text-center text-lg font-extrabold text-[#ea1365] dark:text-[#f7f6f6]">
                                        {' '}
                                    Xác nhận xóa đánh giá 
                                    </div>
                                    
                                    <div className="p-5">
                                        <div className="mt-8 flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setModal17(false)
                                                }
                                                className="btn btn-outline-primary ltr:ml-4 rtl:mr-4"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                onClick={() => {
                                                    try {
                                                        if (feedbackId) {
                                                            homestayAPI.deleteFeedback(feedbackId);
                                                            toast.success("Xóa thành công")
                                                            setIsUpdate(true);
                                                            setModal17(false)
                                                        }
                                                    }
                                                    catch (error) {
                                                        toast.error("Xóa thất bại")
                                                        setModal17(false)
                                                    }
                                                }}
                                                className="btn btn-outline-success ltr:ml-4 rtl:mr-4"
                                            >
                                                Đồng ý
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
