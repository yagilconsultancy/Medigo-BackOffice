import { GridColSpec } from '../AppDataGrid';

const COL_WIDTH = 200;
type Employee = {
  id: string | number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'read' | 'unread';
  action?: any;
};
export const columns: GridColSpec<Employee>[] = [
  {
    field: 'fullName',
    headerName: 'Full Name',
    headerAlign: 'center',
    align: 'center',
    width: COL_WIDTH,
  },
  {
    field: 'email',
    headerName: 'Email',
    headerAlign: 'center',
    align: 'center',
    width: COL_WIDTH,
  },
  {
    field: 'phone',
    headerName: 'Phone No',
    headerAlign: 'center',
    align: 'center',
    width: COL_WIDTH,
  },
  {
    field: 'message',
    headerName: 'Message',
    headerAlign: 'center',
    align: 'center',
    width: COL_WIDTH,
  },
  {
    field: 'date',
    headerName: 'Date',
    headerAlign: 'center',
    align: 'center',
    width: COL_WIDTH,
  },
  {
    field: 'status',
    headerName: 'Status',
    headerAlign: 'center',
    align: 'center',
    width: COL_WIDTH,
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'center',
    align: 'center',
    width: COL_WIDTH,
  },
];
