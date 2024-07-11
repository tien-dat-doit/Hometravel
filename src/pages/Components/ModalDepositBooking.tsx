import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';
import useAuth from '../../hook/useAuth';
import bookingAPI from '../../util/bookingAPI';

export default function ModalDepositBooking({
    modal17,
    setModal17,
    data,
    setFilterObject,
}: any) {
    const { auth }: any = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const handleUpdate = async (bookingId: string) => {
        setIsLoading(true)
        try {
            const response = await bookingAPI.updateStatusPayment(
                bookingId,
                auth?.user?.id,
            );
            console.log(response.data);
            toast.success('Xác nhận thành công');
            setModal17(false);
            setFilterObject((prev: any) => ({ ...prev, pageSize: 10 }));
        } catch (error) {
            console.log(error);
            toast.error('Xác nhận thất bại');
        }
        setIsLoading(false)
    };
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
                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00e676] dark:bg-[#00e676]">
                                            <IconCircleCheck className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="p-3 text-center text-lg font-extrabold text-blue-400 dark:text-[#f7f6f6]">
                                        Hoàn Tất Thanh Toán Tại Quầy - Tiền Mặt
                                    </div>

                                    <p className="p-3 text-center text-lg">
                                        Xác Nhận Hoàn Tất Thanh Toán Đặt Phòng
                                        Của Khách Hàng{' '}
                                        <span className="font-bold">
                                            {data?.tourist?.lastName +
                                                ' ' +
                                                data?.tourist?.firstName}
                                        </span>
                                        ?
                                    </p>
                                    <div className="w-full p-5">
                                        <div className="mt-2 flex w-full items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setModal17(false)
                                                }
                                                className="btn btn-outline-danger w-full"
                                                disabled={isLoading}
                                            >
                                                Đóng
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdate(data?.id)
                                                }
                                                className="btn btn-info w-full"
                                                disabled={isLoading}
                                            >
                                                Xác Nhận
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
