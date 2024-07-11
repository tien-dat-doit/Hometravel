import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import * as Yup from 'yup';
import IconBell from '../../components/Icon/IconBell';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import moment from 'moment';
import { toast } from 'react-toastify';
import useAuth from '../../hook/useAuth';
import homestayAPI from '../../util/homestayAPI';
import roomAPI from '../../util/roomAPI';

const validationSchema = Yup.object({
    status: Yup.string().required('Vui lòng chọn trạng thái!'),
    startTime: Yup.date()
        // .required('Ngày bắt đầu (dự kiến) bắt buộc có')
        .min(
            new Date(Date.now() - 864e5),
            'Ngày bắt đầu (dự kiến) không được là ngày trong quá khứ!',
        ),
    endTime: Yup.date()
        // .required('Ngày kết thúc (dự kiến) bắt buộc có')
        .min(
            Yup.ref('startTime'),
            'Ngày kết thúc (dự kiến) phải sau ngày bắt đầu (dự kiến)',
        )
        .test(
            'max-days',
            'Ngày kết thúc (dự kiến) tối đa 30 ngày kể từ ngày bắt đầu',
            function (value) {
                const { startTime } = this.parent;
                const maxEndDate = new Date(startTime.getTime() + 864e5 * 30);

                return !value || value <= maxEndDate;
            },
        ),
});

