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
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';

const Index = ({auth, rolesDefault, permissionsDefault}) => { 
    const [roles, setRoles] = useState(rolesDefault);
    const [permissions, setPermissions] = useState(permissionsDefault);
    const [modalRoleVisible, setModalRoleVisible] = useState(false);
    const [modalPermissionVisible, setModalPermissionVisible] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const toast = useRef(null);
    const modalRole = useRef(null);
    const modalPermission = useRef(null);
    const menuRight = useRef(null);
    const key = import.meta.env.VITE_ENCRYPTION_KEY;
    let prevPermissionGroupName = '';
    let isPrevPermissionGroupNameSame = false;

    // Role
    const { data, setData, post, put, reset, processing, errors }  = useForm({
        name: '',
        guard_name: 'web',
    });

    // Permission
    const { data: permissionInput, setData: setPermissionInput, post: postPermission, put: putPermission, reset: resetPermission }  = useForm({
        name: '',
        group_name: '',
    });

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    async function getRoles() {
        
        setIsLoadingData(true)
        
        let response = await fetch('/api/role');
        let data = await response.json();
   
        setRoles(prev => data.roles);
        setIsLoadingData(false)
    }

    async function getPermission() {
        
        setIsLoadingData(true)
        
        let response = await fetch('/api/permission');
        let permissions = await response.json();

        setPermissions(prev => permissions);
        setIsLoadingData(false)
    }
    
    
    useEffect( () => {
        
        getRoles();
        getPermission();

    }, []);

    const onRowRoleEditComplete = async (e) => {
        try {
            
            let { newData } = e;
            data.name = newData.name;
            data.guard_name = newData.guard_name;

            put(`/api/role/${newData.id}`, {
                onSuccess: ()=>{
                    data.name = '';
                    getRoles();
                    showSuccess('Edit');
                    reset('name');
                }
            })
            

        } catch (error) {
           
            console.error('Error:', error);
            showError();
        }
    };

    const onRowPermissionEditComplete = async (e) => {
        try {
            
            let { newData } = e;
            permissionInput.name = newData.name;
            permissionInput.group_name = newData.group_name;
        

            putPermission(`/api/permission/${newData.id}`, {
                onSuccess: () => {
                    permissionInput.name = '';
                    getPermission();
                    showSuccess('Edit');
                }
            })

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
        
        return <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => {
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
        }}>
        </Button>
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
            <div className="flex flex-row justify-left gap-2 align-items-center items-end">
            <div className="w-[30%]">
                <span className="p-input-icon-left">
                    <i className="pi pi-search dark:text-white" />
                    <InputText className='dark:bg-transparent dark:placeholder-white' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
            </div>
            
        );
    };

    const header = renderHeader();


    const handleChangePermissionRole = async (permissionId, role) => {
        setIsLoadingData(prev => true);
        let rolePermissionNew;
        
        if (role.permissionIds.includes(permissionId)) {
            rolePermissionNew = role.permissionIds.filter(item => item !== permissionId);
        } else {
            role.permissionIds.push(permissionId);
            rolePermissionNew = role.permissionIds;
        }
        
        try {
            await axios.put('/role-permission-sync/'+role.id, {
                data: rolePermissionNew
            });
            getRoles();
            showSuccess('Update')
        } catch (error) {
            showError('Update')
        }
        
    }

    return (
        <DashboardLayout auth={auth.user} className="">
        
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Modal role */}
            <div className="card flex justify-content-center">
                <Dialog
                    ref={modalRole}
                    header="Role"
                    headerClassName="shadow-lg dark:text-white"
                    className="bg-white  dark:glass dark:text-white"
                    contentClassName=' dark:glass dark:text-white'
                    visible={modalRoleVisible}
                    onHide={() => setModalRoleVisible(false)}
                    style={{width:'50vw'}}
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
                    headerClassName="shadow-md dark:text-white"
                    className="bg-white dark:glass dark:text-white"
                    style={{width:'50vw'}}
                    contentClassName=' dark:glass dark:text-white'
                    breakpoints={{}}
                    visible={modalPermissionVisible}
                    onHide={() => setModalPermissionVisible(false)}
                   
                >
                    <form onSubmit={(e) => handleSubmitForm(e, 'permission')}>    
                    <div className='flex flex-col justify-around gap-4 mt-4'>
                        <div className='flex flex-col'>   
                            <label htmlFor="name">Permission</label>
                            <InputText className='dark:bg-gray-300' id="name" value={permissionInput.name} onChange={(e) => setPermissionInput('name', e.target.value)} aria-describedby="name-help" />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="group_name">Grup</label>
                            <InputText id="group_name" value={permissionInput.group_name} onChange={(e) => setPermissionInput('guard_name', e.target.value)} aria-describedby="guard_name-help" />
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
                <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
                <Button label="Tambah" className="bg-purple-600 text-sm shadow-md rounded-lg mr-2" icon={addButtonIcon} onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup />
            </HeaderModule>

            <div className='flex w-[95%] max-w-[95%] mx-auto flex-col justify-center mt-5 gap-5'>
                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                    <DataTable
                    loading={isLoadingData}
                    className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md" 
                    pt={{
                        bodyRow: 'dark:bg-transparent bg-transparent dark:text-gray-300',
                        table: ' dark:bg-transparent bg-white rounded-lg dark:text-gray-300',
                        header: ''
                    }}
                    value={roles} rowEditorCancelIcon={rowEditorCancelIcon} rowEditorSaveIcon={rowEditorSaveIcon} editMode="row" dataKey="id" onRowEditComplete={onRowRoleEditComplete} >
                        <Column field="name" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Role" align='left' editor={(options) => NameEditor(options)} style={{ width: '30%' }}></Column>
                        <Column field="guard_name" className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' header="Guard" editor={(options) => GuardEditor(options)} style={{ width: '30%' }}></Column>
                        <Column header="Action" className='dark:border-none' rowEditor headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' colSpan={2} align='center' headerStyle={{ width: '5%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'right' }}></Column>
                        <Column className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' headerStyle={{width:'1%'}} body={(e)=>buttonDelete(e, 'role')} field="id"></Column>
                    </DataTable>
                </div>
                <div className="card p-fluid w-full h-auto flex  justify-center  rounded-lg  text-white">
                    <DataTable
                    loading={isLoadingData}
                    paginator 
                    rows={5}
                    filters={filters} 
                    emptyMessage="Permission tidak ditemukan."
                    paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                    className="w-full h-auto rounded-lg dark:text-gray-300 dark:glass border-none text-center shadow-md" 
                    pt={{
                        bodyRow: 'dark:bg-transparent bg-transparent dark:text-gray-300',
                        table: 'dark:bg-transparent bg-white rounded-lg dark:text-gray-300',
                    }}
                    header={header}
                    globalFilterFields={['name']}
                    style={{color: 'white'}}
                    value={permissions} rowEditorCancelIcon={rowEditorCancelIcon} rowEditorSaveIcon={rowEditorSaveIcon} editMode="row" dataKey="id" onRowEditComplete={onRowPermissionEditComplete} >
                        <Column field="name" sortable className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Perizinan" align='left' editor={(options) => NameEditor(options)} style={{ width: '30%' }}></Column>
                        <Column field="group_name" sortable className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' header="Grup" editor={(options) => GuardEditor(options)} style={{ width: '30%' }}></Column>
                        <Column 
                        header="Action" className='dark:border-none' rowEditor headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' colSpan={2}  align='center' headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'right' }}></Column>
                        <Column bodyStyle={{width:'10px'}} headerStyle={{width: '1%'}} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' body={(e)=>buttonDelete(e, 'permission')}></Column>
                    </DataTable>
                </div>
            </div>


            <div className="flex w-[95%] max-w-[95%] h-[80%] mx-auto my-5">
                    
                    <div className="card w-full h-full overflow-y-auto dark:glass flex rounded-lg justify-content-center overflow-x-auto shadow-md">
                        
                    <table className="w-full h-full bg-white dark:bg-transparent dark:border-none border-gray-300 text-black dark:text-gray-300">
                    <thead className='rounded-tr-lg'>
                        <tr className='rounded-tr-lg'>
                            <th className="py-2 px-4 border-b border-r dark:border-none">Perizinan</th>
                            <th className="py-2 px-4 border-b dark:border-none" colSpan={roles.length}>Role</th>
                            {/* {permissions.map((permission)=>{
                                return <th key={permission.id} class="py-2 px-4 border-b">{permission.name}</th>
                            })} */}
                        </tr>

                        <tr className='shadow-custome'>
                            <th className="py-2 px-4 border-b border-r dark:border-none">Aksi</th>
                            {roles.map((role) => {
                                return <th className="py-2 px-4 border-b border-r dark:border-none">{role.name}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody className=''>

                    {isLoadingData ? (
                        <tr>
                            <td colSpan={roles.length + 1}>
                                <div className='flex justify-center'>
                                    <ProgressSpinner />
                                </div>
                            </td>
                        </tr>
                    ) : (
                        permissions.map((permission, index) => (
                                <>
                                
                                {isPrevPermissionGroupNameSame = (prevPermissionGroupName === permission.group_name)}

                                {!isPrevPermissionGroupNameSame ? (
                                    <tr className='text-left bg-slate-50 dark:glass border dark:border-none'>
                                        <td className="py-2 px-4 bg-slate-50 dark:glass border-r dark:border-none"  colSpan={roles.length+1}>{permission.group_name}</td>
                                    </tr>
                                ): null}

                                <tr className='text-center border dark:border-none'>
                                    <td className="py-2 px-4 border-r dark:border-none">{permission.name}</td>
                                    {roles.map((role) => (
                                        <td key={`${permission.id}-${role.id}`} className='w-[60px] border-r dark:border-none'>
                                            <input
                                                type="checkbox"
                                                checked={role.permissionIds?.includes(permission.id)}
                                                onChange={() => handleChangePermissionRole(permission.id, role)}
                                                />
                                        </td>
                                    ))}
                                </tr>
                                    <div className='hidden'>
                                        {prevPermissionGroupName = permission.group_name}
                                    </div>
                                </>
                            
                            ))
                        )}

    
                    </tbody>
                    </table>
                   
                </div>
            </div>

            
            
        </DashboardLayout>
    );
}

export default Index;