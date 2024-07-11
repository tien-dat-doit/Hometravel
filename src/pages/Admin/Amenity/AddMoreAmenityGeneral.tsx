import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState,useContext } from 'react';
import { UpdateContext } from '../../../context/UpdateContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import * as Yup from 'yup';

import {
    Form,
    Formik,
    FormikValues,
} from 'formik';
import { toast } from 'react-toastify';
import amenityAPI from '../../../util/amenityAPI';
import IconPlusCircle from '../../../components/Icon/IconPlusCircle';
export default function AddMoreAmenityGeneral({ modal17, setModal17, amenityTitle4 }: any) {
    const [formData, setFormData] = useState({
        amenitieData: [{
            id: '',
            name: '',
            status: 'ACTIVE',
            generalAmenitieTitleId:''
        }],
    });
    const [blocks, setBlocks] = useState([0]);
    const addBlock = () => {
        setBlocks([...blocks, blocks.length]);
        setFormData(prevState => ({
            ...prevState,
            amenitieData: [
                ...prevState.amenitieData,
                { id: '', name: '', status: 'ACTIVE', generalAmenitieTitleId:''},
            ],
        }));
    };
    const resetData = () => {
        setBlocks([0]);
        setFormData({
          ...formData,
          amenitieData: [
            { id: '', name: '', status: 'ACTIVE', generalAmenitieTitleId:''},
          ],
        });
      };
    const { setIsUpdate } = useContext(UpdateContext);
    const addAmenity = async (amenitieData: any) => {
        try {
            const promises = amenitieData.map((amenity : any)=> amenityAPI.createAmenitysGeneralAmenitys(amenity));

            const responses = await Promise.all(promises);
    
            setIsUpdate(true);
            resetData();
            toast.success('Tạo Tiện Ích Thành Công');
            return { responses };
            
    } catch (error) {
        console.error(error);
        toast.error('Tạo Tiện Ích Thất Bại');
    }
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { name, value } = event.target;
    
        setFormData(prevState => {
            const newamenitieData = [...prevState.amenitieData];
            newamenitieData[index] = {
                ...newamenitieData[index],
                [name]: value,
                generalAmenitieTitleId: amenityTitle4.id,
                
            };
            return {
                ...prevState,
                amenitieData: newamenitieData,
            };
        });
    };
    

    const handleSubmit = (values: FormikValues) => {
        addAmenity(formData.amenitieData,);
        
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
                                    <div className="p-5">
                                        <Formik
                                            initialValues={{}} // Add the appropriate initial values here
                                            onSubmit={(values) => {
                                                setModal17(false);
                                                handleSubmit(values);

                                            }}
                                        >
                                            {({ values,handleChange }) => (
                                                <Form>
                                                    <div className="mb-5 mt-5 md:mb-0">
                                                        <div className="mt-4">
                                                            <h5 className="text-lg font-semibold dark:text-white-light">
                                                                Thêm tiện ích phòng mới
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <div>
                                                            <label
                                                                className="font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                                htmlFor="amenityTitle"
                                                            >
                                                                Danh mục tiện ích 
                                                            </label>
                                                            <input
                                                                id="amenityTitle"
                                                                type="text"
                                                                name="name"
                                                                className="form-input"
                                                                value={amenityTitle4.name}
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                
                                                    {formData.amenitieData.map((amenity, index) => (
                                                        <div key={index} className="mt-2">
                                                            <div className="flex  w-full justify-center mb-2">
                                                                <div className="w-full border border-gray-500/20 rounded-md shadow-[rgb(31_45_61_/_10%)_0px_2px_10px_1px] dark:shadow-[0_2px_11px_0_rgb(6_8_24_/_39%)] p-6 pt-6 mt-2 relative">
                                                            <div>
                                                                <label
                                                                    className="font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                                    htmlFor={`additionalAmenityDetails${index}`}
                                                                >
                                                                    Tiện ích {index + 1}
                                                                </label>
                                                                <input
                                                                    id={`additionalPolicyDetails${index}`}
                                                                    type="text"
                                                                    name="name"
                                                                    className="form-input"
                                                                    value={amenity.name}
                                                                    onChange={(event) => handleInputChange(event, index)}
                                                                />
                                                            </div>
                                                            </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="mt-4">
                                                        <button type="button" className="btn btn-outline-primary" onClick={addBlock}>
                                                        <IconPlusCircle></IconPlusCircle>
                                                        </button>
                                                    </div>
                                                
                                                    <div className="mt-8 flex items-center justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setModal17(false);
                                                                setIsUpdate(true);
                                                            }}
                                                            className="btn btn-outline-danger"
                                                        >
                                                            Hủy
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
