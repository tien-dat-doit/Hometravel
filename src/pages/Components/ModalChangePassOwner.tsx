import { Dialog, Transition } from '@headlessui/react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Fragment } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import * as Yup from 'yup';
import IconXCircle from '../../components/Icon/IconXCircle';
import authorizeAPI from '../../util/authorizeAPI';
import { toast } from 'react-toastify';
import useAuth from '../../hook/useAuth';
import { useNavigate } from 'react-router-dom';
import IconUser from '../../components/Icon/IconUser';
import IconLock from '../../components/Icon/IconLock';

const validationSchema = Yup.object({
    oldPassword: Yup.string().required('Đây Là Thông Tin Bắt Buộc !'),
    newPassword: Yup.string().required('Đây Là Thông Tin Bắt Buộc !')
    .notOneOf([Yup.ref('oldPassword')], 'Mật khẩu mới phải khác mật khẩu cũ!'),
    passwordConfirmation: Yup.string().oneOf(
        [Yup.ref('newPassword'), null],
        'Mật Khẩu Xác Nhận Không Trùng Khớp !',
    ),
});

export default function ModalChangePasswordOwner({ modal17, setModal17 }: any) {
    const { auth, setAuth }: any = useAuth();
    const navigate = useNavigate();
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
                                <Dialog.Panel className="panel my-8 pb-4 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white">
                                    <div className="flex items-center justify-center p-5 text-base font-medium text-[#f3f3f3] dark:text-white">
                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ea1365] dark:bg-[#ef1262]">
                                            <IconLock className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="text-center text-lg font-extrabold text-[#ea1365] dark:text-[#f7f6f6]">
                                        Cập Nhật Mật Khẩu Mới
                                    </div>
                                    <div className="ml-4 mr-3 mt-4">
                                        <Formik
                                            initialValues={{
                                                oldPassword: '',
                                                newPassword: '',
                                                passwordConfirmation: '',
                                            }}
                                            validationSchema={validationSchema}
                                            onSubmit={async (values) => {
                                                console.log(values);
                                                try {
                                                    const dataSubmit = {
                                                        oldPassword:
                                                            values.oldPassword,
                                                        newPassword:
                                                            values.newPassword,
                                                        ownerId: auth?.user?.id,
                                                    };

                                                    const response: any =
                                                        await authorizeAPI.updatePasswordOwner(
                                                            dataSubmit,
                                                        );
                                                    toast.success(response?.msg ?? "Cập nhật thành công!")  
                                                    setAuth({}) 
                                                    localStorage.removeItem('userInfor')                                              
                                                    navigate('/login');
                                                    toast.success(response.msg);
                                                } catch (error: any) {
                                                    toast.error(
                                                        error?.response?.data
                                                            ?.msg ??
                                                            'Cập nhật thất bại',
                                                    );
                                                }
                                            }}
                                        >
                                            {({ isSubmitting, isValid }) => (
                                                <Form className="space-y-5 dark:text-white">
                                                    <div className="">
                                                        <div className="">
                                                            <label htmlFor="oldPassword">
                                                                Mật Khẩu Cũ:
                                                            </label>
                                                            <div className="relative text-white-dark">
                                                                <Field
                                                                    id="oldPassword"
                                                                    name="oldPassword"
                                                                    type="password"
                                                                    placeholder="Mật Khẩu Cũ.."
                                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                                />
                                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                                    <IconUser
                                                                        fill={
                                                                            true
                                                                        }
                                                                    />
                                                                </span>
                                                            </div>
                                                            <div className="ml-2 text-red-400">
                                                                {' '}
                                                                <ErrorMessage
                                                                    component="a"
                                                                    name={`oldPassword`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <label htmlFor="newPassword">
                                                                Mật Khẩu Mới:
                                                            </label>
                                                            <div className="relative text-white-dark">
                                                                <Field
                                                                    id="newPassword"
                                                                    name="newPassword"
                                                                    type="password"
                                                                    placeholder="Mật Khẩu Mới.."
                                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                                />
                                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                                    <IconUser
                                                                        fill={
                                                                            true
                                                                        }
                                                                    />
                                                                </span>
                                                            </div>
                                                            <div className="ml-2 text-red-400">
                                                                {' '}
                                                                <ErrorMessage
                                                                    component="a"
                                                                    name={`newPassword`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <label htmlFor="passwordConfirmation">
                                                                Xác Nhận Mật
                                                                Khẩu Mới:
                                                            </label>
                                                            <div className="relative text-white-dark">
                                                                <Field
                                                                    id="passwordConfirmation"
                                                                    name="passwordConfirmation"
                                                                    type="password"
                                                                    placeholder="Vui lòng nhập mật khẩu xác nhận..."
                                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                                />
                                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                                    <IconUser
                                                                        fill={
                                                                            true
                                                                        }
                                                                    />
                                                                </span>
                                                            </div>
                                                            <div className="ml-2 text-red-400">
                                                                {' '}
                                                                <ErrorMessage
                                                                    component="a"
                                                                    name={`passwordConfirmation`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 mt-2 flex items-center justify-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setModal17(
                                                                    false,
                                                                )
                                                            }
                                                            className="btn btn-outline-danger w-full"
                                                        >
                                                            Đóng
                                                        </button>
                                                        <button
                                                        disabled={isSubmitting || !isValid}
                                                            type="submit"
                                                            className="btn btn-gradient w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                                        >
                                                            Xác Nhận
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
