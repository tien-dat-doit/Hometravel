import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import IconBellBing from '../../components/Icon/IconBellBing';
import IconDollarSign from '../../components/Icon/IconDollarSign';
import transactionAPI from '../../util/transactionAPI';
import moment from 'moment';

interface transactionType {
    id:string
    price:number
    status:string
    type: string
    createdDate: string
    bookingId: string
    walletId: string
    paidUserId: string
    bankName: string
    bankNumber: string
}
export default function ModalViewTransaction({ modal17, setModal17, id }: any) {
    const exampleTransaction: transactionType = {
    bookingId:"",
    createdDate:"",
    id:"",
    paidUserId:"",
    price:0,
    status:"",
    walletId:"",
    type:"",
    bankName:"",
    bankNumber:"",
    }
    const [transaction, setTransaction] = useState<transactionType>(exampleTransaction);
    useEffect(() => {
        const fetchDetailTransaction = async () => {
            try {
                const res = await transactionAPI.getDetail(id);
                setTransaction(res?.data || exampleTransaction)
            } catch (error) {
                console.log({error});
            }
        };
        if(id){
            fetchDetailTransaction();
        }
    }, [id]);
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
                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 dark:bg-[#ef1262]">
                                            {/* Thay đổi icon nếu muốn */}
                                            <IconDollarSign className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="text-center text-lg font-extrabold text-[#ea1365] dark:text-[#f7f6f6]">
                                        Thông Tin Rút Tiền
                                    </div>
                                    <div className="ml-4 mr-3 mt-4 rounded-md border border-gray-200 bg-white p-4 shadow-md">
                                        <p className="mb-2 font-semibold text-gray-800">
                                            Mã Giao Dịch:{' '}
                                            <span className="text-blue-500">
                                                {transaction.id}
                                            </span>
                                        </p>
                                        <p className="mb-2 font-semibold text-gray-800">
                                            Tên Ngân Hàng:{' '}
                                            <span className="text-gray-600">
                                                {transaction.bankName ||
                                                    'Chưa có thông tin'}
                                            </span>
                                        </p>
                                        <p className="mb-2 font-semibold text-gray-800">
                                            Số Tài Khoản Rút Tiền:{' '}
                                            <span className="text-gray-600">
                                                {transaction?.bankNumber ||
                                                    'Chưa có thông tin'}
                                            </span>
                                        </p>
                                        <p className="mb-2 font-semibold text-gray-800">
                                            Số Tiền Giao Dịch:{' '}
                                            <span className="text-green-500">
                                                {transaction.price.toLocaleString(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    },
                                                )}
                                            </span>
                                        </p>
                                        <p className="mb-2 font-semibold text-gray-800">
                                            Loại Giao Dịch:{' '}
                                            <span className="text-blue-500">
                                                Rút Tiền
                                            </span>
                                        </p>
                                        <p className="mb-2 font-semibold text-gray-800">
                                            Trạng Thái:{' '}
                                            <span className="text-green-500">
                                                Giao Dịch Thành Công
                                            </span>
                                        </p>
                                        <p className="mb-2 font-semibold text-gray-800">
                                            Nguồn Tiền:{' '}
                                            <span className="text-gray-600">
                                                Ví Của Tôi
                                            </span>
                                        </p>
                                        <p className="font-semibold text-gray-800">
                                            Thời Gian Giao Dịch:{' '}
                                            <span className="text-gray-600">
                                                {transaction.createdDate
                                                    ? moment(
                                                          transaction.createdDate,
                                                      ).format(
                                                          'DD/MM/YYYY - HH:mm',
                                                      )
                                                    : 'Chưa có thông tin'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="p-5">
                                        <div className="mt-8 flex items-center justify-end">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setModal17(false);
                                                }}
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
