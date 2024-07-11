import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import IconXCircle from '../../components/Icon/IconXCircle';
import ViewPDF from './Pdf';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

export default function ModalViewPDF({ modal17, setModal17, data }: any) {
    console.log("check data", data);
    const [urlPdf, setUrlPdf] = useState<any>()
    
    useEffect(()=>{
        
    function blobToURL(blob: any) {
        return new Promise((resolve) => {
           const reader = new FileReader();
           reader.readAsDataURL(blob);
           reader.onloadend = function () {
              const base64data = reader.result;
              resolve(base64data);
           };
        });
     }
        const getUrl = async()=>{
            try {
                const arrayBuffer = await fetch(data?.contractTouristFile);
                const blob = await arrayBuffer.blob();
                const url = await blobToURL(blob); 
                return url 
            } catch (error) {
                return ""
            }
           
        }
        if(data?.contractTouristFile){
            getUrl()
        }
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
                                <Dialog.Panel className="panel my-8 w-full max-w-[1000px] overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white">
                                    <div className="flex items-center justify-center p-5 text-base font-medium text-[#f3f3f3] dark:text-white">
                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ea1365] dark:bg-[#ef1262]">
                                            <IconXCircle className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="text-center text-lg font-extrabold text-[#ea1365] dark:text-[#f7f6f6]">                                     
                                        Hợp Đồng Thỏa Thuận Của Homestay Với Tourist(s)
                                    </div>
                                    <div className="ml-4 mr-3 mt-4 text-center">
                                       <p>Tên Homestay: {data?.name}</p>
                                       {data?.contractTouristFile &&<div className='max-h-[800px] overflow-auto'><ViewPDF file={urlPdf}/></div>}
                                      
                                    </div>
                                    <div className="p-5">
                                        <div className="mt-8 flex items-center justify-end">
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
