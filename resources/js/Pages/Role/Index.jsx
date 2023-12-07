import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import './Index.css';
import HeaderModule from '@/Components/HeaderModule';

const Index = ({auth}) => { 
    const [roles, setRoles] = useState(null);
    const [permissions, setPermissions] = useState(null);
    const [modalRoleVisible, setModalRoleVisible] = useState(false);
    const [modalPermissionVisible, setModalPermissionVisible] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const toast = useRef(null);
    const modalRole = useRef(null);
    const modalPermission = useRef(null);
    const menuRight = useRef(null);
    const key = import.meta.env.VITE_ENCRYPTION_KEY;

    // Role
    const { data, setData, post, reset, processing, errors }  = useForm({
        name: '',
        guard_name: 'web',
    });

    const { data: permissionInput, setData: setPermissionInput, post: postPermission, reset: resetPermission }  = useForm({
        name: '',
        guard_name: 'web',
    });

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    async function getRoles() {
        
        setIsLoadingData(true)
        
        let response = await fetch('/api/role');
        let rolesEncrypted = await response.json();
    
        let roles = CryptoJSAesJson.decrypt(rolesEncrypted, key);
   
        setRoles(prev => roles);
        setIsLoadingData(false)
    }

    async function getPermission() {
        
        setIsLoadingData(true)
        
        let response = await fetch('/api/permission');
        let permissionEncrypted = await response.json();
    
        let permissions = CryptoJSAesJson.decrypt(permissionEncrypted, key);
        setPermissions(prev => permissions);
        setIsLoadingData(false)
    }
    
    
    useEffect( () => {
        
        getRoles();
        getPermission();

    }, []);

    const onRowRoleEditComplete = async (e) => {
        try {
            let _roles = [...roles];
            let { newData, index } = e;
            _roles[index] = newData;
            
            let response = await axios.put(`/api/role/${newData.id}`, newData, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            let data = response.data;
            
            getRoles();
            showSuccess('Edit');

        } catch (error) {
           
            console.error('Error:', error);
            showError();
        }
    };

    const onRowPermissionEditComplete = async (e) => {
        try {
            let _permissions = [...permissions];
            let { newData, index } = e;
            _permissions[index] = newData;
    
            let response = await axios.put('/api/permission/' + newData.id, newData, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            let data = response.data;
            
            getPermission();
            showSuccess('Edit');

        } catch (error) {
           
            console.error('Error:', error);
            showError();
        }
    };

    // fungsi toast
    const showSuccess = (type) => {
        toast.current.show({severity:'success', summary: 'Success', detail:`${type} data berhasil`, life: 3000});
    }

    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Edit data gagal', life: 3000});
    }

    const NameEditor = (options) => {
        return <InputText type="text" className="rounded-lg text-center border-gray-300 dark:bg-gray-700 dark:text-white" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };
    
    const GuardEditor = (options) => {
        return <InputText type="text" className="rounded-lg text-center border-gray-300 dark:bg-gray-700 dark:text-white" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const rowEditorInitIcon = () => {
        return <svg className="fill-slate-500 dark:fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M8.707 19.707 18 10.414 13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586 19.414 9 21 7.414z"></path></svg>
    }

    const rowEditorSaveIcon = () => {
        return <svg className="fill-slate-500 dark:fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
    }

    const rowEditorCancelIcon = () => {
        return <svg className="fill-slate-500 dark:fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
    }

    
    const addButtonIcon = () => {
        return <i className="pi pi-plus" style={{ fontSize: '0.7rem', paddingRight: '5px' }}></i>
    }
 
    const buttonDelete = (data, type) => {
        return <button onClick={() => {
            confirmDialog({
                message: 'Apakah Anda yakin untuk menghapus ini?',
                header: 'Konfirmasi hapus',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                accept : async ()=> {
                    
                    if(type==='role'){
                        await axios.delete('/api/role/'+ data.id, {method:'delete'});
                        getRoles();
                    }else{
                        await axios.delete('/api/permission/'+ data.id, {method:'delete'});
                        getPermission();
                    }
                    showSuccess('Hapus');
                },
            });
        }}><svg className='fill-red-300' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"></path></svg></button>
    }


    const handleSubmitForm = (e, type) => {
        e.preventDefault();
        if(type == 'role'){
            post('/'+type, {
                onSuccess: () => {
                    showSuccess('Tambah');
                    setModalRoleVisible(prev => false);
                    getRoles();
                    reset('name');
                    }    
            });
        }else{
            postPermission('/'+type, {
                onSuccess: () => {
                    showSuccess('Tambah');
                    setModalPermissionVisible(prev => false);
                    getPermission();
                    reset('name');
                    }    
            });
        }
        
    }

    const items = [
        {
            label: 'Opsi',
            items: [
                {
                    label: 'Role',
                    icon: 'pi pi-user',
                    command: () => {
                        setModalRoleVisible(true)
                    }
                },
                {
                    label: 'Perizinan',
                    icon: 'pi pi-verified',
                    command: () => {
                        setModalPermissionVisible(true)
                    }
                }
            ]
        }
    ];

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="dark:glass flex justify-content-end rounded-tl-lg rounded-tr-lg">
                <span className=" p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText className='dark:bg-transparent dark:text-white' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <DashboardLayout auth={auth.user} className="">
        
        
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Modal role */}
            <div className="card flex justify-content-center">
                <Dialog
                    ref={modalRole}
                    header="Role"
                    headerClassName="glass shadow-md dark:text-white"
                    className="bg-white  dark:glass dark:text-white"
                    contentClassName=' dark:glass dark:text-white'
                    visible={modalRoleVisible}
                    onHide={() => setModalRoleVisible(false)}
                    
                    // breakpoints={{ '960px': '30vw', '641px': '30vw', '0px' : '30vw' }}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, 'role')}>    
                    <div className='flex flex-col justify-around gap-4 mt-4'>
                        <div className='flex flex-col'>   
                            <label htmlFor="name">Role</label>
                            <InputText className='dark:bg-gray-300' id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} aria-describedby="name-help" />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="guard_name">Guard</label>
                            <InputText id="guard_name" value={data.guard_name} onChange={(e) => setData('guard_name', e.target.value)} aria-describedby="guard_name-help" />
                        </div>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <Button
                            label="Submit"  className="bg-purple-600 text-sm shadow-md rounded-lg"
                        />
                        </div>
                    </form>
                </Dialog>
             </div>

            {/* Modal permission */}
            <div className="card flex justify-content-center">
                <Dialog
                    ref={modalPermission}
                    header="Permission"
                    headerClassName="glass shadow-md dark:text-white"
                    className="bg-white dark:glass dark:text-white"
                    contentClassName=' dark:glass dark:text-white'
                    visible={modalPermissionVisible}
                    onHide={() => setModalPermissionVisible(false)}
                 
                    breakpoints={{ '960px': '30vw', '641px': '100vw' }}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, 'permission')}>    
                    <div className='flex flex-col justify-around gap-4 mt-4'>
                        <div className='flex flex-col'>   
                            <label htmlFor="name">Permission</label>
                            <InputText className='dark:bg-gray-300' id="name" value={permissionInput.name} onChange={(e) => setPermissionInput('name', e.target.value)} aria-describedby="name-help" />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="guard_name">Guard</label>
                            <InputText disabled id="guard_name" value={permissionInput.guard_name} onChange={(e) => setPermissionInput('guard_name', e.target.value)} aria-describedby="guard_name-help" />
                        </div>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <Button
                            label="Submit"  className="bg-purple-600 text-sm shadow-md rounded-lg"
                        />
                        </div>
                    </form>
                </Dialog>
             </div>  

            <HeaderModule title="Role & Perizinan">
                {/* <Button
                    label="Tambah" icon={addButtonIcon} className="bg-purple-600 text-sm shadow-md rounded-lg"
                    onClick={() => setModalVisible(true)}
                /> */}
                <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
                <Button label="Tambah" className="bg-purple-600 text-sm shadow-md rounded-lg mr-2" icon={addButtonIcon} onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup />
            </HeaderModule>

            <div className='flex w-[95%] mx-auto flex-col md:flex-row justify-center gap-2 md:gap-10 '>
                <div className="card p-fluid md:w-1/2 h-full flex justify-center rounded-lg mt-5">
                    <DataTable
                    loading={isLoadingData}
                    className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md" 
                    pt={{
                        bodyRow: 'dark:bg-transparent bg-transparent dark:text-white',
                        table: ' dark:bg-transparent bg-white rounded-lg dark:text-white',
                    }}
                    value={roles} rowEditorInitIcon={rowEditorInitIcon} rowEditorCancelIcon={rowEditorCancelIcon} rowEditorSaveIcon={rowEditorSaveIcon} editMode="row" dataKey="id" onRowEditComplete={onRowRoleEditComplete} >
                        <Column field="name" className='dark:border-none' headerClassName='bg-transparent dark:bg-transparent dark:text-white' header="Role" align='center' editor={(options) => NameEditor(options)} style={{ width: '30%' }}></Column>
                        <Column field="guard_name" className='dark:border-none' headerClassName='bg-transparent dark:bg-transparent dark:text-white' align='center' header="Guard" editor={(options) => GuardEditor(options)} style={{ width: '30%' }}></Column>
                        <Column header="Edit" className='dark:border-none' rowEditor headerClassName='bg-transparent dark:bg-transparent dark:text-white' align='center' headerStyle={{ width: '30%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column className='dark:border-none' headerClassName='bg-transparent dark:bg-transparent dark:text-white' align='center' header="Action" body={(e)=>buttonDelete(e, 'role')} field="id"></Column>
                    </DataTable>
                </div>
                <div className="card p-fluid md:w-1/2 h-auto flex justify-center rounded-lg mt-5 text-white">
                    <DataTable
                    loading={isLoadingData}
                    paginator 
                    rows={5}
                    filters={filters} 
                    emptyMessage="Permission tidak ditemukan."
                    paginatorClassName="dark:bg-transparent tes dark:border-b-0 dark:border-t text-red-500 dark:text-white"
                    className="w-full h-auto rounded-lg dark:text-white dark:glass border-none text-center shadow-md" 
                    pt={{
                        bodyRow: 'dark:bg-transparent bg-transparent dark:text-white',
                        table: 'dark:bg-transparent bg-white rounded-lg dark:text-white',
                    }}
                    header={header}
                    globalFilterFields={['name']}
                    style={{color: 'white'}}
                    value={permissions} rowEditorInitIcon={rowEditorInitIcon} rowEditorCancelIcon={rowEditorCancelIcon} rowEditorSaveIcon={rowEditorSaveIcon} editMode="row" dataKey="id" onRowEditComplete={onRowPermissionEditComplete} >
                        <Column field="name" sortable className='dark:border-none' headerClassName='bg-transparent dark:bg-transparent dark:text-white' header="Perizinan" align='center' editor={(options) => NameEditor(options)} style={{ width: '30%' }}></Column>
                        <Column field="guard_name" sortable className='dark:border-none' headerClassName='bg-transparent dark:bg-transparent dark:text-white' align='center' header="Guard" editor={(options) => GuardEditor(options)} style={{ width: '30%' }}></Column>
                        <Column header="Edit" className='dark:border-none' rowEditor headerClassName='bg-transparent dark:bg-transparent dark:text-white' align='center' headerStyle={{ width: '30%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column className='dark:border-none' headerClassName='bg-transparent dark:bg-transparent dark:text-white' align='center' header="Action" body={(e)=>buttonDelete(e, 'permission')}></Column>
                    </DataTable>
                </div>
            </div>
               
            
        </DashboardLayout>
    );
}

export default Index;