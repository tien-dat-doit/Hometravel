import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect,useContext } from 'react';
import { UpdateContext } from '../../../context/UpdateContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import * as Yup from 'yup';
import {
    ErrorMessage,
    Field,
    FieldArray,
    Form,
    Formik,
    FormikProps,
    FormikValues,
} from 'formik';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import policyAPI from '../../../util/policyAPI';
import IconMinusCircle from '../../../components/Icon/IconMinusCircle';
import IconPlayCircle from '../../../components/Icon/IconPlayCircle';
interface Policy {
    id: string;
    description: string;
    subDescription: string;
    policyTitleId: string;
}
export default function UpdatePolicy({ modal17, setModal17, policyTitle }: any) {
    const [formData, setFormData] = useState({
        policyTitleData: {
            id: '',
            name: '',
        },
        policiesData: [{
            id: '',
            description: '',
            subDescription: '',
            policyTitleId: '',
        }],
    });
    const { setIsUpdate } = useContext(UpdateContext);
    const [recordsData, setRecordsData] = useState<Policy[] | []>([]);
    useEffect(() => {
        const fetchAmenity = async () => {
            try {
                const response: any = await policyAPI.getPolicyID(
                    {
                        sortOrder: 'DESC',
                        policyTitleId: policyTitle.id
                    });
                setRecordsData(response.data);
            } catch (error) {
                console.log('Error in get general policy', error);
            }
        };
        fetchAmenity();
    }, [modal17]);
    const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { name, value } = event.target;
        const newRecordsData: Policy[] = [...recordsData];
        newRecordsData[index][name as keyof Policy] = value;
        setRecordsData(newRecordsData);
    };
    const handleSubmit = async (values: FormikValues) => {
        try {
            
            for (const record of recordsData) {
                const response: any = await policyAPI.editPolicies(record.id, record);
            }
            setModal17(false);
            setIsUpdate(true);
            toast.success('Chỉnh Sửa Chính Sách Thành Công');
        } catch (error) {
            toast.error('Chỉnh Sửa Chính Sách Thất Bại');
            console.log('Error in edit policy', error);
        }

    };
    const handleDeleteTitle = async () => {
        try {
            if (window.confirm('Xác nhận xóa toàn bộ chính sách?')) {
                for (const policy of recordsData) {
                    await policyAPI.deletePolicys(policy.id);
                }
                const response = await policyAPI.deletePolicyTitle(policyTitle.id);
                toast.success('Xóa Chính Sách Thành Công');
                setModal17(false);
                setIsUpdate(true);
            }

        } catch (error) {
            toast.error('Không Thể Xóa Chính Sách - Có Chính Sách Đang Được Sử Dụng');
        }
    };
    const handleDeletePolicys = async (idPolicys: string) => {
        try {
            if (window.confirm('Xác nhận xóa chính sách?')) {
            const response = await policyAPI.deletePolicys(idPolicys);
            toast.success('Xóa Chính Sách Thành Công');
            setModal17(false);
            setIsUpdate(true);
            }
        } catch (error) {
            toast.error('Không Thể Xóa Chính Sách - Có Chính Sách Đang Được Sử Dụng');
        }
    };
    return (
        <div>
            <Transition appear show={modal17} as={Fragment}>
                <Dialog
                    as="div"
                    open={modal17}
                    onClose={() => {setModal17(false)}}
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
                                    <div className="p-5">
                                        <Formik
                                            initialValues={{}} // Add the appropriate initial values here
                                            onSubmit={(values) => {
                                                handleSubmit(values);
                                            }}
                                        >
                                            {({ values, handleChange }) => (
                                                <Form>
                                                    <div className="mb-5 mt-5 md:mb-0">
                                                        <div className="mt-4">
                                                            <h5 className="text-lg font-semibold dark:text-white-light">
                                                                Chỉnh sửa chính sách
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <div>
                                                            <label
                                                                className="font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                                htmlFor="amenityTitle"
                                                            >
                                                                Danh mục chính sách
                                                            </label>
                                                            <input
                                                                id="amenityTitle"
                                                                type="text"
                                                                name="policyTitleData"
                                                                className="form-input title-policy font-bold "
                                                                value={policyTitle.name}
                                                                disabled

                                                            />
                                                        </div>
                                                    </div>

                                                    {recordsData.map((record, index) => (
                                                        <div key={record.id} className="mt-2">
                                                                <div className="flex  w-full justify-center mb-5">
                                                                    <div className="w-full cursor-pointer border border-gray-500/20 rounded-md shadow-[rgb(31_45_61_/_10%)_0px_2px_10px_1px] dark:shadow-[0_2px_11px_0_rgb(6_8_24_/_39%)] p-6 pt-12 mt-8 relative">
                                                                        <div className="custom-icon-home text-red-800 absolute  ltr:right-0  rtl:right-0 -top-4 w-8 h-8 rounded-md flex items-center justify-center mb-5 mx-auto"
                                                                            onClick={() => handleDeletePolicys(record.id)}>
                                                                            <IconMinusCircle></IconMinusCircle>
                                                                        </div>
                                                                        <div className='w-full'>
                                                                        <label
                                                                            className="font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                                            htmlFor={`additionalAmenityDetails${index}`}
                                                                        >
                                                                            Tiêu đề chính sách {index + 1}
                                                                        </label>
                                                                        <input
                                                                            id={`additionalPolicyDetails${index}`}
                                                                            type="text"
                                                                            name="description"
                                                                            className="form-input"
                                                                            value={record.description}
                                                                            onChange={(event) => handleInputChange2(event, index)}
                                                                        />
                                                                        </div>
                                                                    <div>
                                                                        <label
                                                                            className="font-bold text-[#bc3433] dark:text-[#f7f6f6] mt-2"
                                                                            htmlFor={`additionalAmenityDetails${index}`}
                                                                        >
                                                                            Mô tả chính sách {index + 1}
                                                                        </label>
                                                                        <textarea
                                                                            id={`additionalPolicy${index}`}
                                                                            name="subDescription"
                                                                            className="form-input"
                                                                            value={record.subDescription}
                                                                            onChange={(event) => handleInputChange2(event, index)}
                                                                            rows={4}
                                                                        />
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                    ))}

                                                    <div className="mt-8 flex items-center justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setModal17(false);
                                                            }}
                                                            className="btn btn-outline-warning"
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger ltr:ml-4 rtl:mr-4"
                                                            onClick={() => {
                                                                handleDeleteTitle();
                                                            }}
                                                        >
                                                            Xóa
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-outline-primary ltr:ml-4 rtl:mr-4"
                                                        >
                                                            Lưu
                                                        </button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>

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
