import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, useContext } from 'react';
import { UpdateContext } from '../../../context/UpdateContext'
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import homestayAPI from '../../../util/homestayAPI';
import useAuth from '../../../hook/useAuth';
import { Rating } from 'react-simple-star-rating';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import ModalDeleteFeedback from './ModalDeleteFeedback';
import { s } from '@fullcalendar/core/internal-common';
interface homeStay {
    id: string;
    name: string;

}
interface Feedback {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    description: string;
    rating: number;
    createdDate: string;
    touristId: string;
    homeStayId: string;
    tourist: {
        id: string;
        phoneNumber: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        gender: boolean;
        dateOfBirth: string;
        status: string;
    };
    homeStay: {
        name: string,
    }
}
interface filterObject {
    pageIndex: number;
    pageSize: number;
    sortKey: string
    sortOrder: string
    homestayName: string | null;
    rating: number | null;
}

const Managefeedback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { auth }: any = useAuth();
    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Đánh giá'));
    });
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 10,
        sortKey: "CreatedDate",
        sortOrder: "DESC",
        homestayName: null,
        rating: null,
    });
    const [loading, setLoading] = useState(true);
    const [selectFeedback, setSelectFeedback] = useState<string>('');
    const [recordsFeedback, setRecordsFeedback] = useState<Feedback[] | []>([]);
    const [isUpdate2, setIsUpdate2] = useState(false);
    const { isUpdate, setIsUpdate } = useContext(UpdateContext);
    const [modal17, setModal17] = useState(false);
    useEffect(() => {
        const fetchListHomestay = async () => {
            try {
                const response: any = await homestayAPI.getListFeedback(filterObject);
                const feedbacks = response.data ?? [];
                setRecordsFeedback(response?.data);
                setPage(response?.paging?.page ?? 1);
                setTottalRecords(response?.paging?.total ?? 10);
                setLoading(false);
                setTottalRecords(response?.paging?.total ?? 10);
                setIsUpdate(false);
            } catch (error) {
                console.log('Error in get all feedback', error);
            }
        };
        fetchListHomestay();
    }, [filterObject, isUpdate, setModal17]);

    

    const handleSearchHomestay = (e: any) => {
        setLoading(true);
        setFilterObject({ ...filterObject, homestayName: e.target.value ,pageIndex: 1});
    };
    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
    };
    const handleRecordPerPageChange =    (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
        
    };

    return (
        <div>
            
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Danh Sách Đánh giá
                    </h5>
                    <div className="flex ltr:ml-auto rtl:mr-auto">
                        <div className="flex items-center">
                            <label
                                htmlFor="statusFilter"
                                className="mr-2 w-[140px] text-right"
                            >
                                Đánh giá
                            </label>
                            <select
                                id="statusFilter"
                                className="form-select mr-1 w-full text-black"
                                onChange={(e) => {
                                    setFilterObject((prev) => ({
                                        ...prev,
                                        rating: e.target.value === 'all' ? null : Number(e.target.value),
                                        pageIndex: 1,
                                    }));
                                }}
                                value={filterObject?.rating?.toString()}
                            >
                                <option value="all">Tất cả đánh giá</option>
                                <option value="1">1 sao</option>
                                <option value="2">2 sao</option>
                                <option value="3">3 sao</option>
                                <option value="4">4 sao</option>
                                <option value="5">5 sao</option>
                            </select>
                         </div>
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Tìm kiếm homestay"
                            value={filterObject.homestayName ?? ''}
                            onChange={handleSearchHomestay}
                        />
                    </div>
                    {/* <Filters></Filters> */}
                </div>
                <div className="datatables">
                {loading ? (
                    <div className='text-center'>
                        <span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>
                        </div>
                    ) : (
                    <DataTable
                        highlightOnHover
                        className="table-hover "
                        noRecordsText="Không có đánh giá"
                        records={recordsFeedback}
                        columns={[
                            {
                                accessor: 'STT',
                                title: 'STT',
                                render: (index,email) => {
                                    return (
                                        <span>
                                            {email + 1 + (page - 1) * pageSize}
                                        </span>
                                    );
                                },
                            },
                            {
                                accessor: 'name',
                                title: 'Tên Homestay',
                                render: ( homeStay ) => (
                                    <div className="flex w-max items-center" >

                                        <div className="ml-2 flex flex-col" style={{whiteSpace: 'pre-wrap', 
                                        maxWidth: '200px',
                                    }}>
                                            <div  
                                                className="mt-1 cursor-pointer font-bold"
                                            >
                                                {homeStay.homeStay?.name}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'tourist',
                                title: 'Người đánh giá',
                                render: ({ tourist }) => (
                                    <div className=''>{tourist?.firstName + ' ' + tourist?.lastName}</div>
                                ),
                            },
                            {
                                accessor: 'rating',
                                title: 'Đánh giá',
                                render: ({rating}) => {
                                    return (
                                        <div className="flex h-auto flex-col">
                                                    {rating && (
                                                        <Rating
                                                            initialValue={
                                                                rating
                                                            }
                                                            size={20}
                                                            fillColor="#f1a545" // Màu sắc của sao được chọn (tuỳ chọn)
                                                            emptyColor="#cccccc"
                                                            iconsCount={5}
                                                            allowFraction={true}
                                                            readonly={true}
                                                            SVGclassName={
                                                                'inline-block'
                                                            }
                                                        />
                                                    )}
                                                </div>
                                    );
                                },
                            },
                            {
                                accessor: 'Nội dung',
                                title: 'Nội dung',
                                render: ({description}) => (
                                <div style={{ whiteSpace: 'pre-wrap', maxWidth: '250px' }}
                                    >
                                        {description}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'delete',
                                title: 'Xóa',
                                render: ({ id }) => (
                                    <button type="button" className="flex hover:text-danger" onClick={() => { setIsUpdate2(true); setSelectFeedback(id); }}>
                                        <IconTrashLines />
                                    </button>
                                ),
                            },
                            
                        ]}
                        
                        totalRecords={totalRecords}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={handlePageChange}
                        recordsPerPageOptions={[5, 10, 15]}
                        onRecordsPerPageChange={handleRecordPerPageChange}
                        // sortStatus={sortStatus}
                        // onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) =>
                            `Hiển thị  ${from} đến ${to} của ${totalRecords}`
                        }
                    />
                )}
                </div>
            </div>
            <ModalDeleteFeedback
                    modal17={isUpdate2}
                    setModal17={setIsUpdate2}
                    feedbackId={selectFeedback}
                    />
        </div>
    );
};

export default Managefeedback;