export default function ModalUpdate({
    modal17,
    setModal17,
    isHomestay,
    data,
    setFilterObject,
}: any) {
    const { auth }: any = useAuth();
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
                                            <IconBell className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="text-center text-lg font-extrabold text-[#ea1365] dark:text-[#f7f6f6]">
                                        {' '}
                                        {isHomestay
                                            ? 'TRẠNG THÁI HOMESTAY'
                                            : 'TRẠNG THÁI PHÒNG'}
                                    </div>
                                    <div className="p-5">
                                        {data && (
                                            <Formik
                                                initialValues={{
                                                    startTime:
                                                        data?.startDateInActiveTemporary
                                                            ? moment(
                                                                  data?.startDateInActiveTemporary,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : new Date(),
                                                    endTime:
                                                        data?.endDateInActiveTemporary
                                                            ? moment(
                                                                  data?.endDateInActiveTemporary,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : new Date(),
                                                    status: data?.status ?? '',
                                                }}
                                                validationSchema={
                                                    validationSchema
                                                }
                                                onSubmit={async (values) => {
                                                    console.log(values, data);
                                                    if (isHomestay) {
                                                        try {
                                                            const submitForm =
                                                                new FormData();
                                                            if (
                                                                values.status ===
                                                                'INACTIVE TEMPORARY'
                                                            ) {
                                                                submitForm.append(
                                                                    'id',
                                                                    data?.id,
                                                                );
                                                                submitForm.append(
                                                                    'name',
                                                                    data?.name,
                                                                );
                                                                submitForm.append(
                                                                    'acreage',
                                                                    data?.acreage,
                                                                );
                                                                submitForm.append(
                                                                    'city',
                                                                    data?.city,
                                                                );
                                                                submitForm.append(
                                                                    'district',
                                                                    data?.district,
                                                                );
                                                                submitForm.append(
                                                                    'commune',
                                                                    data?.commune,
                                                                );
                                                                submitForm.append(
                                                                    'street',
                                                                    data?.street,
                                                                );
                                                                submitForm.append(
                                                                    'house',
                                                                    data?.house,
                                                                );
                                                                submitForm.append(
                                                                    'hamlet',
                                                                    data?.hamlet,
                                                                );
                                                                submitForm.append(
                                                                    'address',
                                                                    data?.address,
                                                                );
                                                                submitForm.append(
                                                                    'checkInTime',
                                                                    data?.checkInTime,
                                                                );
                                                                submitForm.append(
                                                                    'checkOutTime',
                                                                    data?.checkOutTime,
                                                                );
                                                                submitForm.append(
                                                                    'description',
                                                                    data?.description,
                                                                );
                                                                submitForm.append(
                                                                    'status',
                                                                    values.status,
                                                                );
                                                                submitForm.append(
                                                                    'rejectReason',
                                                                    data?.rejectReason,
                                                                );
                                                                submitForm.append(
                                                                    'rating',
                                                                    data?.rating ?? 0,
                                                                );
                                                                submitForm.append(
                                                                    'penaltyRate',
                                                                    data?.penaltyRate ?? 0,
                                                                );
                                                                submitForm.append(
                                                                    'penaltyDate',
                                                                    data?.penaltyDate ?? 0,
                                                                );
                                                                submitForm.append(
                                                                    'depositRate',
                                                                    data?.depositRate ?? 0,
                                                                );                                                          
                                                                submitForm.append(
                                                                    'startDateInActiveTemporary',
                                                                    values.startTime?.toString(),
                                                                );
                                                                submitForm.append(
                                                                    'endDateInActiveTemporary',
                                                                    values.endTime?.toString(),
                                                                );
                                                                submitForm.append(
                                                                    'ownerId',
                                                                    auth?.user
                                                                        ?.id,
                                                                );
                                                            } else {
                                                                submitForm.append(
                                                                    'id',
                                                                    data?.id,
                                                                );
                                                                submitForm.append(
                                                                    'name',
                                                                    data?.name,
                                                                );
                                                                submitForm.append(
                                                                    'acreage',
                                                                    data?.acreage,
                                                                );
                                                                submitForm.append(
                                                                    'city',
                                                                    data?.city,
                                                                );
                                                                submitForm.append(
                                                                    'district',
                                                                    data?.district,
                                                                );
                                                                submitForm.append(
                                                                    'commune',
                                                                    data?.commune,
                                                                );
                                                                submitForm.append(
                                                                    'street',
                                                                    data?.street,
                                                                );
                                                                submitForm.append(
                                                                    'house',
                                                                    data?.house,
                                                                );
                                                                submitForm.append(
                                                                    'hamlet',
                                                                    data?.hamlet,
                                                                );
                                                                submitForm.append(
                                                                    'address',
                                                                    data?.address,
                                                                );
                                                                submitForm.append(
                                                                    'checkInTime',
                                                                    data?.checkInTime,
                                                                );
                                                                submitForm.append(
                                                                    'checkOutTime',
                                                                    data?.checkOutTime,
                                                                );
                                                                submitForm.append(
                                                                    'description',
                                                                    data?.description,
                                                                );
                                                                submitForm.append(
                                                                    'status',
                                                                    values.status,
                                                                );
                                                                submitForm.append(
                                                                    'rejectReason',
                                                                    data?.rejectReason,
                                                                );
                                                                submitForm.append(
                                                                    'rating',
                                                                    data?.rating ?? 0,
                                                                );
                                                                submitForm.append(
                                                                    'penaltyRate',
                                                                    data?.penaltyRate ?? 0,
                                                                );
                                                                submitForm.append(
                                                                    'penaltyDate',
                                                                    data?.penaltyDate ?? 0,
                                                                );
                                                                submitForm.append(
                                                                    'depositRate',
                                                                    data?.depositRate ?? 0,
                                                                );
                                                                submitForm.append(
                                                                    'ownerId',
                                                                    auth?.user
                                                                        ?.id,
                                                                );
                                                            }
                                                            const response: any =
                                                                await homestayAPI.updateStatus(
                                                                    submitForm,
                                                                    data?.id,
                                                                );
                                                            console.log(
                                                                'response',
                                                                response,
                                                            );
                                                            toast.success(
                                                                response?.msg ??'Cập nhật trạng thái thành công',
                                                            );
                                                            setFilterObject(
                                                                (
                                                                    prev: any,
                                                                ) => ({
                                                                    ...prev,
                                                                    pageIndex: 1,
                                                                }),
                                                            );
                                                            setModal17(false);
                                                        } catch (error: any) {                                              
                                                            toast.error(
                                                                error?.response?.data?.msg ?? 'Cập nhật trạng thái thất bại!',
                                                            );
                                                        }
                                                    } else {
                                                        try {
                                                            let submitForm = {};
                                                            if (
                                                                values.status ===
                                                                'INACTIVE TEMPORARY'
                                                            ) {
                                                                submitForm = {
                                                                    id: data?.id,
                                                                    name: data?.name,
                                                                    numberOfBeds:
                                                                        data?.numberOfBeds,
                                                                    acreage:
                                                                        data?.acreage,
                                                                    capacity:
                                                                        data?.capacity,
                                                                    price: data?.price,
                                                                    status: values.status,
                                                                    weekendPrice:
                                                                        data?.weekendPrice,
                                                                    rejectReason:
                                                                        data?.rejectReason,
                                                                    startDateInActiveTemporary:
                                                                        values.startTime,
                                                                    endDateInActiveTemporary:
                                                                        values.endTime,
                                                                    homeStayId:
                                                                        data?.homeStayId,
                                                                };
                                                            } else {
                                                                submitForm = {
                                                                    id: data?.id,
                                                                    name: data?.name,
                                                                    numberOfBeds:
                                                                        data?.numberOfBeds,
                                                                    acreage:
                                                                        data?.acreage,
                                                                    capacity:
                                                                        data?.capacity,
                                                                    rejectReason:
                                                                        data?.rejectReason,
                                                                    price: data?.price,
                                                                    status: values.status,
                                                                    weekendPrice:
                                                                        data?.weekendPrice,
                                                                    homeStayId:
                                                                        data?.homeStayId,
                                                                };
                                                            }

                                                            console.log(
                                                                'submitForm',
                                                                submitForm,
                                                            );
                                                            const response: any =
                                                                await roomAPI.updateStatus(
                                                                    submitForm,
                                                                    data?.id,
                                                                );
                                                            console.log(
                                                                'response',
                                                                response,
                                                            );
                                                            toast.success(
                                                                response?.msg ?? 'Cập nhật trạng thái thành công',
                                                            );
                                                            setFilterObject(
                                                                (
                                                                    prev: any,
                                                                ) => ({
                                                                    ...prev,
                                                                    pageIndex: 1,
                                                                }),
                                                            );
                                                            setModal17(false);
                                                        } catch (error: any) {
                                                            toast.error(
                                                                error?.response?.data?.msg ?? 'Cập nhật trạng thái thất bại!',
                                                            );
                                                        }
                                                    }

                                                    
                                                }}
                                            >
                                                {({ values }) => (
                                                    <Form>
                                                        <div className="mb-5 md:mb-0">
                                                            <div className="mt-4">
                                                                <div>
                                                                    <label
                                                                        className="font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                                        htmlFor="status"
                                                                    >
                                                                        {isHomestay
                                                                            ? 'Tên Homestay'
                                                                            : 'Tên Phòng'}
                                                                    </label>
                                                                    <input
                                                                        id="status"
                                                                        type="text"
                                                                        name="status"
                                                                        className="form-input"
                                                                        defaultValue={
                                                                            data?.name
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 md:mb-0">
                                                            <div className="mb-5 md:mb-0">
                                                                <label className="mb-0 mt-2 block font-bold text-[#bc3433] dark:text-[#f7f6f6]">
                                                                    Trạng Thái:
                                                                </label>
                                                                <Field
                                                                    as="select"
                                                                    name="status"
                                                                    className="form-select w-full text-black"
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Chọn
                                                                        Trạng
                                                                        Thái
                                                                    </option>
                                                                    <option value="ACTIVE">
                                                                        Hoạt
                                                                        Động
                                                                    </option>
                                                                    <option value="INACTIVE TEMPORARY">
                                                                        Tạm
                                                                        Ngưng
                                                                        Hoạt
                                                                        Động
                                                                    </option>
                                                                </Field>
                                                                <div>
                                                                    <ErrorMessage
                                                                        component="a"
                                                                        name={`status`}
                                                                        className="ml-2 text-red-600"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {values.status ===
                                                            'INACTIVE TEMPORARY' && (
                                                            <div className="mt-4">
                                                                <div>
                                                                    <label
                                                                        htmlFor="startTime"
                                                                        className="mb-0 block font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                                    >
                                                                        Ngày Bắt
                                                                        Đầu:
                                                                    </label>

                                                                    <Field
                                                                        className="form-input mr-2 w-full md:mb-2 md:w-full"
                                                                        id="startTime"
                                                                        type="date"
                                                                        name={`startTime`}
                                                                    />
                                                                    <div>
                                                                        <ErrorMessage
                                                                            component="a"
                                                                            name={`startTime`}
                                                                            className="ml-2 text-red-600"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="mb-5 md:mb-0">
                                                                    <label
                                                                        htmlFor="endTime"
                                                                        className="mb-0 mt-2 block font-bold text-[#bc3433] dark:text-[#f7f6f6]"
                                                                    >
                                                                        Ngày Kết
                                                                        Thúc:
                                                                    </label>

                                                                    <Field
                                                                        className="form-input mr-2 w-full md:w-full"
                                                                        id="endTime"
                                                                        type="date"
                                                                        name={`endTime`}
                                                                    />
                                                                    <div>
                                                                        <ErrorMessage
                                                                            component="a"
                                                                            name={`endTime`}
                                                                            className="ml-2 text-red-600"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setModal17(
                                                                        false,
                                                                    )
                                                                }
                                                                className="btn btn-outline-danger"
                                                            >
                                                                Quay Lại
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
                                        )}
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
