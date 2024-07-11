import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ErrorMessage, Field, FieldArray } from 'formik';

export default function ModalRoomAmenities({
    values,
    index,
    initValueAmenities,
}: any) {
    const [modal17, setModal17] = useState<boolean>(false);

    // const [isChecked, setIsChecked] = useState(false);

    // const handleCheckboxChange = () => {
    //     setIsChecked((prevChecked) => !prevChecked);
    // };

    return (
        <div>
            <button
                type="button"
                onClick={() => setModal17(true)}
                className="btn btn-primary"
            >
                Chọn Tiện Ích Phòng {index + 1}
            </button>
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
                                <Dialog.Panel className="panel my-8 w-[1100px] overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white">
                                    <div className=" mx-auto p-4">
                                        <div className="text-black-500 mb-2 ml-4 text-lg font-bold">
                                            Tiện Ích Phòng {index + 1}:
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            {initValueAmenities?.map(
                                                (amenity: any, index1: any) => (
                                                    <div key={amenity?.id}>
                                                        <div className="rounded p-4">
                                                            {/* title commom */}
                                                            <div className="mb-2 flex items-center font-bold">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="1.5"
                                                                    stroke="currentColor"
                                                                    className="h-6 w-6"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                                                                    />
                                                                </svg>{' '}
                                                                {amenity?.name}
                                                            </div>
                                                            {/* render list amenity detail of it's title */}
                                                            {amenity?.amenities?.map(
                                                                (
                                                                    amenityDetail: any,
                                                                    index2: any,
                                                                ) => {
                                                                    return (
                                                                        <div
                                                                            className="space-y-2"
                                                                            key={
                                                                                amenityDetail?.id
                                                                            }
                                                                        >
                                                                            <Field
                                                                                name={`listRoom.${index}.roomAmenitieTitles[${index1}].roomAmenitieSelected`}
                                                                            >
                                                                                {({
                                                                                    field,
                                                                                    form,
                                                                                }: any) => (
                                                                                    <label className="inline-flex">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={
                                                                                                values.listRoom[
                                                                                                    index
                                                                                                ]?.roomAmenitieTitles[
                                                                                                    index1
                                                                                                ]?.roomAmenitieSelected?.findIndex(
                                                                                                    (
                                                                                                        e: any,
                                                                                                    ) =>
                                                                                                        e ===
                                                                                                        amenityDetail?.id,
                                                                                                ) ===
                                                                                                -1
                                                                                                    ? false
                                                                                                    : true
                                                                                            }
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) => {
                                                                                                if (
                                                                                                    e
                                                                                                        .target
                                                                                                        .checked
                                                                                                ) {
                                                                                                    const newArray =
                                                                                                        [
                                                                                                            ...values
                                                                                                                .listRoom[
                                                                                                                index
                                                                                                            ]
                                                                                                                ?.roomAmenitieTitles[
                                                                                                                index1
                                                                                                            ]
                                                                                                                ?.roomAmenitieSelected,
                                                                                                            amenityDetail?.id,
                                                                                                        ];

                                                                                                    form.setFieldValue(
                                                                                                        field.name,
                                                                                                        newArray,
                                                                                                    );
                                                                                                } else {
                                                                                                    const newArray =
                                                                                                        values.listRoom[
                                                                                                            index
                                                                                                        ]?.roomAmenitieTitles[
                                                                                                            index1
                                                                                                        ]?.roomAmenitieSelected?.filter(
                                                                                                            (
                                                                                                                e: any,
                                                                                                            ) =>
                                                                                                                e !==
                                                                                                                amenityDetail?.id,
                                                                                                        );

                                                                                                    form.setFieldValue(
                                                                                                        field.name,
                                                                                                        newArray,
                                                                                                    );
                                                                                                }
                                                                                            }}
                                                                                            className="peer form-checkbox outline-primary"
                                                                                        />
                                                                                        <span className="peer-checked:text-primary">
                                                                                            {
                                                                                                amenityDetail?.name
                                                                                            }
                                                                                        </span>
                                                                                    </label>
                                                                                )}
                                                                            </Field>
                                                                        </div>
                                                                    );
                                                                    // )
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                            {/* Cột 1 */}

                                            {/* Cột 2 */}

                                            {/* Cột 3 */}
                                        </div>

                                        <div className="rounded p-4">
                                            <div className="mb-2 flex items-center font-bold"></div>
                                            <div className="space-y-2">

                                                <label className="inline-flex" htmlFor={"isOtherAmenities"}>
                                                    <Field
                                                        type="checkbox"
                                                        id="isOtherAmenities"
                                                        name = {`listRoom.${index}.isOtherAmenities`}
                                                        className="peer form-checkbox outline-primary"
                                                        checked={values.listRoom[index].isOtherAmenities}
                                                        // onChange={
                                                        //     handleCheckboxChange
                                                        // }
                                                    />
                                                    <span className="peer-checked:text-primary">
                                                        Khác
                                                    </span>
                                                </label>
                                                {/* Thêm các option khác nếu cần */}
                                            </div>
                                            {values.listRoom[index].isOtherAmenities && (
                                                <FieldArray
                                                    name={`listRoom.${index}.listExtensionOfRoom`}
                                                >
                                                    {({ push, remove }) => (
                                                        <div className="grid grid-cols-3 gap-4">
                                                            {values.listRoom[
                                                                index
                                                            ].listExtensionOfRoom.map(
                                                                (
                                                                    extension: any,
                                                                    indexValue: any,
                                                                ) => (
                                                                    <div
                                                                        className="mt-8 flex items-center px-4"
                                                                        key={
                                                                            indexValue
                                                                        }
                                                                    >
                                                                        <div className="w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                                                                            <div className="text-lg font-bold">
                                                                                {/* Tiện Ích{' '} */}
                                                                                {indexValue +
                                                                                    1}

                                                                                .
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex-grow sm:mb-0">
                                                                            <Field
                                                                                className="form-input w-full lg:w-[200px]"
                                                                                type="text"
                                                                                name={`listRoom.${index}.listExtensionOfRoom.${indexValue}`}
                                                                                placeholder={`#Nhập tiện ích ${indexValue + 1}`}
                                                                            />
                                                                            <div>
                                                                                {' '}
                                                                                <ErrorMessage
                                                                                    component="a"
                                                                                    name={`listRoom.${index}.listExtensionOfRoom.${indexValue}`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            className="btn btn-outline-danger ml-2 rounded-lg p-2 font-extrabold"
                                                                            onClick={() => {
                                                                                let confirmDelete =
                                                                                    window.confirm(
                                                                                        `Bạn chắc chắn muốn xóa Tiện Ích ${indexValue + 1} ?`,
                                                                                    );
                                                                                if (
                                                                                    confirmDelete
                                                                                ) {
                                                                                    remove(
                                                                                        indexValue,
                                                                                    );
                                                                                    return;
                                                                                }
                                                                            }}
                                                                        >
                                                                            X
                                                                        </button>
                                                                    </div>
                                                                ),
                                                            )}
                                                            <div className="mb-6 mt-5 flex items-center justify-center sm:mb-0">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-secondary mb-2 me-2 rounded-lg border-t-cyan-50 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-purple-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-purple-300 dark:shadow-lg dark:shadow-purple-800/80 dark:focus:ring-purple-800"
                                                                    onClick={() =>
                                                                        push('')
                                                                    }
                                                                >
                                                                    Thêm Tiện
                                                                    Ích
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </FieldArray>
                                            )}
                                        </div>
                                        <div className="mb-6 mt-5 flex items-center justify-center sm:mb-0">
                                            <button
                                                type="button"
                                                className="btn btn-secondary mb-2 me-2 rounded-lg border-t-cyan-50 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-purple-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-purple-300 dark:shadow-lg dark:shadow-purple-800/80 dark:focus:ring-purple-800"
                                                onClick={() =>
                                                    setModal17(false)
                                                }
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
