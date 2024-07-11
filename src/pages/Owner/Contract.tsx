import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewPDF from '../Components/Pdf';
import { pdfjs } from 'react-pdf';
import pdf from '../../file/contractview.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const PropertyContract: React.FC = () => {
    const [isChecked, setChecked] = useState(false);
    const navigate = useNavigate();

    const handleCheckboxChange = () => {
        setChecked(!isChecked);
    };
    const location = useLocation();
    console.log(location?.state);

    return (
        <div className="bg-white p-8">
            <h2 className="font-extraboldbold text-center text-3xl">
                THÔNG TIN HỢP ĐỒNG
            </h2>
            <div className="mb-4">
                <div className="mb-4 pt-2">
                    <p className="mb-2 text-xl font-bold">
                        1. Thông Tin Quản Trị Viên:
                    </p>
                    <p>
                        <span className="font-extrabold">- Họ Tên:</span>{' '}
                        <span className="font-semibold">Admin</span>
                    </p>
                    <p>
                        <span className="font-extrabold">- Vai Trò:</span>{' '}
                        <span className="font-semibold">
                            Quản Trị Viên HomeTravel
                        </span>
                    </p>
                    <p>
                        <span className="font-extrabold">- Địa Chỉ Email:</span>{' '}
                        <span className="font-semibold">
                            adminhometravel@gmail.com
                        </span>
                    </p>
                    <p>
                        <span className="font-extrabold">- Số Điện Thoại:</span>{' '}
                        <span className="font-semibold">0888.666.888</span>
                    </p>
                </div>
            </div>

            <div className="mb-4">
                <div className="mb-4 pt-2">
                    <p className="mb-2 text-xl font-bold">
                        2. Thông Tin Chủ Homestay:
                    </p>
                    <p>
                        <span className="font-extrabold">- Họ Tên:</span>{' '}
                        <span className="font-semibold">
                            {location.state?.lastName +
                                ' ' +
                                location.state?.firstName}
                        </span>
                    </p>
                    <p>
                        <span className="font-extrabold">- Vai Trò:</span>{' '}
                        <span className="font-semibold">Chủ Homestay</span>
                    </p>
                    <p>
                        <span className="font-extrabold">- Địa Chỉ Email:</span>{' '}
                        <span className="font-semibold">
                            {location.state?.email}
                        </span>
                    </p>
                    <p>
                        <span className="font-extrabold">- Số Điện Thoại:</span>{' '}
                        <span className="font-semibold">
                            {location.state?.phoneNumber}
                        </span>
                    </p>
                </div>
            </div>
            <h3 className="mb-2 text-xl font-bold">3. Điều Khoản Hợp Đồng:</h3>
            <div className="flex w-full justify-center">
                {/* <ViewPDF file={pdf}/> */}
                <object
                    data={location?.state?.contractFile}
                    type="application/pdf"
                    className="h-[600px] w-[880px]"
                ></object>
            </div>
            <h3 className="mb-2 mt-2 pt-2 text-xl font-bold">
                4. Xác Nhận Thông Tin Điều Khoản:
            </h3>
            <div className="flex-1">
                <div className="mb-2 flex items-center bg-white">
                    <input
                        type="checkbox"
                        id="agreeCheckbox1"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                    />
                    <h4>
                        Tôi cam kết và đảm bảo rằng: Homestay có tất cả các giấy
                        phép và giấy phép hợp lệ theo quy định hiện hành.
                    </h4>
                </div>
                <div className="mb-2 flex items-center bg-white">
                    <input
                        type="checkbox"
                        id="agreeCheckbox2"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                    />
                    <h4>
                        Các quy định pháp luật liên quan đến hoạt động kinh
                        doanh của Homestay.
                    </h4>
                </div>
                {/* ... (Phần checkbox khác) */}
            </div>
            <div className="flex w-full items-center justify-center">
                <button
                    type="button"
                    className="btn mr-2 mt-2 border-t-green-500 bg-green-600 text-white"
                    onClick={() => navigate('/register')}
                >
                    Quay Lại
                </button>
                <button
                    type="button"
                    className={`btn btn-outline-primary mt-2 ${
                        !isChecked ? 'cursor-not-allowed bg-gray-300' : ''
                    }`}
                    disabled={!isChecked}
                    onClick={() => {
                        if (isChecked) {
                            // Xử lý logic khi checkbox được chọn
                            navigate('/');
                        }
                    }}
                >
                    Tôi Đồng Ý Tất Cả Điều Khoản
                </button>
            </div>
        </div>
    );
};

export default PropertyContract;
