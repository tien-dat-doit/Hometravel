import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Fragment, useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import IconEye from '../../../../components/Icon/IconEye';
import IconSettings from '../../../../components/Icon/IconSettings';
import Dropdown from '../../../../components/Dropdown';
import { IRootState } from '../../../../store';
import userAPI from '../../../../util/userAPI';

interface Users {
    id: string;
    phoneNumber: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    gender: boolean;
    dateOfBirth: string;
    status: string;
    type: string;
}
interface UserTypes {
    rowData: Users["type"];
    setIsUpdate: (data: boolean) => void;
    // paging:[
    //     {
    //         pageIndex: 1;
    //         pageSize: 10;
    //     }
    // ]
}
interface filterObject {
    pageIndex: number;
    pageSize: number;
    status: string | null;
    firstName:string;
    lastName: string;
}
const TableUsers: React.FC<UserTypes> = ({ rowData, setIsUpdate }) =>  {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Danh Sách Homestay'));
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalRecords, setTottalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [filterObject, setFilterObject] = useState<filterObject>({
        pageIndex: 1,
        pageSize: 10,
        status: null,
        firstName: '',
        lastName: '',
    });
    const handlePageChange = (p: any) => {
        setFilterObject({ ...filterObject, pageIndex: p });
    };
    const handleRecordPerPageChange = (p: any) => {
        setPageSize(p);
        setFilterObject({ ...filterObject, pageSize: p, pageIndex: 1 });
    };
    const handleSearchHomestay = (e: any) => {
        setFilterObject({ ...filterObject, firstName: e.target.value, lastName: e.target.value, pageIndex: 1});
    };
    const [recordsData, setRecordsData] = useState<Users[] | []>([]);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const touristResponse:any = await userAPI.getTourists(filterObject);
                const ownerResponse:any = await userAPI.getOwners(filterObject);
                // Combine data from both APIs into a single array of users

                // const combinedUsers:any= [
                //     ...touristResponse.data.map((tourist: any) => ({
                //         ...tourist,
                //         type: 'Tourist',
                //          // Add a type field to differentiate users as tourists
                //     })),
                //     ...ownerResponse.data.map((owner: any) => ({
                //         ...owner,
                //         type: 'Owner', // Add a type field to differentiate users as owners
                //     })),
                // ];
                
                // Update state with the merged data
                // setUsers(combinedUsers);
                // setRecordsData(combinedUsers);
                if (rowData === 'Owner') {
                    setRecordsData(ownerResponse.data);
                    setRecordsData((prevData) => prevData.map((user) => ({ ...user, type: 'Owner' })));
                    setPage(ownerResponse?.paging?.page ?? 1);
                    setTottalRecords(ownerResponse?.paging?.total ?? 10);
                    
                } else if (rowData === 'Tourist') {
                    setRecordsData(touristResponse.data);
                    setRecordsData((prevData) => prevData.map((user) => ({ ...user, type: 'Tourist' })));
                    setPage(touristResponse?.paging?.page ?? 1);
                    setTottalRecords(touristResponse?.paging?.total ?? 10);
                } else {
                    // setRecordsData(combinedUsers);
                    // setRecordsData(combinedUsers.data ?? []);
                    // setPage(combinedUsers?.paging?.page ?? 1);
                    // setTottalRecords(combinedUsers?.paging?.total ?? 10);
                }
                
                setLoading(false);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchUser();
    }, [filterObject]);
    
    return (
        <div>
        {loading ? (
            <div className='text-center'>
                <span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>
            </div>
        ) : (
        <DataTable
            highlightOnHover
            className="table-hover whitespace-nowrap"
            records={recordsData}
            
            columns={[
                {
                    accessor: 'STT',
                    title: 'STT',
                    render: (record, index) => {
                        return <span>{index + 1 + (page - 1) * pageSize}</span>;
                    },
                },
                {
                    accessor: 'userName',
                    title: 'Tên người dùng',
                    render: ({ firstName, lastName, avatar,id,type }) => (
                        <div className="flex w-max items-center">
                            <div className="flex items-center w-max">
                                <img src={avatar} alt="Avatar" className="w-9 h-9 rounded-full ltr:mr-2 rtl:ml-2 object-cover" />
                                <div className="mt-1 font-bold">
                                    <NavLink to={`/detailuser/${type}/${id}`} className="text-blue-500 hover:underline">
                                    {lastName + ' ' + firstName}
                                    
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    accessor: 'email',
                    title: 'Email',
                },
                {
                    accessor: 'type',
                    title: 'Vai trò',
                    render: (row) => (
                        <span>
                            {row.type === 'Tourist' ? (
                                <span className='' >
                                    Du khách
                                </span>
                            ) : (
                               ''
                            )}
                            {row.type === 'Owner' ? (
                                <span className='' >
                                    Chủ nhà
                                </span>
                            ) : (
                               ''
                            )}
                            {row.type === 'Admin' ? (
                                <span className='' >
                                    Admin
                                </span>
                            ) : (
                               ''
                            )}
                        </span>
                    ),
                },
                {
                    accessor: 'status',
                    title: 'Trạng Thái',
                    render: (row) => (
                        <span>
                            {row.status === 'ACTIVE' ? (
                                <span className='badge badge-outline-primary p-1.5' >
                                    Đang Hoạt Động
                                </span>
                            ) : (
                                <>
                                    
                                </>
                            )}
                            {row.status === 'DISABLE' ? (
                                <span className='badge badge-outline-danger p-1.5' >
                                   Ngưng Hoạt Động
                                </span>
                            ) : (
                                <>
                                    
                                </>
                            )}
                        </span>
                    ),
                },
              
            ]}
            onRowClick={({ id, type }) =>
                navigate(`/detailuser/${type}/${id}`)
            }
            totalRecords={totalRecords}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={handlePageChange}
            recordsPerPageOptions={[5, 10, 15]}
            onRecordsPerPageChange={handleRecordPerPageChange}
            paginationText={({ from, to, totalRecords }) =>
                `Hiển thị  ${from} đến ${to} của ${totalRecords}`
            }
            minHeight={200}
        />
        )}
        </div>
    );
};

export default TableUsers;
