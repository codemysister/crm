
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import DashboardLayout from '@/Layouts/DashboardLayout';
import HeaderModule from '@/Components/HeaderModule';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { useForm } from '@inertiajs/react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function Index({auth, productsDefault}) {
    
    const [products, setProducts] = useState(productsDefault);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [modalProductIsVisible, setModalProductIsVisible] = useState(false);
    const [modalEditProductIsVisible, setModalEditProductIsVisible] = useState(false);
    const toast = useRef(null);
    const modalProduct = useRef(null);
    const {roles, permissions} = auth.user;

    const { data, setData, post, put, delete: destroy, reset, processing, errors }  = useForm({
        uuid: '',
        name: '',
        category: '',
        price: '',
        unit: '',
        description: '',
    });

    const getProducts = async () => {
        setIsLoadingData(true)
        
        let response = await fetch('/api/products');
        let data = await response.json();
   
        setProducts(prev => data);
       
        setIsLoadingData(false)
    }

    useEffect(()=>{
        getProducts();
    }, [])

    let categories = [
        {name: 'Produk'},
        {name: 'Layanan'},
    ]
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => handleEditProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => {handleDeleteProduct(rowData)}} />
            </React.Fragment>
        );
    };

    // fungsi toast
    const showSuccess = (type) => {
        toast.current.show({severity:'success', summary: 'Success', detail:`${type} data berhasil`, life: 3000});
    }

    const showError = (type) => {
        toast.current.show({severity:'error', summary: 'Error', detail:`${type} data gagal`, life: 3000});
    }


    const handleEditProduct = (product) => {

        setData(data => ({ ...data, uuid: product.uuid}));
        setData(data => ({ ...data, name: product.name}));
        setData(data => ({ ...data, category: product.category}));
        setData(data => ({ ...data, price: product.price}));
        setData(data => ({ ...data, unit: product.unit}));
        setData(data => ({ ...data, description: product.description}));
        setModalEditProductIsVisible(true);
    };

    const handleDeleteProduct = (product) => {
        confirmDialog({
            message: 'Apakah Anda yakin untuk menghapus ini?',
            header: 'Konfirmasi hapus',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept : async ()=> {
                
                destroy('product/'+product.uuid, {
                    onSuccess: () => {
                        getProducts();
                        showSuccess('Hapus');
                    },
                    onError: () => {
                        showError('Hapus')
                    }
                })
            },
        });
    }

    const header = (
        <div className=" flex flex-row justify-left gap-2 align-items-center items-end">
            <div className="w-[30%]">
                <span className="p-input-icon-left">
                    <i className="pi pi-search dark:text-white" />
                    <InputText className='dark:bg-transparent dark:placeholder-white' type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span>
            </div>
        </div>
    );

    const addButtonIcon = () => {
        return <i className="pi pi-plus" style={{ fontSize: '0.7rem', paddingRight: '5px' }}></i>
    }

    const handleSubmitForm = (e, type) => {
   
        e.preventDefault();

        if(type ==='tambah'){
            
            post('/products', {
                onSuccess: () => {
                    showSuccess('Tambah');
                    setModalProductIsVisible(prev => false);
                    getProducts();
                    reset('name', 'category', 'price', 'unit', 'description')
                },
                onError: () => {
                    showError('Tambah');
                }    
            });
            
        }else{

            put('/products/'+data.uuid, {
                onSuccess: () => {
                    showSuccess('Update');
                    setModalEditProductIsVisible(prev => false);
                    getProducts();
                    reset('name', 'category', 'price', 'unit', 'description')
                },
                onError: () => {
                    showError('Update');
                }    
            });
        }

        
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <ConfirmDialog />

            <HeaderModule title="Produk">
            {permissions.includes('tambah_produk') && (
                <Button label="Tambah" className="bg-purple-600 text-sm shadow-md rounded-lg mr-2" icon={addButtonIcon} onClick={() => {
                    setModalProductIsVisible(prev => prev=true)
                    reset('name','category','price','unit','description')
                    }} aria-controls="popup_menu_right" aria-haspopup />
            )}
            </HeaderModule>

            {/* Modal tambah produk */}
            <div className="card flex justify-content-center">
                <Dialog
                    ref={modalProduct}
                    header="Produk"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=' dark:glass dark:text-white'
                    visible={modalProductIsVisible}
                    onHide={() => setModalProductIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, 'tambah')}>    
                    <div className='flex flex-col justify-around gap-4 mt-4'>
                        <div className='flex flex-col'>   
                            <label htmlFor="name">Nama</label>
                            <InputText value={data.name} onChange={(e) => setData('name', e.target.value)} className='dark:bg-gray-300' id="name" aria-describedby="name-help" />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="category">Kategori</label>
                            <Dropdown value={data.category} onChange={(e) => setData('category', e.target.value)} options={categories} optionLabel="name" 
                             placeholder="Pilih Kategori" className="w-full md:w-14rem" />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="price">Harga</label>
                            <InputText id="price" value={data.price} onChange={(e) => setData('price', e.target.value)}  aria-describedby="price-help" />
                        </div>
                        <div className='flex flex-col'>   
                            <label htmlFor="unit">Unit</label>
                            <InputText className='dark:bg-gray-300' value={data.unit} onChange={(e) => setData('unit', e.target.value)} id="unit" aria-describedby="unit-help" />
                        </div>
                        <div className='flex flex-col'>   
                            <label htmlFor="description">Description</label>
                            <InputTextarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={5} cols={30} />
                        </div>

                    </div>
                    <div className='flex justify-center mt-5'>
                        <Button
                            label="Submit" disabled={processing}  className="bg-purple-600 text-sm shadow-md rounded-lg"
                        />
                        </div>
                    </form>
                </Dialog>
             </div>

            {/* Modal edit produk */}
            <div className="card flex justify-content-center">
                <Dialog
                    ref={modalProduct}
                    header="Produk"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=' dark:glass dark:text-white'
                    visible={modalEditProductIsVisible}
                    onHide={() => setModalEditProductIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, 'update')}>    
                    <div className='flex flex-col justify-around gap-4 mt-4'>
                        <div className='flex flex-col'>   
                            <label htmlFor="name">Nama</label>
                            <InputText value={data.name} onChange={(e) => setData('name', e.target.value)} className='dark:bg-gray-300' id="name" aria-describedby="name-help" />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="category">Kategori</label>
                            <Dropdown optionValue="name" value={data.category} optionLabel="name" onChange={(e) => setData('category', e.target.value)} options={categories} 
                            placeholder="Pilih Kategori" className="w-full md:w-14rem dark:bg-gray-300" />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="price">Harga</label>
                            <InputText className='dark:bg-gray-300' id="price" value={data.price} onChange={(e) => setData('price', e.target.value)}  aria-describedby="price-help" />
                        </div>
                        <div className='flex flex-col'>   
                            <label htmlFor="unit">Unit</label>
                            <InputText className='dark:bg-gray-300' value={data.unit} onChange={(e) => setData('unit', e.target.value)} id="unit" aria-describedby="unit-help" />
                        </div>
                        <div className='flex flex-col'>   
                            <label htmlFor="description">Description</label>
                            <InputTextarea className='dark:bg-gray-300' value={data.description} onChange={(e) => setData('description', e.target.value)} rows={5} cols={30} />
                        </div>

                    </div>
                    <div className='flex justify-center mt-5'>
                        <Button
                            label="Submit" disabled={processing} className="bg-purple-600 text-sm shadow-md rounded-lg"
                        />
                        </div>
                    </form>
                </Dialog>
             </div>

                    {console.log(permissions.includes('tambah_produk'))}
            <div className='flex w-[95%] max-w-[95%] mx-auto flex-col justify-center mt-5 gap-5'>
                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                <DataTable
                    loading={isLoadingData}
                    className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md" 
                    pt={{
                        bodyRow: 'dark:bg-transparent bg-transparent dark:text-gray-300',
                        table: 'dark:bg-transparent bg-white rounded-lg dark:text-gray-300',
                        header: ''
                    }}
                    paginator 
                    rows={5}
                    emptyMessage="Produk tidak ditemukan."
                    paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                    header={header}
                    value={products} dataKey="id" >
                        <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} className='dark:border-none pl-6' headerClassName='dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300'/>
                        <Column field="uuid" hidden className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Nama" align='left' style={{ width: '20%' }}></Column>
                        <Column field="name" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Nama" align='left' style={{ width: '20%' }}></Column>
                        <Column field="category" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Kategori" align='left' style={{ width: '20%' }}></Column>
                        <Column field="price" className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' header="Harga" style={{ width: '10%' }}></Column>
                        <Column field="unit" className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' header="Unit" style={{ width: '10%' }}></Column>
                        <Column field="description" className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' header="Deskripsi" style={{ width: '20%' }}></Column>
                        {(permissions.includes('hapus_produk') && permissions.includes('edit_produk')) && (
                            <Column header="Action" body={actionBodyTemplate} style={{ minWidth: '12rem' }} className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300'></Column>
                        )}
                    
                    </DataTable>
                </div>

            </div>
         
        </DashboardLayout>
    );
}
        