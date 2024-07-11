import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import IconPencil from '../../components/Icon/IconPencil';

export default function ModalUpdateQuantityTourist({ modal17, setModal17, data }: any) {
    const [numberTourist, setNumberTourist] = useState(0)
    useEffect(()=>{
    setNumberTourist(data.booking?.actualQuantityTourist || 0)
    },[data])
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
                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3939d2] dark:bg-[#3939d2]">
                                            <IconPencil className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="text-center text-lg font-extrabold text-blue-600 dark:text-[#f7f6f6]">                                     
                                        Cập Nhật Số Người Thuê Phòng
                                    </div>
                                    <div className="ml-4 mr-3 mt-4">
                                        <div className='flex item-center gap-2 mb-2'>
                                        <p className='text-lg font-bold'>Tên Homestay:</p> 
                                        <p className='text-lg'>{data?.room?.homeStay?.name}</p>
                                        </div>

                                        <div className='flex item-center gap-2 mb-2'>
                                        <p className='text-lg font-bold'>Tên Phòng:</p> 
                                        <p className='text-lg'>{data?.room?.name}</p>
                                        </div>

                                        <div className='flex item-center gap-2 mb-2'>
                                        <p className='text-lg font-bold'>Sức Chứa:</p> 
                                        <p className='text-lg'>{data?.room?.capacity} người</p>
                                        </div>

                                        <div className='flex item-center gap-2 mb-2'>
                                        <p className='text-lg font-bold'>Giá Phòng:</p> 
                                        <p className='text-lg'>{data?.price?.toLocaleString(
                                                            'vi-VN',
                                                            {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            },
                                                        )}</p>
                                        </div>

                                        <div className='flex item-center gap-2 mb-2'>
                                        <label htmlFor='actualTourist' className='w-[300px] text-lg font-bold'>Số Người Thực Tế: </label>
                                        <input
                                        id='actualTourist'
                                            value={numberTourist}
                                            className='form-input w-full text-center'
                                            min={0}
                                            type='number'
                                            onChange={(e)=>{setNumberTourist(parseInt(e.target.value) || 0)}}
                                            />                                                
                                        </div>
                                       
                                    </div>
                                    <div className="p-5 w-full">
                                        <div className="mt-2 flex items-center gap-3 w-full">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setModal17(false)
                                                }
                                                className="btn btn-outline-danger w-full"
                                            >
                                                Đóng
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setModal17(false)
                                                }
                                                className="btn btn-info w-full"
                                            >
                                                Cập Nhật
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
