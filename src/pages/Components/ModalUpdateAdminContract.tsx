import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { toast } from 'react-toastify';
import IconEdit from '../../components/Icon/IconEdit';
import useAuth from '../../hook/useAuth';
import homestayAPI from '../../util/homestayAPI';
import ViewPDF from './Pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();
export default function ModalUpdateAdminContract({
    modal17,
    setModal17,
    // data,
    // setFilterObject,
}: any) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { auth }: any = useAuth();
    const [fileReview, setFileReview] = useState<string>('');
    const handleFileUpload = (files: FileList | null) => {
        if (files && files.length > 0) {
            const fileSubmit = files[0];
            if (fileSubmit) {
                const fileExtension = fileSubmit.name.split('.').pop();
                if (fileExtension === 'pdf') {
                    setSelectedFile(fileSubmit);
                    const reader = new FileReader();
                    reader.onload = () => {
                        setFileReview(reader.result as string);
                    };
                    reader.readAsDataURL(fileSubmit);
                } else {
                    toast.error('Định dạng tập tin không phải là File PDF!');
                }
            }
        }
    };
    // const handleUpdateContract = async () => {
    //     if (selectedFile) {
    //         try {
    //             const submitForm = new FormData();
    //             submitForm.append('id', data?.id);
    //             submitForm.append('name', data?.name);
    //             submitForm.append('acreage', data?.acreage);
    //             submitForm.append('city', data?.city);
    //             submitForm.append('district', data?.district);
    //             submitForm.append('commune', data?.commune);
    //             submitForm.append('street', data?.street);
    //             submitForm.append('house', data?.house);
    //             submitForm.append('hamlet', data?.hamlet);
    //             submitForm.append('address', data?.address);
    //             submitForm.append('checkInTime', data?.checkInTime);
    //             submitForm.append('checkOutTime', data?.checkOutTime);
    //             submitForm.append('description', data?.description);
    //             submitForm.append('status', data?.status);
    //             submitForm.append('rejectReason', data?.rejectReason);
    //             submitForm.append('rating', data?.rating ?? 0);
    //             submitForm.append('contractTouristFile', selectedFile);
    //             submitForm.append(
    //                 'startDateInActiveTemporary',
    //                 data?.startDateInActiveTemporary ?? '',
    //             );
    //             submitForm.append(
    //                 'endDateInActiveTemporary',
    //                 data?.endDateInActiveTemporary ?? '',
    //             );
    //             submitForm.append('ownerId', auth?.user?.id);

    //             const response = await homestayAPI.updateStatus(
    //                 submitForm,
    //                 data?.id,
    //             );
    //             console.log('response', response);
    //             toast.success('Cập nhật thành công');
    //             setModal17(false);
    //             setFilterObject((prev: any) => ({
    //                 ...prev,
    //                 pageIndex: 1,
    //             }));
    //         } catch (error) {
    //             toast.error('Cập nhật thất bại!');
    //         }
    //     } else {
    //         toast.error('Vui lòng chọn tập tin hợp đồng');
    //     }
    // };
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
                                <Dialog.Panel className="panel my-8 w-full max-w-[1000px] overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white">
                                    <div className="flex items-center justify-center p-5 text-base font-medium text-[#f3f3f3] dark:text-white">
                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ea1365] dark:bg-[#ef1262]">
                                            <IconEdit className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="text-center text-lg font-extrabold text-[#ea1365] dark:text-[#f7f6f6]">
                                        {' '}
                                        Cập Nhật Hợp Đồng Thỏa Thuận Với Quản Trị Viên{' '}
                                    </div>
                                    <div className="relative ml-4 mr-3 mt-4">
                                        {/* <div className="font-bold">
                                            Cập Nhật
                                        </div> */}
                                        {/* <div className="left-0 top-0 h-full w-full rounded-md bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 opacity-20"></div> */}
                                        {/* Input để tải file lên */}
                                        <input
                                            type="file"
                                            hidden
                                            id="pdfFile"
                                            className="absolute left-0 top-0 h-10 w-full cursor-pointer opacity-0"
                                            onChange={(e) =>
                                                handleFileUpload(e.target.files)
                                            }
                                        />
                                        {/* Button để kích hoạt input */}
                                        <label
                                            htmlFor="pdfFile"
                                            className="h-auto w-full cursor-pointer rounded-md border border-gray-300 bg-pink-300 p-4 text-center"
                                        >
                                            {selectedFile
                                                ? selectedFile.name
                                                : 'Chọn File'}
                                        </label>
                                    </div>
                                    {fileReview && (
                                        <div className='max-w-[1000px] overflow-auto'>
                                            <p className="text-center text-lg font-extrabold text-[#ea1365] dark:text-[#f7f6f6]">
                                                Review hợp đồng đã tải lên
                                            </p>
                                            <ViewPDF file={fileReview} />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <div className="mt-8 flex items-center justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setModal17(false)
                                                }
                                                className="btn btn-outline-primary ltr:ml-4 rtl:mr-4"
                                            >
                                                Đóng
                                            </button>
                                            <button
                                                type="submit"
                                                onClick={() => {
                                                    //handleUpdateContract();
                                                    toast.success("Tính năng cập nhật sau ^_^")
                                                    setModal17(false)
                                                }}
                                                className="btn btn-outline-success ltr:ml-4 rtl:mr-4"
                                            >
                                                Lưu
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
